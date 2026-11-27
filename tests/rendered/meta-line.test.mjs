import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// A post with a date, an update and a reading time: three facts that wrap on a phone.
const POST = "/blog/building-thorbis";

test("a wrapped facts line never starts or ends on a separator", {
	timeout: 120_000,
}, async (t) => {
	await withProductionServer((url) =>
		withBrowser(t, {}, async (browser) => {
			const page = await browser.newPage();
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.goto(`${url}${POST}`, { waitUntil: "networkidle0" });
			const facts = await page.$$eval("main header [data-meta-fact]", (elements) => {
				const line = elements[0].closest("p").getBoundingClientRect();
				return elements.map((fact) => {
					const dot = fact.querySelector('[aria-hidden="true"]').getBoundingClientRect();
					return {
						text: fact.textContent.slice(1),
						top: Math.round(fact.getBoundingClientRect().top),
						dotShown: dot.left >= line.left - 0.5,
					};
				});
			});
			assert.equal(facts.length, 3, JSON.stringify(facts));
			const lines = new Set(facts.map((fact) => fact.top));
			assert.ok(lines.size > 1, `the fixture should wrap at 390px: ${JSON.stringify(facts)}`);
			facts.forEach((fact, index) => {
				const opensLine = index === 0 || facts[index - 1].top !== fact.top;
				// A dot shows only between two facts on the same line.
				assert.equal(fact.dotShown, !opensLine, JSON.stringify(facts));
			});
		})
	);
});
