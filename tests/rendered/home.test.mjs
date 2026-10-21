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
const INTER_PRELOAD =
	/<link(?=[^>]*rel="preload")(?=[^>]*as="font")(?=[^>]*href="\/fonts\/UcCo3FwrK3iLTcviYwY\.woff2")[^>]*>/;
const INITIAL_SCRIPT = /<script[^>]+src="\/_next\/([^"]+)"/g;
const NON_CLIENT_GLYPHS =
	/(?:DeviceMobile|DeviceTablet|CornersOut|CornersIn|DotsSixVertical|MagnifyingGlass|SquaresFour)Icon/;
const DEFERRED_DIALOG = /trap-focus/;

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
	assert.match(
		html,
		INTER_PRELOAD,
		"the pinned source font must preload without a generated manifest"
	);
	assert.doesNotMatch(html, HIDDEN_HEADING);
});

test("homepage initial scripts exclude shell glyphs, preview glyphs and closed dialogs", async () => {
	const html = await readFile(
		new URL("../../.next/server/app/index.html", import.meta.url),
		"utf8"
	);
	const scripts = [...html.matchAll(INITIAL_SCRIPT)].map((match) => match[1]);
	assert.ok(scripts.length > 0, "Run npm run build before checking initial scripts");
	const chunks = await Promise.all(
		scripts.map(async (file) => ({
			file,
			source: await readFile(new URL(`../../.next/${file}`, import.meta.url), "utf8"),
		}))
	);
	assert.ok(
		chunks.some(({ source }) => source.includes("ArrowRightIcon")),
		"The client contact-action glyph must remain detectable for this boundary check"
	);
	assert.deepEqual(
		chunks.filter(({ source }) => NON_CLIENT_GLYPHS.test(source)).map(({ file }) => file),
		[],
		"Server-shell and preview glyph definitions belong outside the homepage JavaScript"
	);
	assert.deepEqual(
		chunks.filter(({ source }) => DEFERRED_DIALOG.test(source)).map(({ file }) => file),
		[],
		"Capsule dialog behavior loads on intentional opening, alongside its panel"
	);
});
