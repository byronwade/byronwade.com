import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import matter from "gray-matter";

const TIME_ELEMENT = /<time\b([^>]*)>([\s\S]*?)<\/time>/gi;
const DATETIME_ATTRIBUTE = /datetime="([^"]+)"/i;
const SITEMAP_ENTRY = /<url>([\s\S]*?)<\/url>/g;
const SITEMAP_LOCATION = /<loc>(.*?)<\/loc>/;
const SITEMAP_MODIFIED = /<lastmod>(.*?)<\/lastmod>/;

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
		].flatMap((options) => {
			const label = date.toLocaleDateString("en-US", { ...options, timeZone });
			// React can separate adjacent text children with an empty HTML comment.
			return [label, `Updated ${label}`, `Updated <!-- -->${label}`];
		});
		const displayed = content.trim();
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

test("built sitemap dates reflect authored content rather than the build clock", async (context) => {
	const xml = await readFile(
		new URL("../../.next/server/app/sitemap.xml.body", import.meta.url),
		"utf8"
	);
	const entries = [...xml.matchAll(SITEMAP_ENTRY)].map(([, entry]) => ({
		url: entry.match(SITEMAP_LOCATION)?.[1],
		modified: entry.match(SITEMAP_MODIFIED)?.[1],
	}));
	const counts = await Promise.all(
		["blog", "projects"].map(async (kind) => {
			const directory = new URL(`../../content/${kind}/`, import.meta.url);
			const files = (await readdir(directory)).filter((name) => name.endsWith(".md"));
			const checked = await Promise.all(
				files.map(async (file) => {
					const { data } = matter(await readFile(new URL(file, directory), "utf8"));
					if (data.draft === true) {
						return 0;
					}
					const route = `/${kind}/${file.slice(0, -3)}`;
					const entry = entries.find((item) => item.url?.endsWith(route));
					assert.ok(entry, `${route} should be discoverable`);
					const date = kind === "blog" ? (data.updated ?? data.date) : data.date;
					assert.equal(entry.modified, date ? new Date(date).toISOString() : undefined, route);
					return 1;
				})
			);
			return checked.reduce((sum, count) => sum + count, 0);
		})
	);
	const checked = counts.reduce((sum, count) => sum + count, 0);
	assert.ok(checked > 0);
	context.diagnostic(`Checked authored modification dates for ${checked} content URLs`);
});
