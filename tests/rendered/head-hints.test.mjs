import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withPortfolioFixture } from "../fixtures/portfolio-browser.mjs";

// React's server renderer turns a `<link rel="preload">` element in a server
// component into a preload hint and still renders the element, so the root
// layout's JSX preload put two tags for the same font on every prerendered page.
// A server-side `preload()` call is no fix: pages rendered per request drop the
// hint. The client `FontPreload` component requests it during HTML rendering
// instead. See docs/PERFORMANCE.md.
const APP = new URL("../../.next/server/app/", import.meta.url);
const CORE_FONT = "/fonts/inter-latin-core.woff2";
const HINT = /<link(?=[^>]*\brel="(preload|modulepreload|preconnect|dns-prefetch)")[^>]*>/g;
const HREF = /\bhref="([^"]+)"/;
const CROSS_ORIGIN = /^(?:https?:)?\/\//;
const STYLESHEET = /<link[^>]*\brel="stylesheet"/;
// Pages rendered per request send React's font and stylesheet preloads as a
// `Link` header instead of tags.
const LINK_ENTRY = /,\s*(?=<)/;
const LINK_URL = /^<([^>]+)>/;
const LINK_REL = /;\s*rel="?([\w-]+)"?/;
const GLOBAL_ERROR = "/_global-error";
// Rendered on request, so the prerender manifest cannot list them.
// The portfolio and Figma pages stream; the Figma key has no token, so it shows its fallback.
const DYNAMIC_ROUTES = [
	"/portfolio",
	"/portfolio/figma/ExampleKey",
	"/search?q=thorbis",
	"/this-route-does-not-exist",
];

/** `Link` response header entries, which arrive before any of the document. */
function headerHints(link) {
	return (link ?? "")
		.split(LINK_ENTRY)
		.filter(Boolean)
		.map((entry) => ({
			rel: entry.match(LINK_REL)?.[1] ?? "",
			href: entry.match(LINK_URL)?.[1] ?? "",
			at: -1,
		}));
}

function hintProblems(html, link = null) {
	const hints = [
		...headerHints(link),
		...[...html.matchAll(HINT)].map((match) => ({
			rel: match[1],
			href: match[0].match(HREF)?.[1] ?? "",
			at: match.index,
		})),
	];
	const problems = [];
	const seen = new Set();
	for (const { rel, href } of hints) {
		const key = `${rel} ${href}`;
		if (seen.has(key)) {
			problems.push(`duplicate ${key}`);
		}
		seen.add(key);
		// The GitHub, Dribbble and Figma APIs are fetched by server-only code; a hint
		// for a host the browser never contacts only spends a lookup.
		if (CROSS_ORIGIN.test(href)) {
			problems.push(`cross-origin ${key}`);
		}
	}
	const fonts = hints.filter(({ rel, href }) => rel === "preload" && href === CORE_FONT);
	if (fonts.length === 0) {
		problems.push(`no preload for ${CORE_FONT}`);
	}
	const stylesheet = html.search(STYLESHEET);
	if (fonts.length > 0 && stylesheet !== -1 && fonts[0].at > stylesheet) {
		problems.push(`${CORE_FONT} preload follows the stylesheet`);
	}
	return problems;
}

test("prerendered pages name each resource hint once and only for hosts the browser uses", () => {
	const manifest = JSON.parse(
		readFileSync(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	const found = {};
	let checked = 0;
	for (const route of Object.keys(manifest.routes)) {
		const file = new URL(route === "/" ? "index.html" : `.${route}.html`, APP);
		// The global error page replaces the root layout, so it has no font preload.
		if (route === GLOBAL_ERROR || !existsSync(file)) {
			continue;
		}
		checked += 1;
		const problems = hintProblems(readFileSync(file, "utf8"));
		if (problems.length > 0) {
			found[route] = problems;
		}
	}
	assert.ok(checked > 10, "Run npm run build before checking resource hints");
	assert.deepEqual(found, {});
});

test("request-time pages name each resource hint once", { timeout: 120_000 }, async () => {
	const found = await withPortfolioFixture((fixture) =>
		withProductionServer(
			async (origin) => {
				const pages = await Promise.all(
					DYNAMIC_ROUTES.map(async (path) => {
						const response = await fetch(`${origin}${path}`, {
							signal: AbortSignal.timeout(30_000),
						});
						return [path, hintProblems(await response.text(), response.headers.get("link"))];
					})
				);
				return Object.fromEntries(pages.filter(([, problems]) => problems.length > 0));
			},
			{ env: { ...fixture.env, FIGMA_ACCESS_TOKEN: "" } }
		)
	);
	assert.deepEqual(found, {});
});
