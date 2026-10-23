import assert from "node:assert/strict";
import { test } from "node:test";
import { withoutSearchWords } from "../lib/analytics-redact.ts";

const ORIGIN = "https://www.byronwade.com";

test("search addresses lose every query word and keep the rest", () => {
	const event = {
		type: "pageview",
		url: `${ORIGIN}/search?q=septic+permit&utm_source=newsletter&q=again#results`,
	};
	assert.deepEqual(withoutSearchWords(event), {
		type: "pageview",
		url: `${ORIGIN}/search?utm_source=newsletter#results`,
	});
	assert.equal(event.url.includes("septic"), true, "the original event must not be mutated");
	assert.equal(
		withoutSearchWords({ type: "vital", url: `${ORIGIN}/search?q=` }).url,
		`${ORIGIN}/search`
	);
});

test("addresses without search words pass through untouched", () => {
	for (const url of [
		`${ORIGIN}/search`,
		`${ORIGIN}/search?utm_source=newsletter`,
		`${ORIGIN}/blog?q=not-site-search`,
		`${ORIGIN}/searching?q=other-route`,
	]) {
		const event = { type: "pageview", url };
		assert.equal(withoutSearchWords(event), event, url);
	}
});
