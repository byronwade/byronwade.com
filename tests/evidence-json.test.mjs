import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTACT_ENCODED, decodeContact } from "../lib/contact.ts";
import { serializeEvidence } from "../scripts/evidence-json.mjs";

test("browser diagnostics retain measurements while redacting revealed contact details", () => {
	const details = Object.values(CONTACT_ENCODED).map(decodeContact);
	const report = {
		route: "/contact",
		violations: [{ target: details.map((detail) => `a[href='${detail}']`) }],
		measurements: { lcp: 3000, tbt: 300, cls: 0, complete: true },
	};
	const serialized = serializeEvidence(report);
	for (const detail of details) {
		assert.ok(detail.length > 0);
		assert.equal(serialized.includes(detail), false);
	}
	const redacted = JSON.parse(serialized);
	assert.deepEqual(redacted.measurements, report.measurements);
	assert.equal(redacted.violations[0].target.length, details.length);
	assert.deepEqual(
		report.violations[0].target,
		details.map((detail) => `a[href='${detail}']`)
	);
});
