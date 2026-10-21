import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { closeBrowser } from "../fixtures/browser.mjs";

const CONTENT_LOADING = [
	"Loading post…",
	"Loading posts…",
	"Loading project…",
	"Loading projects…",
];

for (const kind of ["blog", "projects"]) {
	test(`${kind} index and published pages remain readable without JavaScript`, {
		timeout: 180_000,
	}, async (context) => {
		// The build uses the canonical loaders and draft rules to decide which URLs exist.
		const manifest = JSON.parse(
			await readFile(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
		);
		const published = Object.keys(manifest.routes).filter((path) => path.startsWith(`/${kind}/`));
		assert.ok(published.length > 0, `${kind} has published content to check`);

		await withProductionServer(async (url) => {
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
				await page.setJavaScriptEnabled(false);
				await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					if (request.url().startsWith(url)) {
						request.continue();
					} else {
						request.respond({ status: 204, body: "" });
					}
				});
				// One page, serial visits: navigation cannot overlap on a shared browser page.
				await [`/${kind}`, ...published].reduce(async (previous, path) => {
					await previous;
					const response = await page.goto(url + path, { waitUntil: "networkidle0" });
					assert.equal(response.status(), 200, path);
					const visible = await page.evaluate(
						(loadingMessages) => ({
							title: [...document.querySelectorAll("main h1")]
								.filter((heading) => heading.checkVisibility())
								.map((heading) => heading.textContent),
							paragraphs: [...document.querySelectorAll("main article p")].filter((paragraph) =>
								paragraph.checkVisibility()
							).length,
							// Preview widgets load independently; the reading surface must be complete.
							loading: [...document.querySelectorAll('main [role="status"]')].some((status) =>
								loadingMessages.includes(status.textContent.trim())
							),
							links: [...document.querySelectorAll("main a[href]")]
								.filter((link) => link.checkVisibility())
								.map((link) => link.getAttribute("href")),
						}),
						CONTENT_LOADING
					);
					assert.equal(visible.title.length, 1, `${path} exposes one title without scripts`);
					assert.ok(visible.title[0].trim(), `${path} has a descriptive title`);
					if (path === `/${kind}`) {
						assert.deepEqual(
							[...new Set(visible.links.filter((href) => published.includes(href)))].sort(),
							published.toSorted(),
							`${path} exposes every published entry without scripts`
						);
					} else {
						assert.ok(visible.paragraphs > 0, `${path} exposes the prose without scripts`);
					}
					assert.equal(visible.loading, false, `${path} does not leave a loading skeleton`);
				}, Promise.resolve());
			} finally {
				await closeBrowser(browser, context);
			}
		});
		context.diagnostic(
			`Checked the ${kind} index and ${published.length} published pages with JavaScript disabled`
		);
	});
}
