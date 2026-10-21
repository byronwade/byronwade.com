import assert from "node:assert/strict";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { closeBrowser } from "../fixtures/browser.mjs";

test("Project preview recovery actions fit the narrow viewport", {
	timeout: 120_000,
}, async (context) => {
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
			await page.setViewport({ width: 320, height: 844, isMobile: true, hasTouch: true });
			await page.setRequestInterception(true);
			const interceptionErrors = [];
			page.on("request", (request) => {
				let response;
				if (request.url().startsWith(`${url}/api/screenshot?`)) {
					response = request.respond({ status: 503, contentType: "application/json", body: "{}" });
				} else if (request.url().startsWith(url)) {
					response = request.continue();
				} else {
					response = request.respond({ status: 204, body: "" });
				}
				response.catch((error) => interceptionErrors.push(error.message));
			});
			await page.goto(`${url}/projects/thorbis`, { waitUntil: "networkidle0" });
			await page.waitForFunction(() =>
				document
					.querySelector('section[aria-label$=" site preview"]')
					?.innerText.includes("Preview unavailable")
			);
			// Both sizes share one page, so each measurement must finish before the next resize.
			await ["100%", "200%"].reduce(async (previous, fontSize) => {
				await previous;
				await page.evaluate(async (size) => {
					document.documentElement.style.fontSize = size;
					await new Promise((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(resolve))
					);
				}, fontSize);
				const actions = await page.evaluate(() => {
					const preview = document.querySelector('section[aria-label$=" site preview"]');
					const viewport = preview.querySelector("[aria-busy]").getBoundingClientRect();
					return [...preview.querySelectorAll("button, a")]
						.filter((action) => ["Retry", "Open site"].includes(action.textContent.trim()))
						.map((action) => {
							const rect = action.getBoundingClientRect();
							return {
								label: action.textContent.trim(),
								height: rect.height,
								width: rect.width,
								contained:
									rect.top >= viewport.top &&
									rect.bottom <= viewport.bottom &&
									rect.left >= viewport.left &&
									rect.right <= viewport.right,
							};
						});
				});
				context.diagnostic(JSON.stringify({ fontSize, actions }));
				assert.equal(actions.length, 2, "Both recovery actions are present");
				for (const action of actions) {
					assert.ok(action.height >= 44 && action.width >= 44, `${action.label} is touch-sized`);
					assert.ok(action.contained, `${action.label} is fully visible inside the preview`);
				}
			}, Promise.resolve());
			assert.deepEqual(interceptionErrors, [], "Every intercepted request settled successfully");
		} finally {
			await closeBrowser(browser, context);
		}
	});
});
