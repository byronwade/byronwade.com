import assert from "node:assert/strict";
import { after, test } from "node:test";
import { safeFormatDate, safeISODate } from "../lib/markdown-utils.ts";

const originalTimezone = process.env.TZ;
after(() => {
	if (originalTimezone === undefined) {
		delete process.env.TZ;
	} else {
		process.env.TZ = originalTimezone;
	}
});

for (const timezone of [
	"UTC",
	"America/New_York",
	"America/Los_Angeles",
	"Asia/Kathmandu",
	"Pacific/Kiritimati",
]) {
	for (const [label, value] of [
		["quoted calendar date", "2026-01-01"],
		["YAML Date", new Date("2026-01-01T00:00:00.000Z")],
		["serialized YAML date", "2026-01-01T00:00:00.000Z"],
		["UTC offset date", "2026-01-01T00:00:00+00:00"],
	]) {
		test(`${timezone}: ${label} keeps its publication day, year and machine date`, () => {
			process.env.TZ = timezone;
			assert.equal(safeFormatDate(value), "January 1, 2026");
			assert.equal(safeFormatDate(value, "MMM d"), "Jan 1");
			assert.equal(safeFormatDate(value, "yyyy"), "2026");
			assert.equal(safeFormatDate(value, "MMMM yyyy"), "January 2026");
			assert.equal(safeISODate(value), "2026-01-01");
		});
	}

	for (const [value, expected] of [
		["2024-02-29T00:00:00.000Z", "February 29, 2024"],
		["2024-03-10T00:00:00.000Z", "March 10, 2024"],
		["2026-11-01T00:00:00.000Z", "November 1, 2026"],
	]) {
		test(`${timezone}: ${value} survives leap days and daylight-saving boundaries`, () => {
			process.env.TZ = timezone;
			assert.equal(safeFormatDate(value), expected);
		});
	}
}

for (const value of [undefined, null, "", "not a date", new Date("invalid"), {}, Number.NaN]) {
	test(`invalid content date returns an empty display (${String(value)})`, () => {
		assert.equal(safeFormatDate(value), "");
		assert.equal(safeISODate(value), undefined);
	});
}

test("real timestamps retain local-time formatting", () => {
	process.env.TZ = "America/New_York";
	assert.equal(safeFormatDate("2026-01-01T03:30:00Z"), "December 31, 2025");
	assert.equal(safeFormatDate(new Date("2026-01-01T03:30:00Z")), "December 31, 2025");
});
