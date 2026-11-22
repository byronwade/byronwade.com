import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

test("on wide screens the breadcrumb, left of the header, is reached before it by Tab", {
	timeout: 120_000,
}, async (context) => {
	const stops = await withProductionServer((origin) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			await page.setViewport({ width: 1440, height: 900 });
			assert.ok((await page.goto(`${origin}/projects`, { waitUntil: "load" })).ok());
			await page.waitForSelector('nav[aria-label="Breadcrumb"] a');
			const where = () =>
				page.evaluate(() => {
					const el = document.activeElement;
					if (el?.closest('nav[aria-label="Breadcrumb"]')) {
						return "breadcrumb";
					}
					if (el?.closest("[data-site-header]")) {
						return "header";
					}
					return el?.textContent?.trim().slice(0, 30) ?? "";
				});
			const seen = [];
			for (const _ of [1, 2, 3, 4]) {
				// biome-ignore lint/performance/noAwaitInLoops: each Tab depends on the last
				await page.keyboard.press("Tab");
				seen.push(await where());
			}
			return seen;
		})
	);

	assert.deepEqual(stops, ["Skip to main content", "breadcrumb", "breadcrumb", "header"]);
});
