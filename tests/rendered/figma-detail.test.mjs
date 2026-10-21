import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { renderFigmaDetail } from "../fixtures/figma-detail.mjs";

test("synthetic Figma details preserve reflow, keyboard access and breadcrumb landmarks", {
	timeout: 180_000,
}, async (context) => {
	const cssDirectory = new URL("../../.next/static/css/", import.meta.url);
	const files = (await readdir(cssDirectory, { recursive: true })).filter((file) =>
		file.endsWith(".css")
	);
	const css = (
		await Promise.all(files.map((file) => readFile(new URL(file, cssDirectory), "utf8")))
	).join("\n");
	const content = await renderFigmaDetail({ name: "LongUnbrokenDesignName".repeat(8) });
	const breadcrumbs = await renderFigmaDetail({}, { includeSiteBreadcrumb: true });
	await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultNavigationTimeout(20_000);
			await page.setCacheEnabled(false);
			await page.setRequestInterception(true);
			let fixture;
			page.on("request", async (request) => {
				if (request.url() === `${url}/portfolio/figma/ExampleKey`) {
					await request.respond({ status: 200, contentType: "text/html", body: fixture });
				} else if (request.url().startsWith(url)) {
					await request.continue();
				} else {
					await request.respond({ status: 200, contentType: "text/html", body: "" });
				}
			});
			const states = ["light", "dark"].flatMap((theme) =>
				[
					[320, 200],
					[390, 100],
				].map(([width, scale]) => ({ theme, width, scale }))
			);
			// One intercepted fixture and one page must be exercised serially.
			await states.reduce(async (previous, { theme, width, scale }) => {
				await previous;
				fixture = `<!doctype html><html lang="en" class="${theme}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}html{font-size:${scale}%}</style></head><body>${content}</body></html>`;
				await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
				await page.goto(`${url}/portfolio/figma/ExampleKey`, { waitUntil: "networkidle0" });
				const layout = await page.evaluate(() => ({
					viewport: innerWidth,
					scroll: document.documentElement.scrollWidth,
					controls: [...document.querySelectorAll("nav a, button")].map((element) =>
						element.getBoundingClientRect().toJSON()
					),
					labels: [...document.querySelectorAll('[data-slot="sheet"] p')].map((element) => {
						const range = document.createRange();
						range.selectNodeContents(element);
						return {
							card: element.closest('[data-slot="sheet"]').getBoundingClientRect().toJSON(),
							text: [...range.getClientRects()].map((rect) => rect.toJSON()),
						};
					}),
				}));
				const stateLabel = `${theme}/${width}/${scale}%`;
				assert.equal(layout.viewport, width, stateLabel);
				assert.ok(layout.scroll <= width, stateLabel);
				assert.ok(
					layout.controls.every(
						(box) => box.width >= 44 && box.height >= 44 && box.left >= 0 && box.right <= width
					),
					stateLabel
				);
				assert.ok(
					layout.labels.every(({ card, text }) =>
						text.every(
							(box) => box.left >= card.left && box.right <= card.right && box.bottom <= card.bottom
						)
					),
					stateLabel
				);
			}, Promise.resolve());

			const client = await page.createCDPSession();
			try {
				await ["light", "dark"]
					.flatMap((theme) => [390, 1440].map((width) => ({ theme, width })))
					.reduce(async (previous, { theme, width }) => {
						await previous;
						await context.test(
							`${theme}/${width}: breadcrumb landmarks are distinguishable`,
							async () => {
								fixture = `<!doctype html><html lang="en" class="${theme}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${breadcrumbs}</body></html>`;
								await page.setViewport({
									width,
									height: 900,
									isMobile: width === 390,
									hasTouch: width === 390,
								});
								await page.goto(`${url}/portfolio/figma/ExampleKey`, { waitUntil: "networkidle0" });
								const { nodes } = await client.send("Accessibility.getFullAXTree");
								const navigationNames = nodes
									.filter((node) => !node.ignored && node.role?.value === "navigation")
									.map((node) => node.name?.value);
								assert.deepEqual(
									navigationNames.sort(),
									width === 1440
										? ["Breadcrumb", "Design file breadcrumb"]
										: ["Design file breadcrumb"]
								);
								assert.equal(new Set(navigationNames).size, navigationNames.length);
								const trail = 'main nav[aria-label="Design file breadcrumb"]';
								assert.equal(
									await page.$eval(
										`${trail} [aria-current="page"]`,
										(element) => element.textContent
									),
									"Example design"
								);
								assert.equal(
									await page.$eval(`${trail} a`, (link) => link.getAttribute("href")),
									"/portfolio"
								);
								await page.focus(`${trail} a`);
								assert.equal(
									await page.$eval(`${trail} a`, (link) => link === document.activeElement),
									true
								);
								// The page's primary action comes next, then the viewer toggle.
								await page.keyboard.press("Tab");
								assert.equal(
									await page.$eval(
										'main a[href="https://www.figma.com/file/ExampleKey"]',
										(link) => link === document.activeElement
									),
									true
								);
								await page.keyboard.press("Tab");
								assert.equal(
									await page.$eval("main button", (button) => button === document.activeElement),
									true
								);
							}
						);
					}, Promise.resolve());
			} finally {
				await client.detach();
			}
		})
	);
});
