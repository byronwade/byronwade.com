import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

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

		await withProductionServer((url) =>
			withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
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
				let previewCount = 0;
				await [`/${kind}`, ...published].reduce(async (previous, path) => {
					await previous;
					const response = await page.goto(url + path, { waitUntil: "networkidle0" });
					assert.equal(response.status(), 200, path);
					const visible = await page.evaluate((loadingMessages) => {
						const visibility = { checkOpacity: true, checkVisibilityCSS: true };
						return {
							title: [...document.querySelectorAll("main h1")]
								.filter((heading) => heading.checkVisibility(visibility))
								.map((heading) => heading.textContent),
							paragraphs: [...document.querySelectorAll("main article p")].filter((paragraph) =>
								paragraph.checkVisibility(visibility)
							).length,
							// Reading status is separate from screenshot capture status.
							loading: [...document.querySelectorAll('main [role="status"]')].some((status) =>
								loadingMessages.includes(status.textContent.trim())
							),
							links: [...document.querySelectorAll("main a[href]")]
								.filter((link) => link.checkVisibility(visibility))
								.map((link) => link.getAttribute("href")),
							previews: [...document.querySelectorAll('main a[aria-label^="Visit "]')].map(
								(visit) => {
									const preview = visit.closest('section[aria-label$=" site preview"]');
									const open = [...(preview?.querySelectorAll("a") ?? [])].find(
										(link) => link.textContent.trim() === "Open site"
									);
									return {
										explained: preview?.innerText.includes("Enable JavaScript"),
										loading: preview?.innerText.includes("Loading preview"),
										busy: preview?.querySelector('[aria-busy="true"]') !== null,
										buttons: preview?.querySelectorAll("button").length,
										link: open?.checkVisibility(visibility) ? open.href : null,
										linkRole: open?.getAttribute("role") ?? "link",
										target: visit.href,
									};
								}
							),
						};
					}, CONTENT_LOADING);
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
					for (const preview of visible.previews) {
						previewCount += 1;
						assert.equal(preview.explained, true, `${path} explains the preview needs scripts`);
						assert.equal(preview.loading, false, `${path} does not leave a preview spinner`);
						assert.equal(preview.busy, false, `${path} does not announce a pending capture`);
						assert.equal(preview.buttons, 0, `${path} has no inactive preview controls`);
						assert.equal(preview.link, preview.target, `${path} offers the native site link`);
						assert.equal(preview.linkRole, "link", `${path} preserves link semantics`);
					}
				}, Promise.resolve());
				assert.ok(kind !== "projects" || previewCount > 0, "Project previews were exercised");
				context.diagnostic(`Checked ${previewCount} screenshot preview fallbacks`);
			})
		);
		context.diagnostic(
			`Checked the ${kind} index and ${published.length} published pages with JavaScript disabled`
		);
	});
}
