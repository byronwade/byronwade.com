import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmdirSync, statSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CONTACT_ENCODED, decodeContact } from "../lib/contact.ts";
import { serializeEvidence, writeEvidenceJson } from "../scripts/evidence-json.mjs";

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

test("complete route reports survive formatting beyond the default subprocess buffer", (context) => {
	const directory = mkdtempSync(join(tmpdir(), "byron-evidence-json-"));
	const file = join(directory, "routes.json");
	context.after(() => {
		if (existsSync(file)) {
			unlinkSync(file);
		}
		rmdirSync(directory);
	});
	const report = {
		cases: Array.from({ length: 8192 }, (_, index) => ({
			index,
			label: "A route diagnostic ".repeat(8),
			failures: [],
		})),
	};
	writeEvidenceJson(file, report);
	assert.ok(statSync(file).size > 1024 * 1024);
	assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), report);
});
