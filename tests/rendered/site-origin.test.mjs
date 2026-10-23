import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { siteUrl } from "../../lib/site.ts";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withPortfolioFixture } from "../fixtures/portfolio-browser.mjs";

// Search engines and share previews take a page's address from its canonical
// link, og:url, structured data, the sitemap and the feed. Each one must name the
// page itself on the origin lib/site.ts owns, not a redirect or the home page.
const APP = new URL("../../.next/server/app/", import.meta.url);
const GLOBAL_ERROR = "/_global-error";
const SITE_URL = /https?:\/\/(?:www\.)?byronwade\.com(?![\w.-])[^"'<\s\\]*/g;
const CANONICAL = /<link rel="canonical" href="([^"]+)"/;
const OG_URL = /<meta property="og:url" content="([^"]+)"/;
const NOINDEX = /<meta name="robots" content="noindex/;
const LOC = /<loc>([^<]+)<\/loc>/g;
const FEED_ITEM = /<item>[\s\S]*?<link>([^<]+)<\/link>/g;

function prerendered() {
	const manifest = JSON.parse(
		readFileSync(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	const outputs = [];
	for (const route of Object.keys(manifest.routes)) {
		if (route === GLOBAL_ERROR) {
			continue;
		}
		for (const name of route === "/" ? ["index.html"] : [`.${route}.html`, `.${route}.body`]) {
			const file = new URL(name, APP);
			if (existsSync(file)) {
				outputs.push({ route, html: name.endsWith(".html"), text: readFileSync(file, "utf8") });
			}
		}
	}
	return outputs;
}

const pageUrl = (route) => new URL(route, `${siteUrl}/`).href;

/** Absolute links to this site that do not start with its origin. */
function offOrigin(route, text) {
	return [...text.matchAll(SITE_URL)]
		.map(([url]) => url)
		.filter((url) => !url.startsWith(siteUrl))
		.map((url) => `${route}: ${url}`);
}

/** Where a page's canonical link or og:url names something other than the page. */
function notSelf(route, html) {
	const expected = pageUrl(route);
	const wrong = [];
	for (const [tag, pattern] of [
		["canonical", CANONICAL],
		["og:url", OG_URL],
	]) {
		const value = html.match(pattern)?.[1];
		if (!value || new URL(value).href !== expected) {
			wrong.push(`${route} ${tag}: ${value}`);
		}
	}
	return wrong;
}

function sitemapRoutes(outputs) {
	const sitemap = outputs.find(({ route }) => route === "/sitemap.xml");
	assert.ok(sitemap, "/sitemap.xml should be prerendered");
	const routes = [...sitemap.text.matchAll(LOC)].map(([, loc]) => new URL(loc).pathname);
	assert.ok(routes.length > 20, `only ${routes.length} sitemap entries`);
	return routes;
}

test("every prerendered page and the sitemap use the site origin", () => {
	const outputs = prerendered();
	sitemapRoutes(outputs);
	assert.deepEqual(
		outputs.flatMap(({ route, text }) => offOrigin(route, text)),
		[],
		`every self link should start with ${siteUrl}`
	);
});

test("each indexable prerendered page names itself as canonical and as og:url", () => {
	const pages = prerendered().filter(({ html, text }) => html && !NOINDEX.test(text));
	assert.ok(pages.length > 20, `only ${pages.length} indexable pages found`);
	assert.deepEqual(
		pages.flatMap(({ route, text }) => notSelf(route, text)),
		[]
	);
});

test("every prerendered sitemap entry is the canonical address of its page", () => {
	const outputs = prerendered();
	const canonical = new Map(
		outputs.filter(({ html }) => html).map(({ route, text }) => [route, text.match(CANONICAL)?.[1]])
	);
	const wrong = sitemapRoutes(outputs)
		.filter((route) => canonical.has(route))
		.filter((route) => new URL(canonical.get(route)).href !== pageUrl(route));
	assert.deepEqual(wrong, []);
});

test("request-time sitemap pages and the feed use the site origin and name themselves", {
	timeout: 120_000,
}, async () => {
	const outputs = prerendered();
	const rendered = new Set(outputs.filter(({ html }) => html).map(({ route }) => route));
	const requestTime = sitemapRoutes(outputs).filter((route) => !rendered.has(route));
	assert.ok(requestTime.includes("/portfolio"), `request-time entries: ${requestTime}`);
	const found = await withPortfolioFixture((fixture) =>
		withProductionServer(
			async (origin) => {
				const read = async (path) => {
					const response = await fetch(`${origin}${path}`, {
						signal: AbortSignal.timeout(30_000),
					});
					assert.equal(response.status, 200, path);
					return response.text();
				};
				const feed = await read("/feed.xml");
				const items = [...feed.matchAll(FEED_ITEM)].map(([, link]) => link);
				assert.ok(items.length > 0, "the feed lists posts");
				const problems = [
					...offOrigin("/feed.xml", feed),
					...items
						.filter((link) => !link.startsWith(`${siteUrl}/blog/`))
						.map((link) => `/feed.xml item: ${link}`),
				];
				const pages = await Promise.all(
					requestTime.map(async (route) => {
						const html = await read(route);
						return [...offOrigin(route, html), ...notSelf(route, html)];
					})
				);
				return [...problems, ...pages.flat()];
			},
			{ env: { ...fixture.env, FIGMA_ACCESS_TOKEN: "" } }
		)
	);
	assert.deepEqual(found, []);
});
