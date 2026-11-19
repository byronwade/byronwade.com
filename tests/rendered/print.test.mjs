import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const PAGES = [
	{ path: "/blog/building-thorbis", controls: ["Share this post", "Back to writing"] },
	{ path: "/projects/fakebase", controls: ["Continue"] },
];

test("posts and case studies print in the light theme, without their screen controls", {
	timeout: 120_000,
}, async (context) => {
	const results = await withProductionServer((origin) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, (browser) => {
			const printOne = async ({ path, controls }) => {
				const page = await browser.newPage();
				page.setDefaultTimeout(10_000);
				await page.setViewport({ width: 816, height: 1056 });
				await page.evaluateOnNewDocument(() => localStorage.setItem("theme", "dark"));
				assert.ok((await page.goto(`${origin}${path}`, { waitUntil: "load" })).ok());
				await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
				await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
				await page.emulateMediaType("print");
				const printed = await page.evaluate((labels) => {
					const visible = (label) =>
						[...document.querySelectorAll("main *")].some(
							(el) =>
								el.childElementCount === 0 &&
								el.textContent.trim() === label &&
								el.getClientRects().length > 0
						);
					return {
						dark: document.documentElement.classList.contains("dark"),
						shown: labels.filter(visible),
					};
				}, controls);
				await page.emulateMediaType(null);
				await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
				const restored = await page.evaluate(() =>
					document.documentElement.classList.contains("dark")
				);
				await page.close();
				return { path, ...printed, restored };
			};
			return Promise.all(PAGES.map(printOne));
		})
	);

	for (const { path, dark, shown, restored } of results) {
		assert.equal(dark, false, `${path} should print with the light tokens`);
		assert.deepEqual(shown, [], `${path} should leave its screen controls off paper`);
		assert.equal(restored, true, `${path} should return to the dark theme after printing`);
	}
});
