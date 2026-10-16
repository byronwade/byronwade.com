import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const HOME_HEADING = /<h1[^>]*>I ran the service business/;
const WORK = /Selected work/;
const WRITING = /Writing/;
const NAVIGATION = /<nav[^>]*aria-label="Primary"/;
const NO_JS_CONTACT = /<noscript>.*?Contact Byron/s;
const HIDDEN_HEADING =
	/class="[^"]*(?:scene-enter|reveal-delay|opacity-0)[^"]*"[^>]*id="home-title"/;

test("homepage content and navigation are present before hydration", async () => {
	const html = await readFile(
		new URL("../../.next/server/app/index.html", import.meta.url),
		"utf8"
	);
	assert.match(html, HOME_HEADING);
	assert.match(html, WORK);
	assert.match(html, WRITING);
	assert.match(html, NAVIGATION);
	assert.match(html, NO_JS_CONTACT);
	assert.doesNotMatch(html, HIDDEN_HEADING);
});
