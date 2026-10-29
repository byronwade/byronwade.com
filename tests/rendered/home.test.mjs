import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

// The planet shares the heading, so the claim may sit in a span inside the h1.
const HOME_HEADING = /<h1[^>]*>\s*(?:<span[^>]*>\s*)?I ran the service business/;
const WORK = /Selected work/;
const WRITING = /Writing/;
const NAVIGATION = /<nav[^>]*aria-label="Primary"/;
const NO_JS_CONTACT = /<noscript>.*?Contact Byron/s;
const HIDDEN_HEADING =
	/class="[^"]*(?:scene-enter|reveal-delay|opacity-0)[^"]*"[^>]*id="home-title"/;
const INTER_PRELOAD =
	/<link(?=[^>]*rel="preload")(?=[^>]*as="font")(?=[^>]*href="\/fonts\/inter-latin-core\.woff2")[^>]*>/;
const INITIAL_SCRIPT = /<script[^>]+src="\/_next\/([^"]+)"/g;
const NON_CLIENT_GLYPHS =
	/(?:ArrowRight|Envelope|DeviceMobile|DeviceTablet|CornersOut|CornersIn|DotsThree|DotsSixVertical|MagnifyingGlass|SquaresFour)Icon/;
// The send glyph stays in the contact form chunk, which loads only when the form opens.
const LAZY_CLIENT_GLYPH = "PaperPlaneTiltIcon";
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
		"the Latin core subset of the pinned font must preload without a generated manifest"
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
	const chunkDirectory = new URL("../../.next/static/chunks/", import.meta.url);
	const allChunks = (await readdir(chunkDirectory, { recursive: true })).filter((file) =>
		file.endsWith(".js")
	);
	const lazyGlyphFound = await Promise.all(
		allChunks.map(async (file) =>
			(await readFile(new URL(file, chunkDirectory), "utf8")).includes(LAZY_CLIENT_GLYPH)
		)
	);
	assert.ok(
		lazyGlyphFound.includes(true),
		"The contact form's send glyph must remain detectable for this boundary check"
	);
	assert.deepEqual(
		chunks.filter(({ source }) => source.includes(LAZY_CLIENT_GLYPH)).map(({ file }) => file),
		[],
		"The contact form and its glyphs load when the form opens, not with the homepage"
	);
	assert.deepEqual(
		chunks.filter(({ source }) => NON_CLIENT_GLYPHS.test(source)).map(({ file }) => file),
		[],
		"Server-shell and preview glyph definitions belong outside the homepage JavaScript"
	);
	const clientDots = (
		await Promise.all(
			allChunks.map(async (file) =>
				(await readFile(new URL(file, chunkDirectory), "utf8")).includes("DotsThreeIcon")
					? file
					: ""
			)
		)
	).filter(Boolean);
	assert.deepEqual(
		clientDots,
		[],
		"The breadcrumb dots glyph loads with the server slot, not a client chunk"
	);
	const serverDirectory = new URL("../../.next/server/", import.meta.url);
	const serverFiles = (await readdir(serverDirectory, { recursive: true })).filter((file) =>
		file.endsWith(".js")
	);
	const serverDots = await Promise.all(
		serverFiles.map(async (file) =>
			(await readFile(new URL(file, serverDirectory), "utf8")).includes("DotsThreeIcon")
		)
	);
	assert.ok(serverDots.includes(true), "The breadcrumb dots glyph must remain in the server build");
	assert.deepEqual(
		chunks.filter(({ source }) => DEFERRED_DIALOG.test(source)).map(({ file }) => file),
		[],
		"Capsule dialog behavior loads on intentional opening, alongside its panel"
	);
});
