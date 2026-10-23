import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const CORE = "/fonts/inter-latin-core.woff2";
const FULL_LATIN = "/fonts/UcCo3FwrK3iLTcviYwY.woff2";
const MONO_CORE = "/fonts/geist-mono-latin-core.woff2";
const MONO_FULL = "/fonts/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2";
// All 119 encoded characters in the derived Mono asset, including ASCII syntax.
const MONO_SAMPLE =
	Array.from({ length: 95 }, (_, index) => String.fromCodePoint(index + 0x20)).join("") +
	" §©«·»×é–—‘’‚“”„•…′″‹›↑↓";

/** The fonts each node's text actually rendered with, by CDP's platform font report. */
async function renderedFamilies(client, selectors) {
	// One document request: a second one would invalidate the node ids from the first.
	const { root } = await client.send("DOM.getDocument", { depth: -1 });
	return Promise.all(
		selectors.map(async (selector) => {
			const { nodeId } = await client.send("DOM.querySelector", { nodeId: root.nodeId, selector });
			assert.ok(nodeId, `${selector} exists`);
			const { fonts } = await client.send("CSS.getPlatformFontsForNode", { nodeId });
			return fonts;
		})
	);
}

test("pages use the Latin core fonts and keep the full faces available for uncovered text", {
	timeout: 300_000,
}, async (context) => {
	const manifest = JSON.parse(
		await readFile(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	// Every prerendered page, the dynamic search results that print the query back,
	// and the not-found page a mistyped address reaches.
	const routes = [
		...Object.keys(manifest.routes).filter(
			(path) => !(path.includes(".") || path.startsWith("/api/") || path.startsWith("/_"))
		),
		"/search?q=design",
		"/no-such-page",
	];
	assert.ok(routes.length > 30, "the build lists its published pages");

	await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			const client = await page.createCDPSession();
			await client.send("DOM.enable");
			await client.send("CSS.enable");
			let fonts = [];
			let themeScript;
			// Each visit is a cold load, so every font it needs is requested again.
			await page.setCacheEnabled(false);
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (!request.url().startsWith(url)) {
					request.respond({ status: 204, body: "" });
					return;
				}
				if (request.resourceType() === "font") {
					fonts.push(new URL(request.url()).pathname);
				}
				request.continue();
			});

			const visit = async (path, scheme) => {
				fonts = [];
				if (themeScript) {
					await page.removeScriptToEvaluateOnNewDocument(themeScript.identifier);
				}
				themeScript = await page.evaluateOnNewDocument(
					(value) => localStorage.setItem("theme", value),
					scheme
				);
				await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
				const response = await page.goto(url + path, { waitUntil: "networkidle0" });
				const expected = path === "/no-such-page" ? 404 : 200;
				assert.equal(response.status(), expected, path);
				assert.equal(
					await page.evaluate(() => document.documentElement.classList.contains("dark")),
					scheme === "dark",
					"the requested theme is applied"
				);
				await page.evaluate(() => document.fonts.ready);
				return fonts;
			};

			// One page, serial visits: navigations cannot overlap on a shared page.
			await routes.reduce(async (previous, path) => {
				await previous;
				const requested = await visit(path, "light");
				assert.ok(requested.includes(CORE), `${path} loads the core subset`);
				// The full face loading too would cost more than the original single file.
				assert.ok(!requested.includes(FULL_LATIN), `${path} needs no character outside the core`);
				assert.ok(!requested.includes(MONO_FULL), `${path} needs no full Latin Mono face`);
				const usesMono = await page.evaluate(() =>
					[...document.querySelectorAll(".font-mono, pre, code")].some(
						(element) => element.getClientRects().length && element.textContent.trim()
					)
				);
				assert.equal(requested.includes(MONO_CORE), usesMono, `${path} loads Mono only when used`);
			}, Promise.resolve());

			// Weight 500 (the title) and 400 (body text) both resolve to the subset, in both themes.
			await ["light", "dark"].reduce(async (previous, scheme) => {
				await previous;
				await page.setViewport({ width: scheme === "dark" ? 1280 : 390, height: 900 });
				const requested = await visit("/projects/thorbis", scheme);
				assert.deepEqual(
					requested.filter((file) => file.includes("UcCo3") || file.includes("inter-")),
					[CORE]
				);
				const families = await renderedFamilies(client, ["main h1", "main header p.text-pretty"]);
				for (const resolved of families) {
					assert.deepEqual(
						resolved.map(({ familyName, isCustomFont }) => ({ familyName, isCustomFont })),
						[{ familyName: "Inter", isCustomFont: true }],
						`the title and lede in ${scheme} render entirely in Inter`
					);
				}
				assert.ok(
					requested.includes(MONO_CORE),
					`the project preview uses the Mono core in ${scheme}`
				);
				assert.ok(!requested.includes(MONO_FULL), "the full Mono face stays deferred");
				// Check both declared weights, punctuation, and code syntax. Text outside the
				// core is checked separately so these samples must not request the full face.
				await page.evaluate((text) => {
					for (const weight of [400, 500]) {
						const sample = document.createElement("code");
						sample.dataset.monoWeight = String(weight);
						sample.className = "font-mono";
						sample.style.fontWeight = String(weight);
						sample.textContent = text;
						document.querySelector("main").append(sample);
					}
				}, MONO_SAMPLE);
				await page.evaluate(() => document.fonts.ready);
				const monoFamilies = await renderedFamilies(client, [
					'[data-mono-weight="400"]',
					'[data-mono-weight="500"]',
				]);
				for (const resolved of monoFamilies) {
					assert.deepEqual(
						resolved.map(({ familyName, isCustomFont }) => ({ familyName, isCustomFont })),
						[{ familyName: "Geist Mono", isCustomFont: true }],
						`both weights render entirely in Geist Mono in ${scheme}`
					);
				}
				assert.ok(!fonts.includes(MONO_FULL), "covered sample text needs only the Mono core");
			}, Promise.resolve());

			// A character the core lacks still renders in Inter, from the full face.
			const requested = await visit(`/search?q=${encodeURIComponent("Müller")}`, "light");
			assert.ok(requested.includes(FULL_LATIN), "an uncovered Latin character loads the full face");
			const echoed = await page.evaluate(() => {
				const echo = [...document.querySelectorAll("main *")].find(
					(element) => element.children.length === 0 && element.textContent.includes("Müller")
				);
				echo?.setAttribute("data-uncovered", "");
				return Boolean(echo);
			});
			assert.ok(echoed, "search prints the query back");
			const [used] = await renderedFamilies(client, ["[data-uncovered]"]);
			assert.ok(
				used.every(({ familyName, isCustomFont }) => familyName === "Inter" && isCustomFont),
				`the uncovered query renders in Inter: ${JSON.stringify(used)}`
			);

			// Runtime text with an accented character outside the core must retain Mono,
			// too. The browser chooses its existing full Latin face without application JS.
			await page.evaluate(() => {
				const sample = document.createElement("code");
				sample.dataset.monoUncovered = "";
				sample.className = "font-mono";
				sample.textContent = "Müller";
				document.querySelector("main").append(sample);
			});
			await page.waitForFunction(() => document.fonts.check('400 14px "Geist Mono"', "Müller"));
			await page.evaluate(() => document.fonts.ready);
			assert.ok(fonts.includes(MONO_FULL), "uncovered Mono text loads the full Latin face");
			const [monoUsed] = await renderedFamilies(client, ["[data-mono-uncovered]"]);
			assert.deepEqual(
				monoUsed.map(({ familyName, isCustomFont }) => ({ familyName, isCustomFont })),
				[{ familyName: "Geist Mono", isCustomFont: true }],
				"the uncovered Mono text retains its font family"
			);
		})
	);
});
