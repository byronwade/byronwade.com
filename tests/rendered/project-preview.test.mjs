import assert from "node:assert/strict";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { closeBrowser, withBrowser } from "../fixtures/browser.mjs";

test("A stalled project preview offers recovery and keyboard Retry loads the image", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer(async (url) => {
		await withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			// Separate pages prevent a cached capture from bypassing the stalled request.
			await [
				{ width: 390, theme: "light" },
				{ width: 1280, theme: "dark" },
			].reduce(async (previous, { width, theme }) => {
				await previous;
				const page = await browser.newPage();
				page.setDefaultTimeout(10_000);
				await page.setViewport({ width, height: 844 });
				await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
				await page.evaluateOnNewDocument((nextTheme) => {
					localStorage.setItem("theme", nextTheme);
				}, theme);
				let resolutions = 0;
				const interceptionErrors = [];
				const pageErrors = [];
				page.on("pageerror", (error) => pageErrors.push(error.message));
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					let response;
					switch (new URL(request.url()).pathname) {
						case "/api/screenshot":
							resolutions += 1;
							if (resolutions === 1) {
								// Deliberately withhold headers. The application's real ten-second
								// deadline must end the fetch and reveal its existing recovery UI.
								return;
							}
							response = request.respond({
								status: 200,
								contentType: "application/json",
								body: JSON.stringify({
									url: "/api/screenshot/image?fixture=recovered",
									mode: "static",
								}),
							});
							break;
						case "/api/screenshot/image":
							response = request.respond({
								status: 200,
								contentType: "image/svg+xml",
								body: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="gray"/></svg>',
							});
							break;
						default:
							response = request.url().startsWith(url)
								? request.continue()
								: request.respond({ status: 204, body: "" });
					}
					response.catch((error) => interceptionErrors.push(error.message));
				});
				await page.goto(`${url}/projects/thorbis`, { waitUntil: "domcontentloaded" });
				await page.waitForSelector('section[aria-label$=" site preview"] [role="status"]');
				await page.waitForFunction(
					() => {
						const preview = document.querySelector('section[aria-label$=" site preview"]');
						return preview?.innerText.includes("Preview unavailable");
					},
					{ timeout: 20_000 }
				);
				const recovery = await page.$eval('section[aria-label$=" site preview"]', (preview) => {
					const retry = [...preview.querySelectorAll("button")].find(
						(button) => button.textContent.trim() === "Retry"
					);
					retry.focus();
					return {
						busy: preview.querySelector("[aria-busy]").getAttribute("aria-busy"),
						hasSiteLink: [...preview.querySelectorAll("a")].some(
							(link) => link.textContent.trim() === "Open site"
						),
						focused: document.activeElement === retry,
					};
				});
				assert.deepEqual(recovery, { busy: "false", hasSiteLink: true, focused: true });
				await page.keyboard.press("Enter");
				await page.waitForFunction(() => {
					const preview = document.querySelector('section[aria-label$=" site preview"]');
					const image = preview?.querySelector("img");
					return (
						image?.complete &&
						image.naturalWidth > 0 &&
						preview.querySelector("[aria-busy]").getAttribute("aria-busy") === "false"
					);
				});
				assert.equal(resolutions, 2, "Retry starts a fresh resolution after the deadline");
				assert.deepEqual(pageErrors, [], "No uncaught browser errors");
				assert.deepEqual(interceptionErrors, [], "All handled interceptions settle");
				context.diagnostic(JSON.stringify({ width, theme, resolutions, recovered: true }));
				await page.close();
			}, Promise.resolve());
		});
	});
});

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

test("Project preview does not ask script-enabled visitors to enable JavaScript before hydration", {
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
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.setRequestInterception(true);
			const interceptionErrors = [];
			let blockedChunks = 0;
			// Scripting stays on, but withheld app chunks hold the page in its pre-hydration state.
			page.on("request", (request) => {
				let response;
				if (
					request.url().startsWith(`${url}/_next/static/`) &&
					request.resourceType() === "script"
				) {
					blockedChunks += 1;
					response = request.respond({
						status: 200,
						contentType: "application/javascript",
						body: "",
					});
				} else if (request.url().startsWith(url)) {
					response = request.continue();
				} else {
					response = request.respond({ status: 204, body: "" });
				}
				response.catch((error) => interceptionErrors.push(error.message));
			});
			await page.goto(`${url}/projects/thorbis`, { waitUntil: "networkidle0" });
			const preview = await page.$eval('section[aria-label$=" site preview"]', (section) => {
				const open = [...section.querySelectorAll("a")].find(
					(link) => link.textContent.trim() === "Open site"
				);
				return {
					text: section.innerText,
					link: open?.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ?? false,
				};
			});
			context.diagnostic(JSON.stringify({ blockedChunks, text: preview.text }));
			assert.ok(blockedChunks > 0, "App chunks were withheld");
			assert.ok(preview.text.includes("Screenshot preview"), "The preview is labelled");
			assert.ok(!preview.text.includes("Enable JavaScript"), "The no-script notice stays hidden");
			assert.ok(preview.link, "The native site link is visible before hydration");
			assert.deepEqual(interceptionErrors, [], "Every intercepted request settled successfully");
		} finally {
			await closeBrowser(browser, context);
		}
	});
});
