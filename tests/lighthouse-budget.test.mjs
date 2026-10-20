import assert from "node:assert/strict";
import { test } from "node:test";
import { assessBudget } from "../scripts/lighthouse-budget.mjs";

const budget = {
	timings: [{ metric: "largest-contentful-paint", budget: 3000 }],
	resourceSizes: [{ resourceType: "script", budget: 1 }],
	resourceCounts: [{ resourceType: "script", budget: 2 }],
};
const MISSING_SUMMARY = /no resource summary/;
function report({ lcp = 3000, bytes = 1024, requests = 2 } = {}) {
	return {
		audits: {
			"largest-contentful-paint": { numericValue: lcp },
			"resource-summary": {
				details: {
					items: [
						{ resourceType: "total", transferSize: bytes + 64, requestCount: requests + 1 },
						{ resourceType: "script", transferSize: bytes, requestCount: requests },
					],
				},
			},
		},
	};
}

test("timing and KiB/request budgets pass at their exact boundaries", () => {
	assert.deepEqual(assessBudget(report(), budget).failures, []);
});
test("each exceeded budget independently fails the release gate", () => {
	for (const values of [{ lcp: 3001 }, { bytes: 1025 }, { requests: 3 }]) {
		assert.equal(assessBudget(report(values), budget).failures.length, 1);
	}
});
test("a missing or invalid measurement cannot silently pass", () => {
	const missing = report();
	missing.audits["largest-contentful-paint"] = undefined;
	assert.equal(assessBudget(missing, budget).failures.length, 1);
	assert.equal(assessBudget(report({ lcp: Number.NaN }), budget).failures.length, 1);
	assert.throws(() => assessBudget({ audits: {} }, budget), MISSING_SUMMARY);
	const empty = report();
	empty.audits["resource-summary"].details.items = [];
	assert.throws(() => assessBudget(empty, budget), MISSING_SUMMARY);
	assert.equal(assessBudget(report({ bytes: Number.NaN }), budget).failures.length, 1);
	assert.equal(assessBudget(report({ requests: -1 }), budget).failures.length, 1);
});

test("an existing resource row requires both byte and request measurements", () => {
	for (const field of ["transferSize", "requestCount"]) {
		const incomplete = report();
		delete incomplete.audits["resource-summary"].details.items[1][field];
		assert.equal(assessBudget(incomplete, budget).failures.length, 1);
	}
});

test("an absent resource category represents no requests", () => {
	const absent = report();
	absent.audits["resource-summary"].details.items.pop();
	assert.deepEqual(assessBudget(absent, budget).failures, []);
});
