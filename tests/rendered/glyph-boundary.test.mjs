import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const APP = new URL("../../.next/server/app/", import.meta.url);
const SERVER = new URL("../../.next/server/", import.meta.url);
const INITIAL_SCRIPT = /<script[^>]+src="\/_next\/([^"]+)"/g;

// Phosphor sets displayName to the icon name plus "Icon". The lookaround keeps
// CircleCheckIcon from counting as the copy-confirmation Check glyph.
const POST_GLYPHS =
	/(?<![A-Za-z0-9])(?:XLogo|LinkedinLogo|ShareNetwork|Copy|Check)Icon(?![A-Za-z0-9])/;
const RESUME_GLYPHS = /(?<![A-Za-z0-9])(?:Envelope|DownloadSimple)Icon(?![A-Za-z0-9])/;
const CONTACT_GLYPHS = /(?<![A-Za-z0-9])(?:PaperPlaneTilt|SpinnerGap)Icon(?![A-Za-z0-9])/;
const FIGMA_GLYPHS = /(?<![A-Za-z0-9])(?:Monitor|Image)Icon(?![A-Za-z0-9])/;
const DESIGN_VIEWER = "Design viewer";
const SHARE_ON_X = /Share on X/;
const SHARE_ON_LINKEDIN = /Share on LinkedIn/;
const COPY_LINK = /Copy link/;
const DOWNLOAD_PDF = /Download PDF/;
const SEND_MESSAGE = /Send message/;

async function readPage(relativePath) {
	try {
		return await readFile(new URL(relativePath, APP), "utf8");
	} catch {
		assert.fail(`Run npm run build first; missing ${relativePath}`);
	}
}

/** External scripts the prerendered page loads before any interaction. */
function initialChunks(html) {
	const scripts = [...html.matchAll(INITIAL_SCRIPT)].map((match) => match[1]);
	assert.ok(scripts.length > 0, "The page should reference its initial scripts");
	return Promise.all(
		scripts.map(async (file) => ({
			file,
			source: await readFile(new URL(`../../.next/${file}`, import.meta.url), "utf8"),
		}))
	);
}

function leakedGlyphs(chunks, pattern) {
	return chunks.filter(({ source }) => pattern.test(source)).map(({ file }) => file);
}

test("published posts keep share glyphs out of their initial scripts", async () => {
	const posts = (await readdir(new URL("blog/", APP))).filter((file) => file.endsWith(".html"));
	assert.ok(
		posts.includes("nexstar-win-invoice-lose-customer.html"),
		"The Nexstar post is the named page for this boundary"
	);

	const leaks = await Promise.all(
		posts.map(async (file) => {
			const html = await readPage(`blog/${file}`);
			assert.match(html, SHARE_ON_X, `${file} should still render the X share link`);
			assert.match(html, SHARE_ON_LINKEDIN, `${file} should still render the LinkedIn link`);
			assert.match(html, COPY_LINK, `${file} should still render copy link`);
			return leakedGlyphs(await initialChunks(html), POST_GLYPHS);
		})
	);
	assert.deepEqual(
		leaks.flat(),
		[],
		"X, LinkedIn, share, copy, and check glyph definitions belong on the server"
	);
});

test("the résumé keeps its envelope and download glyphs out of its initial scripts", async () => {
	const html = await readPage("resume.html");
	assert.match(html, DOWNLOAD_PDF);
	assert.deepEqual(
		leakedGlyphs(await initialChunks(html), RESUME_GLYPHS),
		[],
		"Envelope and download glyph definitions belong on the server"
	);
});

test("the contact page keeps its send and spinner glyphs out of its initial scripts", async () => {
	const html = await readPage("contact.html");
	assert.match(html, SEND_MESSAGE);
	assert.deepEqual(
		leakedGlyphs(await initialChunks(html), CONTACT_GLYPHS),
		[],
		"Send and spinner glyph definitions belong on the server"
	);
});

test("the Figma viewer keeps its monitor and image glyphs out of client chunks", async () => {
	const chunkDirectory = new URL("../../.next/static/chunks/", import.meta.url);
	const files = (await readdir(chunkDirectory, { recursive: true })).filter((file) =>
		file.endsWith(".js")
	);
	assert.ok(files.length > 0, "Run npm run build before checking client chunks");
	const leaks = [];
	let viewerText = false;
	for (const file of files) {
		// One chunk at a time so a large client graph is not held all at once.
		// biome-ignore lint/performance/noAwaitInLoops: sequential reads bound memory on the shared machine
		const source = await readFile(new URL(file, chunkDirectory), "utf8");
		if (FIGMA_GLYPHS.test(source)) {
			leaks.push(file);
		}
		if (source.includes(DESIGN_VIEWER)) {
			viewerText = true;
		}
	}
	assert.equal(viewerText, true, "The design viewer text stays in the client bundle");
	assert.deepEqual(
		leaks,
		[],
		"Monitor and image glyph definitions belong on the server slot, not in a client chunk"
	);
});

test("slotted glyph names remain in the server build, so a client leak stays detectable", async () => {
	const patterns = [
		["post share glyphs", POST_GLYPHS],
		["résumé glyphs", RESUME_GLYPHS],
		["contact glyphs", CONTACT_GLYPHS],
		["Figma viewer glyphs", FIGMA_GLYPHS],
	];
	const found = new Set();
	const files = (await readdir(SERVER, { recursive: true })).filter((file) => file.endsWith(".js"));
	for (const file of files) {
		if (found.size === patterns.length) {
			break;
		}
		// One file at a time, and stop once every canary has been seen.
		// biome-ignore lint/performance/noAwaitInLoops: early exit avoids reading the rest of the server build
		const source = await readFile(new URL(file, SERVER), "utf8");
		for (const [name, pattern] of patterns) {
			if (pattern.test(source)) {
				found.add(name);
			}
		}
	}
	assert.deepEqual(
		patterns.map(([name]) => name).filter((name) => !found.has(name)),
		[],
		"Each slotted glyph display name has to survive in server JavaScript"
	);
});
