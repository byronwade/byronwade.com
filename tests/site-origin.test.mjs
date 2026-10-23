import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// The site is served from www: production answers https://byronwade.com with a
// 308 to https://www.byronwade.com. A canonical, sitemap entry or feed link on
// the apex therefore names a redirect, not the page. lib/site.ts owns the origin.
const SERVED_ORIGIN = "https://www.byronwade.com";
// An absolute URL on this site itself. `://` directly before the host keeps
// project subdomains such as rebuzzle.byronwade.com out of it.
const SITE_URL = /https?:\/\/(?:www\.)?byronwade\.com(?![\w.-])/g;
const SITEMAP_LINE = /^Sitemap:\s*(\S+)/m;
const SCANNED = ["app", "components", "content", "hooks", "lib", "public"];
const TEXT_FILE = /\.(?:css|json|md|mdx|mjs|ts|tsx|txt|xml)$/;
const OWNER = "lib/site.ts";
const ROBOTS = "public/robots.txt";

async function fallbackSiteUrl() {
	const configured = process.env.NEXT_PUBLIC_BASE_URL;
	process.env.NEXT_PUBLIC_BASE_URL = "";
	try {
		const { siteUrl } = await import(`../lib/site.ts?fallback=${Date.now()}`);
		return siteUrl;
	} finally {
		if (configured === undefined) {
			delete process.env.NEXT_PUBLIC_BASE_URL;
		} else {
			process.env.NEXT_PUBLIC_BASE_URL = configured;
		}
	}
}

test("without an override the site origin is the host production serves", async () => {
	assert.equal(await fallbackSiteUrl(), SERVED_ORIGIN);
});

test("robots.txt points crawlers at the sitemap on the site origin", async () => {
	const robots = await readFile(new URL(`../${ROBOTS}`, import.meta.url), "utf8");
	assert.equal(robots.match(SITEMAP_LINE)?.[1], `${await fallbackSiteUrl()}/sitemap.xml`);
});

test("only lib/site.ts spells out the site's own origin", async () => {
	const root = fileURLToPath(new URL("../", import.meta.url));
	const entries = (
		await Promise.all(
			SCANNED.map((directory) =>
				readdir(join(root, directory), { recursive: true, withFileTypes: true })
			)
		)
	).flat();
	const paths = entries
		.filter((entry) => entry.isFile())
		.map((entry) => relative(root, join(entry.parentPath, entry.name)).replaceAll("\\", "/"))
		.filter((path) => TEXT_FILE.test(path) && path !== OWNER && path !== ROBOTS);
	const found = (
		await Promise.all(
			paths.map(async (path) =>
				[...(await readFile(join(root, path), "utf8")).matchAll(SITE_URL)].map(
					([url]) => `${path}: ${url}`
				)
			)
		)
	).flat();
	assert.ok(paths.length > 100, `only ${paths.length} files scanned`);
	assert.deepEqual(found, [], "import siteUrl from @/lib/site instead");
});
