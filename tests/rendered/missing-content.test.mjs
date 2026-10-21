import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import matter from "gray-matter";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const HYDRATION_ERROR = /hydration|hydrating|did not match|Minified React error/i;
const H1 = /<h1[^>]*>([\s\S]*?)<\/h1>/;
const NO_STORE = /no-store/;
const ROBOTS = /<meta name="(robots|googlebot)" content="([^"]*)"\s*\/?\s*>/g;
const DIRECTIVE_SEPARATOR = /,\s*/;
const SKELETON = /Loading (?:post|project)/;
const BUILT_PAGES = ["blog", "projects"].map(
	(kind) => new URL(`../../.next/server/app/${kind}/`, import.meta.url)
);

async function contentSlugs(kind) {
	const directory = new URL(`../../content/${kind}/`, import.meta.url);
	const files = (await readdir(directory)).filter((name) => name.endsWith(".md"));
	const entries = await Promise.all(
		files.map(async (file) => ({
			slug: file.slice(0, -3),
			draft: matter(await readFile(new URL(file, directory), "utf8")).data.draft === true,
		}))
	);
	return {
		published: entries.find((entry) => !entry.draft).slug,
		drafts: entries.filter((entry) => entry.draft).map((entry) => entry.slug),
	};
}

async function builtPages() {
	const listings = await Promise.all(BUILT_PAGES.map((directory) => readdir(directory)));
	return listings
		.flat()
		.filter((name) => name.endsWith(".html"))
		.sort();
}

test("unknown and draft content URLs are real 404s that hydrate cleanly", {
	timeout: 180_000,
}, async (context) => {
	const blog = await contentSlugs("blog");
	const projects = await contentSlugs("projects");
	const missing = [
		"/does-not-exist",
		"/missing/nested/page",
		"/blog/no-such-post",
		"/projects/no-such-project",
		...blog.drafts.map((slug) => `/blog/${slug}`),
		...projects.drafts.map((slug) => `/projects/${slug}`),
	];
	const pages = [
		[`/blog/${blog.published}`, "Blog"],
		[`/projects/${projects.published}`, "Projects"],
	];
	const before = await builtPages();

	await withProductionServer(async (url) => {
		await Promise.all(
			missing.map(async (path) => {
				const response = await fetch(url + path);
				const html = await response.text();
				assert.equal(response.status, 404, path);
				assert.match(response.headers.get("cache-control") ?? "", NO_STORE, path);
				const directives = [...html.matchAll(ROBOTS)];
				assert.deepEqual(
					directives.filter(([, name]) => name === "robots").map(([, , value]) => value),
					["noindex"],
					`${path} has one unambiguous robots policy`
				);
				for (const [, name, value] of directives) {
					assert.ok(
						!value.split(DIRECTIVE_SEPARATOR).includes("index"),
						`${path}: ${name} cannot index a 404`
					);
				}
				assert.equal(html.match(H1)?.[1], "Page not found", `${path} server-renders recovery`);
				assert.doesNotMatch(html, SKELETON, `${path} streams no skeleton`);
			})
		);
		await Promise.all(
			pages.map(async ([path]) => {
				const response = await fetch(url + path);
				assert.equal(response.status, 200, path);
				assert.notEqual((await response.text()).match(H1)?.[1], "Page not found", path);
			})
		);

		await withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const requestUrl = request.url();
				if (requestUrl.startsWith(url) && !requestUrl.startsWith(`${url}/_vercel/`)) {
					request.continue();
				} else {
					request.respond({ status: 204, body: "" });
				}
			});
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			page.on("console", (message) => {
				if (HYDRATION_ERROR.test(message.text())) {
					errors.push(message.text());
				}
			});

			// One page, serially: each visit's errors and header state belong to it alone.
			const visits = [
				...missing.map((path) => [path, null, "Page not found"]),
				...pages.map(([path, section]) => [path, section, null]),
			];
			await visits.reduce(async (previous, [path, section, heading]) => {
				await previous;
				errors.length = 0;
				await page.goto(url + path, { waitUntil: "networkidle0" });
				// NavDock's mount effect sets this; the menu only opens once it has hydrated.
				await page.waitForFunction(
					() => document.documentElement.style.scrollPaddingBlockStart !== ""
				);
				const desktopCurrent = await page.$$eval(
					'nav[aria-label="Primary"] a[aria-current="page"]',
					(links) => links.map((link) => link.textContent)
				);
				await page.click("[data-site-menu]");
				const menu = await page.waitForSelector('nav[aria-label="Mobile site navigation"]');
				const state = await menu.evaluate((nav) => ({
					label: nav.previousElementSibling?.lastElementChild?.textContent,
					current: [...nav.querySelectorAll('a[aria-current="page"]')].length,
					heading: document.querySelector("h1")?.textContent,
				}));
				await page.keyboard.press("Escape");
				assert.deepEqual(errors, [], `${path} hydrates without errors`);
				// The 404 is no section's page; real pages keep their section current.
				assert.deepEqual(desktopCurrent, section ? [section] : [], path);
				assert.equal(state.label, section ?? "Explore", path);
				assert.equal(state.current, section ? 1 : 0, path);
				if (heading) {
					assert.equal(state.heading, heading, path);
				}
			}, Promise.resolve());
		});
	});

	// next start writes a cache page for any slug it renders on demand.
	assert.deepEqual(await builtPages(), before, "missing URLs must not become cached pages");
	context.diagnostic(`Checked ${missing.length} missing and ${pages.length} real content URLs`);
});

test("published pages remain indexable while search stays noindex", {
	timeout: 60_000,
}, async () => {
	const blog = await contentSlugs("blog");
	const projects = await contentSlugs("projects");
	const published = [
		"/",
		"/portfolio",
		"/blog",
		"/projects",
		"/contact",
		"/resume",
		"/privacy",
		"/terms",
		`/blog/${blog.published}`,
		`/projects/${projects.published}`,
	];
	await withProductionServer(async (url) => {
		await Promise.all(
			[...published, "/search?q=robots"].map(async (path) => {
				const response = await fetch(url + path, { signal: AbortSignal.timeout(15_000) });
				assert.equal(response.status, 200, path);
				const directives = [...(await response.text()).matchAll(ROBOTS)];
				const robots = directives.filter(([, name]) => name === "robots");
				assert.ok(robots.length <= 1, `${path} has no duplicate robots metadata`);
				if (path.startsWith("/search")) {
					assert.equal(robots.length, 1, "search explicitly opts out of indexing");
					for (const [, name, value] of directives) {
						assert.ok(value.split(DIRECTIVE_SEPARATOR).includes("noindex"), `${path}: ${name}`);
					}
				} else {
					for (const [, name, value] of directives) {
						const tokens = value.split(DIRECTIVE_SEPARATOR);
						assert.ok(!tokens.includes("noindex"), `${path}: ${name} allows indexing`);
						assert.ok(!tokens.includes("nofollow"), `${path}: ${name} allows following links`);
					}
				}
				if (path === "/" || path === "/portfolio") {
					const googlebot = directives.find(([, name]) => name === "googlebot")?.[2];
					assert.deepEqual(
						googlebot
							?.split(DIRECTIVE_SEPARATOR)
							.filter((token) => token.startsWith("max-"))
							.sort(),
						["max-image-preview:large", "max-snippet:-1", "max-video-preview:-1"],
						`${path} preserves inherited rich-preview settings`
					);
				}
			})
		);
	});
});
