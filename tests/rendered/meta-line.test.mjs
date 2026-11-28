import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// Facts lines that wrap at 390px: a post's date, update and reading time, and
// the résumé's two roles under the name.
const CASES = [
	{ path: "/blog/building-thorbis", facts: 3 },
	{ path: "/resume", facts: 2 },
];

test("a wrapped facts line never starts or ends on a separator", {
	timeout: 120_000,
}, async (t) => {
	await withProductionServer((url) =>
		withBrowser(t, {}, async (browser) => {
			const page = await browser.newPage();
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			for (const { path, facts: count } of CASES) {
				// biome-ignore lint/performance/noAwaitInLoops: one page, visited in turn
				await page.goto(`${url}${path}`, { waitUntil: "networkidle0" });
				const facts = await page.$eval("main", (main) => {
					const line = main.querySelector("[data-meta-fact]").closest("p");
					const box = line.getBoundingClientRect();
					return [...line.querySelectorAll("[data-meta-fact]")].map((fact) => {
						const dot = fact.querySelector('[aria-hidden="true"]').getBoundingClientRect();
						return {
							text: fact.textContent.slice(1),
							top: Math.round(fact.getBoundingClientRect().top),
							dotShown: dot.left >= box.left - 0.5,
						};
					});
				});
				const detail = `${path}: ${JSON.stringify(facts)}`;
				assert.equal(facts.length, count, detail);
				assert.ok(new Set(facts.map((fact) => fact.top)).size > 1, `should wrap; ${detail}`);
				facts.forEach((fact, index) => {
					const opensLine = index === 0 || facts[index - 1].top !== fact.top;
					// A dot shows only between two facts on the same line.
					assert.equal(fact.dotShown, !opensLine, detail);
				});
			}
		})
	);
});
