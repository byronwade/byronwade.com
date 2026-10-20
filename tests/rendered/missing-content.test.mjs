import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import matter from "gray-matter";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { closeBrowser } from "../fixtures/browser.mjs";

const HYDRATION_ERROR = /hydration|hydrating|did not match|Minified React error/i;
const H1 = /<h1[^>]*>([\s\S]*?)<\/h1>/;
const NO_STORE = /no-store/;
const NOINDEX = /<meta name="robots" content="noindex"/;
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
		"/blog/no-such-post",
		"/projects/no-such-project",
		...blog.drafts.map((slug) => `/blog/${slug}`),
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
				assert.match(html, NOINDEX, path);
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

		const browser = await puppeteer.launch({
			executablePath:
				process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
			headless: true,
			timeout: 30_000,
			protocolTimeout: 15_000,
		});
		try {
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
		} finally {
			await closeBrowser(browser, context);
		}
	});

	// next start writes a cache page for any slug it renders on demand.
	assert.deepEqual(await builtPages(), before, "missing URLs must not become cached pages");
	context.diagnostic(`Checked ${missing.length} missing and ${pages.length} real content URLs`);
});
