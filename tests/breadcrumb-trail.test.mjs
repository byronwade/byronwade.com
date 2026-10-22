import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "next/cache") {
			return nextResolve("next/cache.js", context);
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { resolveTrail } = await import("../components/layout/breadcrumb-trail.ts");
const { buildSearchIndex } = await import("../lib/search-index.ts");

const labels = Object.fromEntries((await buildSearchIndex()).map((e) => [e.href, e.label]));
const FIGMA_KEY = "AbC123xyzKEY";
const PAGE_FILE = /(^|\/)page\.tsx$/;
const TRAILING_SLASH = /\/$/;
const DYNAMIC_SEGMENT = /\[[^\]]+\]/g;

/** Matches concrete URLs for a route like "/blog/[slug]". */
function routePattern(route) {
	return new RegExp(`^${route.replace(DYNAMIC_SEGMENT, "[^/]+")}$`);
}

/** Page routes from the app directory, e.g. "/blog/[slug]". */
async function pageRoutes() {
	const appDir = new URL("../app/", import.meta.url);
	const files = await readdir(appDir, { recursive: true });
	return files
		.map((file) => file.replaceAll("\\", "/"))
		.filter((file) => PAGE_FILE.test(file))
		.map((file) => `/${file.replace(PAGE_FILE, "")}`.replace(TRAILING_SLASH, "") || "/");
}

/** A concrete URL for a route: a real indexed entry when one exists, else a sample id. */
function sampleUrl(route) {
	const pattern = routePattern(route);
	return (
		Object.keys(labels).find((href) => pattern.test(href)) ??
		route.replace(DYNAMIC_SEGMENT, FIGMA_KEY)
	);
}

function isPage(href, routes) {
	return routes.some((route) => routePattern(route).test(href));
}

test("every static page has a breadcrumb label, so skipping unlabeled parents never hides a page", async () => {
	for (const route of await pageRoutes()) {
		if (!route.includes("[")) {
			assert.ok(labels[route], `${route} is missing from the search index labels`);
		}
	}
});

test("every parent crumb on every route links to a page that exists", async () => {
	const routes = await pageRoutes();
	for (const route of routes) {
		const url = sampleUrl(route);
		const trail = resolveTrail(url, labels);
		assert.equal(trail.at(-1)?.href, url, `${url} must end on the current page`);
		for (const crumb of trail.slice(0, -1)) {
			assert.ok(isPage(crumb.href, routes), `${url} links to ${crumb.href}, which has no page`);
		}
	}
});

test("Figma design files skip the missing /portfolio/figma index and hide the raw file key", () => {
	assert.deepEqual(resolveTrail(`/portfolio/figma/${FIGMA_KEY}`, labels), [
		{ label: "Home", href: "/" },
		{ label: "Portfolio", href: "/portfolio" },
		{ label: "Design file", href: `/portfolio/figma/${FIGMA_KEY}` },
	]);
});

test("indexed pages keep their real titles", () => {
	const post = Object.keys(labels).find((href) => href.startsWith("/blog/"));
	assert.ok(post);
	assert.deepEqual(resolveTrail(post, labels), [
		{ label: "Home", href: "/" },
		{ label: "Blog", href: "/blog" },
		{ label: labels[post], href: post },
	]);
	assert.deepEqual(resolveTrail("/", labels), [{ label: "Home", href: "/" }]);
});

test("unknown paths get no trail, matching the prerendered /_not-found page they hydrate", () => {
	// The static 404 renders at /_not-found on the server and at the visitor's URL
	// in the browser. Any difference between the two trails is a hydration error.
	const prerendered = resolveTrail("/_not-found", labels);
	assert.deepEqual(prerendered, [{ label: "Home", href: "/" }]);
	for (const url of ["/does-not-exist", "/a/b/c", "/blog/not-a-post", "/projects/nope/extra"]) {
		assert.deepEqual(resolveTrail(url, labels), prerendered, url);
	}
});
