import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const NO_MATCHES = /No matches/;

test("production search finds readable inline identifiers and keeps native GET submission", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer(async (origin) => {
		await withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(20_000);
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			const states = [390, 1280].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			);
			// All cases share one page and must run serially.
			await states.reduce(async (previous, { width, theme }) => {
				await previous;
				await context.test(`${width}px ${theme}: body search and keyboard submit`, async () => {
					await page.setViewport({ width, height: 900 });
					const themeScript = await page.evaluateOnNewDocument((value) => {
						localStorage.setItem("theme", value);
					}, theme);
					try {
						const query = `claude_desktop_config.json   Claude${" ".repeat(120)}Desktop`;
						const response = await page.goto(`${origin}/search?q=${encodeURIComponent(query)}`);
						assert.equal(response.status(), 200);
						assert.equal(await page.$eval("h1", (heading) => heading.textContent), "Search");
						assert.equal(
							await page.$eval("html", (html) => html.classList.contains("dark")),
							theme === "dark"
						);
						assert.equal(
							await page.$eval("#site-search", (input) => input.value),
							"claude_desktop_config.json Claude Desktop"
						);
						assert.ok(await page.$('main a[href="/projects/memoria"]'));
						assert.ok(
							await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
						);
						await page.focus("#site-search");
						await page.keyboard.down("Control");
						await page.keyboard.press("a");
						await page.keyboard.up("Control");
						await page.keyboard.type("zz-no-readable-result");
						await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
						assert.equal(new URL(page.url()).searchParams.get("q"), "zz-no-readable-result");
						assert.match(await page.$eval("main", (main) => main.textContent), NO_MATCHES);
					} finally {
						await page.removeScriptToEvaluateOnNewDocument(themeScript.identifier);
					}
				});
			}, Promise.resolve());
			assert.deepEqual(errors, []);
		});
	});
});
