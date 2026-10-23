import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// Vercel Web Analytics and Speed Insights send `location.href` with every page
// view, event and speed sample, so a site search would send the words typed into
// it. Each package queues the page's `beforeSend` handler on `window.vaq` /
// `window.siq` until its script loads; this check answers both scripts with an
// empty body, so nothing is sent, and runs the queued handlers on the event
// Vercel's script would build. See docs/ARCHITECTURE.md.
const SCRIPTS = { va: "/_vercel/insights/script.js", si: "/_vercel/speed-insights/script.js" };
const SEARCH_WORDS = "private-words";

test("analytics and speed samples leave out site-search words", {
	timeout: 90_000,
}, async (context) => {
	await withProductionServer(async (origin) => {
		await withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(15_000);
			page.setDefaultNavigationTimeout(20_000);
			const requested = new Set();
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (url.origin !== origin) {
					request.respond({ status: 204, body: "" });
				} else if (url.pathname.startsWith("/_vercel/")) {
					requested.add(url.pathname);
					request.respond({ status: 200, contentType: "text/javascript", body: "" });
				} else {
					request.continue();
				}
			});
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));

			await page.goto(`${origin}/search?q=${SEARCH_WORDS}&utm_source=newsletter#results`);
			// Each package queues `beforeSend` before it adds its script tag.
			await page.waitForFunction(
				(sources) => sources.every((src) => document.querySelector(`script[src="${src}"]`)),
				{},
				Object.values(SCRIPTS)
			);
			const other = `${origin}/blog?utm_source=newsletter#top`;
			const { search, sent } = await page.evaluate((otherUrl) => {
				const urls = [location.href, otherUrl];
				const run = (queue, type) =>
					(queue ?? [])
						.filter(([name, handler]) => name === "beforeSend" && typeof handler === "function")
						.map(([, handler]) => urls.map((url) => handler({ type, url })?.url ?? null));
				return {
					search: location.href,
					sent: { va: run(window.vaq, "pageview"), si: run(window.siq, "vital") },
				};
			}, other);
			assert.deepEqual([...requested].sort(), Object.values(SCRIPTS).sort());

			for (const [queue, handlers] of Object.entries(sent)) {
				assert.ok(handlers.length > 0, `${queue}: the page registers no beforeSend handler`);
				for (const [fromSearch, fromOther] of handlers) {
					assert.ok(fromSearch, `${queue}: the search page view was dropped instead of redacted`);
					const url = new URL(fromSearch);
					assert.equal(url.pathname, "/search");
					assert.equal(url.searchParams.has("q"), false, `${queue} sends the query: ${fromSearch}`);
					assert.equal(fromSearch.includes(SEARCH_WORDS), false, fromSearch);
					assert.equal(url.searchParams.get("utm_source"), "newsletter");
					assert.equal(url.hash, "#results");
					assert.equal(fromOther, other, `${queue} changed a page that is not search`);
				}
			}
			assert.equal(new URL(search).searchParams.get("q"), SEARCH_WORDS);
			assert.deepEqual(errors, []);
		});
	});
});
