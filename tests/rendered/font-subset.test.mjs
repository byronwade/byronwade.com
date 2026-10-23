import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const CORE = "/fonts/inter-latin-core.woff2";
const FULL_LATIN = "/fonts/UcCo3FwrK3iLTcviYwY.woff2";

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

test("every page renders Inter from the Latin core subset alone", {
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
				await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
				const response = await page.goto(url + path, { waitUntil: "networkidle0" });
				const expected = path === "/no-such-page" ? 404 : 200;
				assert.equal(response.status(), expected, path);
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
		})
	);
});
