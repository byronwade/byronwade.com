import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { renderFigmaDetail } from "../fixtures/figma-detail.mjs";

async function closeBrowser(browser, context) {
	const child = browser.process();
	let timer;
	const closed = await Promise.race([
		browser.close().then(() => true),
		new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), 10_000);
		}),
	]);
	clearTimeout(timer);
	// Chrome sometimes leaves its owned process alive after a completed CDP close.
	if (!closed && child && child.exitCode === null && child.signalCode === null) {
		if (process.platform === "win32") {
			const result = spawnSync("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], {
				windowsHide: true,
				timeout: 15_000,
			});
			assert.equal(result.status, 0, "the owned Chrome process tree must stop");
			context.diagnostic(`Stopped owned Chrome tree ${child.pid} after its close timeout`);
		} else {
			child.kill("SIGKILL");
		}
	}
}

test("synthetic Figma details reflow and keep controls reachable at 200% text", {
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
			page.setDefaultNavigationTimeout(20_000);
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
					labels: [
						...document.querySelector("h1").parentElement.nextElementSibling.querySelectorAll("p"),
					].map((element) => {
						const range = document.createRange();
						range.selectNodeContents(element);
						return {
							card: element.closest('[data-slot="card"]').getBoundingClientRect().toJSON(),
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
		} finally {
			await closeBrowser(browser, context);
		}
	});
});
