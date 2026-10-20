import assert from "node:assert/strict";
import { after, test } from "node:test";
import { renderFigmaDetail, renderMissingFigmaDetail } from "./fixtures/figma-detail.mjs";

const BREADCRUMB = /<nav\b[^>]*aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/s;
const CURRENT_FILE = /aria-current="page"[^>]*>Design &lt;draft&gt; &amp; review<\/span>/;
const DESIGN_HEADING = /<h2\b[^>]*>Design File<\/h2>/;
const COMPONENT_HEADING = /<h3\b[^>]*>Primary button<\/h3>/;
const INFORMATION_HEADING = /<h2\b[^>]*>File Information<\/h2>/;
const NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404/;
const VIEW_BUTTONS = /<button\b([^>]*)>(.*?)<\/button>/gs;

const originalTimezone = process.env.TZ;
after(() => {
	if (originalTimezone === undefined) {
		delete process.env.TZ;
	} else {
		process.env.TZ = originalTimezone;
	}
});

for (const [timezone, expected] of [
	["UTC", "January 1, 2026"],
	["America/New_York", "December 31, 2025"],
	["America/Los_Angeles", "December 31, 2025"],
	["Asia/Kathmandu", "January 1, 2026"],
]) {
	test(`${timezone}: Figma dates use readable canonical labels and source timestamps`, async () => {
		process.env.TZ = timezone;
		const html = await renderFigmaDetail();
		const dates = [...html.matchAll(/<time\b[^>]*dateTime="([^"]+)"[^>]*>(.*?)<\/time>/gi)];
		assert.equal(dates.length, 2);
		for (const [, datetime, text] of dates) {
			assert.equal(datetime, "2026-01-01T00:00:00Z");
			assert.equal(text, expected);
		}
	});
}

test("real modification timestamps keep the canonical local date", async () => {
	process.env.TZ = "America/New_York";
	const html = await renderFigmaDetail({ lastModified: "2026-01-01T03:30:00Z" });
	assert.equal((html.match(/>December 31, 2025<\/time>/g) ?? []).length, 2);
	assert.equal((html.match(/dateTime="2026-01-01T03:30:00Z"/gi) ?? []).length, 2);
});

test("breadcrumb identifies ordered parents and the current file", async () => {
	const html = await renderFigmaDetail({ name: "Design <draft> & review" });
	const nav = html.match(BREADCRUMB)?.[1];
	assert.ok(nav, "breadcrumb must be a named navigation landmark");
	assert.ok(nav.includes("<ol "));
	assert.equal((nav.match(/<li\b/g) ?? []).length, 2);
	assert.ok(nav.includes('href="/portfolio"'));
	assert.ok(!nav.includes("tab=figma"), "the repository index no longer has a Figma tab");
	assert.match(nav, CURRENT_FILE);
});

test("populated file has one title and sequential section/component headings", async () => {
	const html = await renderFigmaDetail();
	const headings = [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs)];
	assert.deepEqual(
		headings.map(([, level]) => Number(level)),
		[1, 2, 3, 2, 3, 2]
	);
	assert.match(html, DESIGN_HEADING);
	assert.match(html, COMPONENT_HEADING);
	assert.match(html, INFORMATION_HEADING);
});

test("empty component library omits its section without breaking heading order", async () => {
	const html = await renderFigmaDetail({ components: [] });
	assert.deepEqual(
		[...html.matchAll(/<h([1-6])\b/g)].map(([, level]) => Number(level)),
		[1, 2, 3, 2]
	);
	assert.ok(!html.includes("Components (0)"));
});

test("viewer controls expose the selected mode through native toggle buttons", async () => {
	const buttons = [...(await renderFigmaDetail()).matchAll(VIEW_BUTTONS)];
	assert.equal(buttons.length, 2);
	assert.ok(buttons[0][1].includes('aria-pressed="true"'));
	assert.ok(buttons[0][2].includes("Interactive"));
	assert.ok(buttons[1][1].includes('aria-pressed="false"'));
	assert.ok(buttons[1][2].includes("Preview"));
});

test("unavailable file retains the existing not-found route", async () => {
	await assert.rejects(renderMissingFigmaDetail(), NOT_FOUND);
});
