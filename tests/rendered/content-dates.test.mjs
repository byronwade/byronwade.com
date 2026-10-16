import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const TIME_ELEMENT = /<time\b([^>]*)>([\s\S]*?)<\/time>/gi;
const DATETIME_ATTRIBUTE = /datetime="([^"]+)"/i;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const UPDATED_PREFIX = /^Updated /;

function assertCalendarDates(html, route) {
	const times = [...html.matchAll(TIME_ELEMENT)];
	assert.ok(times.length > 0, `${route} should expose its content dates`);
	for (const [, attributes, content] of times) {
		const machineDate = attributes.match(DATETIME_ATTRIBUTE)?.[1];
		assert.ok(machineDate, `${route}: visible dates need machine-readable dates`);
		const date = new Date(machineDate);
		// Calendar days use UTC; an authored non-midnight timestamp stays local.
		const timeZone = date.toISOString().endsWith("T00:00:00.000Z") ? "UTC" : undefined;
		const expected = [
			{ month: "long", day: "numeric", year: "numeric" },
			{ month: "short", day: "numeric", year: "numeric" },
			{ month: "short", day: "numeric" },
		].map((options) => date.toLocaleDateString("en-US", { ...options, timeZone }));
		const displayed = content.replace(HTML_COMMENT, "").trim().replace(UPDATED_PREFIX, "");
		assert.ok(
			expected.includes(displayed),
			`${route}: ${machineDate} displayed as ${displayed}; expected ${expected.join(" or ")}`
		);
	}
	return times.length;
}

test("built writing dates agree with machine dates in every public placement", async (context) => {
	const root = new URL("../../.next/server/app/", import.meta.url);
	const articles = (await readdir(new URL("blog/", root)))
		.filter((file) => file.endsWith(".html"))
		.map((file) => `blog/${file}`);
	assert.ok(articles.length > 0, "Run npm run build before checking writing dates");
	const counts = await Promise.all(
		["index.html", "blog.html", ...articles].map(async (route) => {
			const html = await readFile(new URL(route, root), "utf8");
			return assertCalendarDates(html, route);
		})
	);
	const count = counts.reduce((sum, dates) => sum + dates, 0);
	context.diagnostic(`Checked ${count} dates across ${articles.length + 2} rendered pages`);
});
