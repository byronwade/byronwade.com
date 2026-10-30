import assert from "node:assert/strict";
import { test } from "node:test";
import { loadAnalyticsRuntime, withAnalyticsRuntime } from "../../scripts/analytics-runtime.mjs";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// Explicit opt-in: capture once outside the repository, then replay offline.
// The default rendered suite keeps its queue-handler check with empty scripts.
const directory = process.env.ANALYTICS_RUNTIME_DIR;
if (!directory) {
	throw new Error("Set ANALYTICS_RUNTIME_DIR to a pinned local runtime snapshot");
}
const fixture = await loadAnalyticsRuntime(directory);

test("real analytics runtimes redact search words before locally intercepted telemetry", {
	timeout: 150_000,
}, async (context) => {
	await withProductionServer(
		async (origin) => {
			await withBrowser(context, { timeout: 15_000, protocolTimeout: 30_000 }, async (browser) => {
				const checkTheme = async (theme) => {
					await context.test(theme, { timeout: 50_000 }, async () => {
						await withAnalyticsRuntime(browser, origin, fixture, async (page, runtime) => {
							await page.setViewport({ width: theme === "light" ? 390 : 1280, height: 900 });
							await page.evaluateOnNewDocument(
								(value) => localStorage.setItem("theme", value),
								theme
							);
							const errors = [];
							page.on("pageerror", (error) => errors.push(error.message));
							await page.goto(
								`${origin}/search?q=private-runtime-words&utm_source=runtime-proof#results`
							);
							await page.waitForFunction(() => window.vai === true && window.sil === true);
							await page.waitForFunction(
								(value) =>
									document.documentElement.classList.contains("dark") === (value === "dark"),
								{},
								theme
							);
							await page.waitForFunction(
								() => performance.getEntriesByName("first-contentful-paint").length > 0
							);
							// Flush the real speed observer using its page lifecycle listener;
							// Vercel documents delivery on blur/unload rather than every sample.
							await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
							await page.waitForNetworkIdle({ idleTime: 300, timeout: 15_000 });
							runtime.assertComplete();
							const views = runtime.requests.telemetry.filter(
								(request) => request.path === "/_vercel/insights/view"
							);
							const vitals = runtime.requests.telemetry.filter(
								(request) => request.path === "/_vercel/speed-insights/vitals"
							);
							assert.ok(views.length > 0, "Real Web Analytics must produce a page view");
							assert.ok(vitals.length > 0, "Real Speed Insights must produce measured vitals");
							for (const body of [
								...views.map((request) => JSON.parse(request.body).o),
								...vitals.flatMap((request) =>
									JSON.parse(request.body).metrics.map((metric) => metric.href)
								),
							]) {
								const url = new URL(body);
								assert.equal(url.pathname, "/search");
								assert.equal(url.searchParams.has("q"), false);
								assert.equal(url.searchParams.get("utm_source"), "runtime-proof");
								assert.equal(url.hash, "#results");
							}
							assert.equal(
								JSON.stringify(runtime.requests.telemetry).includes("private-runtime-words"),
								false
							);
							assert.equal(
								await page.evaluate(() => new URL(location.href).searchParams.get("q")),
								"private-runtime-words"
							);
							assert.deepEqual(
								runtime.requests.blocked,
								[],
								"No runtime may attempt off-origin HTTP"
							);
							const escaped = await page.evaluate(() =>
								fetch("https://runtime-egress.invalid/probe").then(
									() => true,
									() => false
								)
							);
							assert.equal(escaped, false, "A deliberate off-origin request must be blocked");
							assert.deepEqual(runtime.requests.blocked, ["https://runtime-egress.invalid"]);
							assert.deepEqual(errors, []);
							context.diagnostic(
								JSON.stringify({
									theme,
									views: views.length,
									vitalBatches: vitals.length,
									...runtime.provenance,
								})
							);
						});
					});
				};
				await checkTheme("light");
				await checkTheme("dark");
			});
		},
		{ env: { SCREENSHOTONE_ACCESS_KEY: "" } }
	);
});
