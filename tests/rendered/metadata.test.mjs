import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const META = /<meta (?:name|property)="([^"]+)" content="([^"]*)"/g;

function decode(value) {
	return value
		.replaceAll("&quot;", '"')
		.replaceAll("&#x27;", "'")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
		.replaceAll("&amp;", "&");
}

for (const [file, title] of [
	["index", "Byron Wade"],
	["projects", "Projects"],
	["resume", "Resume"],
]) {
	test(`${file} publishes consistent page and share-preview descriptions`, async () => {
		const html = await readFile(
			new URL(`../../.next/server/app/${file}.html`, import.meta.url),
			"utf8"
		);
		const tags = new Map([...html.matchAll(META)].map(([, key, value]) => [key, decode(value)]));
		const description = tags.get("description");
		assert.ok(description, "page should have a description");
		assert.equal(tags.get("og:description"), description);
		assert.equal(tags.get("twitter:description"), description);
		assert.equal(tags.get("og:image"), tags.get("twitter:image"));
		const card = new URL(tags.get("og:image"));
		assert.equal(card.searchParams.get("title"), title);
		assert.equal(card.searchParams.get("description"), description);
		const keywords = tags.get("keywords").split(",");
		assert.ok(keywords.includes("Thorbis"));
		assert.ok(keywords.includes("Service Business Software"));
		assert.equal(keywords.length, new Set(keywords).size);
		for (const stale of ["California Developer", "JavaScript Expert", "SEO Optimization"]) {
			assert.equal(keywords.includes(stale), false, stale);
		}
	});
}
