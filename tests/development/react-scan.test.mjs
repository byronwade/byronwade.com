import assert from "node:assert/strict";
import { test } from "node:test";
import { axeVersion, injectAxe, readAxe } from "../../scripts/axe-audit.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// Run against an already-owned dev server; this separate check never starts a
// second Next process or changes the production rendered suite's environment.
const origin = process.env.DEVELOPMENT_ORIGIN;
assert.ok(origin, "Set DEVELOPMENT_ORIGIN to your running npm run dev server");

async function checkPage(browser, context, { width, theme }) {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	try {
		page.setDefaultTimeout(15_000);
		await page.setViewport({ width, height: 900 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
		const response = await page.goto(origin, {
			waitUntil: "domcontentloaded",
			timeout: 30_000,
		});
		assert.ok(response.ok(), `development server answered ${response.status()}`);
		await page.waitForFunction(() => window.__REACT_SCAN__?.ReactScanInternals.instrumentation);
		await page.waitForSelector("[data-react-scan]");
		assert.equal(
			await page.evaluate(() => document.documentElement.classList.contains("dark")),
			theme === "dark"
		);
		assert.equal(
			await page.evaluate(
				() => window.__REACT_SCAN__.ReactScanInternals.instrumentation.isPaused.value
			),
			false
		);
		// Observe actual React renders through the package's onRender callback;
		// checking only for an absent toolbar could pass with scanning removed.
		await page.evaluate(() => {
			window.scanTestRenderCount = 0;
			const options = window.__REACT_SCAN__.ReactScanInternals.options.value;
			const onRender = options.onRender;
			options.onRender = (...args) => {
				window.scanTestRenderCount += 1;
				onRender?.(...args);
			};
		});
		await page.focus('button[aria-label="Search (⌘K)"]');
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
		await page.keyboard.type("react");
		await page.waitForFunction(() => window.scanTestRenderCount > 0);
		await page.keyboard.press("Escape");
		await page.waitForSelector("[data-header-search]", { hidden: true });
		await page.evaluate(() => document.fonts.ready);
		await injectAxe(page);
		const { version, violations, incomplete } = await page.evaluate(readAxe);
		assert.equal(version, axeVersion);
		assert.deepEqual(violations, [], JSON.stringify(violations));
		assert.deepEqual(errors, [], "development interactions have no runtime errors");
		assert.equal(
			await page.evaluate(() => Boolean(window.__REACT_SCAN_TOOLBAR_CONTAINER__)),
			false
		);
		context.diagnostic(
			JSON.stringify({
				chrome: await browser.version(),
				axe: version,
				renders: await page.evaluate(() => window.scanTestRenderCount),
				incomplete,
			})
		);
	} finally {
		await page.close();
	}
}

test("development scanning preserves accessible site interactions", {
	timeout: 180_000,
}, async (t) => {
	await withBrowser(t, { timeout: 30_000, protocolTimeout: 30_000 }, async (browser) => {
		// Keep one page active at a time, matching the rendered accessibility check.
		await [390, 1280]
			.flatMap((width) => ["light", "dark"].map((theme) => ({ width, theme })))
			.reduce(
				(pending, viewport) =>
					pending.then(() =>
						t.test(`${viewport.width}px ${viewport.theme}`, { timeout: 40_000 }, (context) =>
							checkPage(browser, context, viewport)
						)
					),
				Promise.resolve()
			);
	});
});
