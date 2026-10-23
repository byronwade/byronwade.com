import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { SEARCH_QUERY_MAX } from "../../lib/search-match.ts";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { expectCachedCorpora } from "../fixtures/search-cache.mjs";

const NO_MATCHES = /No matches/;

test("search query summaries reflow at 200% text without losing results or native input", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer(async (origin) => {
		await withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(20_000);
			const client = await page.createCDPSession();
			await client.send("Page.setFontSizes", { fontSizes: { standard: 32 } });
			const cases = [320, 390, 1280].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			);
			await cases.reduce(async (previous, { width, theme }) => {
				await previous;
				await context.test(`${width}px ${theme}: filename and unbroken query`, async () => {
					await page.setViewport({ width, height: 900 });
					const themeScript = await page.evaluateOnNewDocument((value) => {
						localStorage.setItem("theme", value);
					}, theme);
					try {
						await page.goto(`${origin}/search?q=claude_desktop_config.json`);
						assert.equal(
							await page.$eval("html", (html) => getComputedStyle(html).fontSize),
							"32px"
						);
						assert.equal(
							await page.$eval("html", (html) => html.classList.contains("dark")),
							theme === "dark"
						);
						assert.ok(await page.$('main a[href="/projects/memoria"]'));
						await page.evaluate(() => document.fonts.ready);
						const measure = () =>
							page.evaluate(() => ({
								viewport: document.documentElement.clientWidth,
								content: document.documentElement.scrollWidth,
							}));
						let geometry = await measure();
						assert.ok(geometry.content <= geometry.viewport, JSON.stringify(geometry));
						await page.focus("#site-search");
						await page.keyboard.down("Control");
						await page.keyboard.press("a");
						await page.keyboard.up("Control");
						const longQuery = "z".repeat(SEARCH_QUERY_MAX);
						await page.keyboard.type(longQuery);
						await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
						assert.equal(new URL(page.url()).searchParams.get("q"), longQuery);
						assert.equal(await page.$eval("#site-search", (input) => input.value), longQuery);
						assert.match(await page.$eval("main", (main) => main.textContent), NO_MATCHES);
						await page.evaluate(() => document.fonts.ready);
						geometry = await measure();
						assert.ok(geometry.content <= geometry.viewport, JSON.stringify(geometry));
					} finally {
						await page.removeScriptToEvaluateOnNewDocument(themeScript.identifier);
					}
				});
			}, Promise.resolve());
		});
	});
});

test("production search finds readable inline identifiers and keeps native GET submission", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer(async (origin) => {
		await withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(20_000);
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			const states = [390, 1280].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			);
			// All cases share one page and must run serially.
			await states.reduce(async (previous, { width, theme }) => {
				await previous;
				await context.test(`${width}px ${theme}: body search and keyboard submit`, async () => {
					await page.setViewport({ width, height: 900 });
					const themeScript = await page.evaluateOnNewDocument((value) => {
						localStorage.setItem("theme", value);
					}, theme);
					try {
						const query = `claude_desktop_config.json   Claude${" ".repeat(120)}Desktop`;
						const response = await page.goto(`${origin}/search?q=${encodeURIComponent(query)}`);
						assert.equal(response.status(), 200);
						assert.equal(await page.$eval("h1", (heading) => heading.textContent), "Search");
						assert.equal(
							await page.$eval("html", (html) => html.classList.contains("dark")),
							theme === "dark"
						);
						assert.equal(
							await page.$eval("#site-search", (input) => input.value),
							"claude_desktop_config.json Claude Desktop"
						);
						assert.ok(await page.$('main a[href="/projects/memoria"]'));
						assert.ok(
							await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
						);
						await page.focus("#site-search");
						await page.keyboard.down("Control");
						await page.keyboard.press("a");
						await page.keyboard.up("Control");
						await page.keyboard.type("zz-no-readable-result");
						await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
						assert.equal(new URL(page.url()).searchParams.get("q"), "zz-no-readable-result");
						assert.match(await page.$eval("main", (main) => main.textContent), NO_MATCHES);
					} finally {
						await page.removeScriptToEvaluateOnNewDocument(themeScript.identifier);
					}
				});
			}, Promise.resolve());
			assert.deepEqual(errors, []);
		});
	});
});

test("production search reuses its corpus and immediately follows authored content changes", {
	timeout: 60_000,
}, async (context) => {
	const marker = `searchcache${randomUUID().replaceAll("-", "")}`;
	const projectPath = join(process.cwd(), "content", "projects", `${marker}.md`);
	const postPath = join(process.cwd(), "content", "blog", `${marker}.md`);
	context.after(async () => {
		await rm(projectPath, { force: true });
		await rm(postPath, { force: true });
	});
	const project = (title, body) => `---\ntitle: ${title}\n---\n${marker} ${body}\n`;
	const post = (draft) =>
		`---\ntitle: ${marker} post\ndate: 2026-10-22\ndraft: ${draft}\n---\n${marker} draftbody\n`;
	await writeFile(projectPath, project("Original corpus fixture", "alphabody"));
	await writeFile(postPath, post(true));
	await mkdir(join(process.cwd(), ".next", "cache", "fetch-cache"), { recursive: true });

	await withProductionServer(async (origin) => {
		async function search(query) {
			const response = await fetch(`${origin}/search?q=${encodeURIComponent(query)}`, {
				signal: AbortSignal.timeout(15_000),
			});
			assert.equal(response.status, 200);
			return response.text();
		}
		const projectLink = `href="/projects/${marker}"`;
		const postLink = `href="/blog/${marker}"`;
		assert.ok((await search(`${marker} alphabody`)).includes(projectLink));
		await expectCachedCorpora(marker, 1);
		assert.ok(!(await search(`${marker} draftbody`)).includes(postLink));
		assert.ok(!(await search(`${marker} betabody`)).includes(projectLink));
		await expectCachedCorpora(marker, 1);

		await writeFile(projectPath, project("Updated corpus fixture", "alphabody"));
		assert.ok((await search(`${marker} Updated`)).includes(projectLink));
		await expectCachedCorpora(marker, 2);
		await writeFile(projectPath, project("Updated corpus fixture", "betabody"));
		assert.ok((await search(`${marker} betabody`)).includes(projectLink));
		assert.ok(!(await search(`${marker} alphabody`)).includes(projectLink));
		await expectCachedCorpora(marker, 3);

		await writeFile(postPath, post(false));
		assert.ok((await search(`${marker} draftbody`)).includes(postLink));
		await expectCachedCorpora(marker, 4);
		await writeFile(postPath, post(true));
		assert.ok(!(await search(`${marker} draftbody`)).includes(postLink));
		await expectCachedCorpora(marker, 4);

		await writeFile(projectPath, "---\ntitle: [broken\n---\n");
		assert.ok(!(await search(`${marker} betabody`)).includes(projectLink));
		await writeFile(projectPath, project("Updated corpus fixture", "betabody"));
		assert.ok((await search(`${marker} betabody`)).includes(projectLink));
		await expectCachedCorpora(marker, 4);
		await rm(projectPath);
		assert.ok(!(await search(`${marker} betabody`)).includes(projectLink));
	});
});
