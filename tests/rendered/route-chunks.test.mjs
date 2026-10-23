import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withPortfolioFixture } from "../fixtures/portfolio-browser.mjs";

// A page downloads its own page chunk and the root layout, error and not-found
// chunks, never another route's page chunk. Next builds each page's client manifest
// by merging its parent segments' manifests, and the last entry written wins for a
// module several entries reference. A client module that a root-layout server
// component renders, and a page entry also imports, therefore resolves to that
// page's chunk: a server-rendered `next/link` in the header made every project page
// download the /projects chunk and contact, the résumé and the legal pages the
// homepage chunk. See docs/PERFORMANCE.md.
const APP = new URL("../../.next/server/app/", import.meta.url);
// Initial script tags and the RSC payload's client references both name chunks. A
// streamed page lists only its bootstrap scripts as tags; the browser fetches the
// payload's chunks while hydrating, so both are downloads.
const APP_CHUNK = /static\/chunks\/(app\/[^"\\?]+?\.js)/g;
const ROOT_BOUNDARY = /^app\/(?:layout|error|not-found)-[\w-]+\.js$/;
// Rendered on request, so the prerender manifest cannot list them. The unknown URL
// renders the not-found entry; the Figma key has no token, so it shows its fallback.
const DYNAMIC_ROUTES = [
	{ path: "/portfolio", entry: "/portfolio" },
	{ path: "/portfolio/figma/ExampleKey", entry: "/portfolio/figma/[key]" },
	{ path: "/search?q=thorbis", entry: "/search" },
	{ path: "/this-route-does-not-exist", entry: "/_not-found" },
];

function foreignPageChunks(html, entry) {
	const own = `app${entry === "/" ? "" : entry.replaceAll("[", "%5B").replaceAll("]", "%5D")}/page-`;
	const chunks = [...new Set([...html.matchAll(APP_CHUNK)].map((match) => match[1]))];
	assert.ok(
		chunks.some((chunk) => ROOT_BOUNDARY.test(chunk)),
		"Root layout chunks must remain detectable"
	);
	return chunks.filter((chunk) => !(ROOT_BOUNDARY.test(chunk) || chunk.startsWith(own)));
}

test("prerendered pages load no other route's page chunk", () => {
	const manifest = JSON.parse(
		readFileSync(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	const borrowed = {};
	let checked = 0;
	for (const [route, { srcRoute }] of Object.entries(manifest.routes)) {
		const file = new URL(route === "/" ? "index.html" : `.${route}.html`, APP);
		if (!existsSync(file)) {
			continue;
		}
		checked += 1;
		const foreign = foreignPageChunks(readFileSync(file, "utf8"), srcRoute ?? route);
		if (foreign.length > 0) {
			borrowed[route] = foreign;
		}
	}
	assert.ok(checked > 10, "Run npm run build before checking route chunks");
	assert.deepEqual(borrowed, {}, "Pages downloaded another route's page chunk");
});

test("request-time pages load no other route's page chunk", { timeout: 120_000 }, async () => {
	const borrowed = await withPortfolioFixture((fixture) =>
		withProductionServer(
			async (origin) => {
				const pages = await Promise.all(
					DYNAMIC_ROUTES.map(async ({ path, entry }) => {
						const response = await fetch(`${origin}${path}`, {
							signal: AbortSignal.timeout(30_000),
						});
						return [path, foreignPageChunks(await response.text(), entry)];
					})
				);
				return Object.fromEntries(pages.filter(([, foreign]) => foreign.length > 0));
			},
			{ env: { ...fixture.env, FIGMA_ACCESS_TOKEN: "" } }
		)
	);
	assert.deepEqual(borrowed, {}, "Pages downloaded another route's page chunk");
});
