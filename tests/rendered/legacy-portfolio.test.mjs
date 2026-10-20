import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const NEXT = new URL("../../.next/", import.meta.url);
const CURRENT_CASE_STUDY = "/projects/thorbis";
const RETIRED_PAGES = ["/portfolio/thorbis", "/portfolio/thorbis-ai", "/portfolio/thorbis-mobile"];
// Figures from the retired 2024 pitch that no source supports.
const RETIRED_CLAIMS = /\$20M in funding|10,000\+ suppliers|40%\+ cost savings|70%\+ of B2B/;
const BUILT_OUTPUT = /\.(?:html|js|rsc)$/;

async function readJson(relativePath) {
	return JSON.parse(await readFile(new URL(relativePath, NEXT), "utf8"));
}

test("retired Thorbis pitch pages redirect permanently to the current case study", async () => {
	const { redirects } = await readJson("routes-manifest.json");
	for (const source of RETIRED_PAGES) {
		const redirect = redirects.find((entry) => entry.source === source);
		assert.ok(redirect, `${source} has no redirect`);
		assert.equal(redirect.destination, CURRENT_CASE_STUDY);
		assert.equal(redirect.statusCode, 308);
	}

	// A pattern under /portfolio would run before the filesystem and shadow
	// /portfolio and /portfolio/figma/[key].
	const portfolioPatterns = redirects.filter(
		(entry) =>
			!entry.internal && entry.source.startsWith("/portfolio") && entry.source.includes(":")
	);
	assert.deepEqual(portfolioPatterns, []);
});

test("the redirect target is a prerendered page", async () => {
	const { routes } = await readJson("prerender-manifest.json");
	assert.ok(Object.hasOwn(routes, CURRENT_CASE_STUDY));
});

test("the catch-all portfolio page is gone", async () => {
	const entries = await readdir(new URL("server/app/portfolio/", NEXT), { recursive: true });
	const catchAll = entries.filter((entry) => entry.includes("[...slug]"));
	assert.deepEqual(catchAll, []);
});

test("no built page or client chunk carries the retired pitch figures", async (context) => {
	const roots = ["server/app/", "static/chunks/"].map((path) => fileURLToPath(new URL(path, NEXT)));
	const listings = await Promise.all(roots.map((root) => readdir(root, { recursive: true })));
	const files = listings.flatMap((entries, index) =>
		entries.filter((entry) => BUILT_OUTPUT.test(entry)).map((entry) => join(roots[index], entry))
	);
	assert.ok(files.length > 0, "Run npm run build before checking built output");

	const sources = await Promise.all(
		files.map(async (file) => ({ file, source: await readFile(file, "utf8") }))
	);
	const matches = sources
		.filter(({ source }) => RETIRED_CLAIMS.test(source))
		.map(({ file }) => file);
	assert.deepEqual(matches, []);
	context.diagnostic(`Scanned ${files.length} built files`);
});
