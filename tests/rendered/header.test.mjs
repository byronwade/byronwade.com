import assert from "node:assert/strict";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";

const MENU = "[data-site-menu]";
const PANEL = "[data-header-menu]";
const HYDRATION_ERROR = /hydration|hydrating|did not match|Minified React error/i;

test("site header preserves layout and accessible navigation", { timeout: 180_000 }, async (t) => {
	await withProductionServer(async (url) => {
		const browser = await puppeteer.launch({
			executablePath:
				process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
			headless: true,
		});
		try {
			const page = await browser.newPage();
			const hydrationErrors = [];
			page.on("console", (message) => {
				if (HYDRATION_ERROR.test(message.text())) {
					hydrationErrors.push(message.text());
				}
			});
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.evaluateOnNewDocument(() => {
				window.headerShifts = [];
				new PerformanceObserver((entries) => {
					for (const entry of entries.getEntries()) {
						if (entry.sources?.some((source) => source.node?.closest?.("header"))) {
							window.headerShifts.push(entry.value);
						}
					}
				}).observe({ type: "layout-shift", buffered: true });
			});
			await page.goto(url, { waitUntil: "networkidle0" });
			await page.waitForFunction(
				() => document.querySelector("[data-site-menu]")?.getAttribute("aria-expanded") === "false"
			);
			const original = await page.$eval("header", (header) =>
				header.getBoundingClientRect().toJSON()
			);

			await t.test("mobile is a 52px row with 44px targets", async () => {
				assert.equal(original.height, 52);
				assert.equal(original.y, 8);
				assert.equal(original.x, 16);
				const targets = await page.$$eval("header a, header button", (elements) =>
					elements
						.filter((element) => element.getClientRects().length)
						.map((element) => ({
							label: element.textContent || element.getAttribute("aria-label"),
							width: element.getBoundingClientRect().width,
							height: element.getBoundingClientRect().height,
						}))
				);
				for (const target of targets) {
					assert.ok(target.width >= 44 && target.height >= 44, JSON.stringify(target));
				}
			});

			await t.test("Escape can cancel the first open while panel code loads", async () => {
				const pending = [];
				const intercept = async (request) => {
					if (request.resourceType() === "script") {
						pending.push(request);
					} else {
						await request.continue();
					}
				};
				await page.setRequestInterception(true);
				page.on("request", intercept);
				try {
					await page.tap(MENU);
					await page.waitForFunction(
						() => document.querySelector("[data-site-menu]")?.getAttribute("aria-busy") === "true"
					);
					await page.focus(MENU);
					await page.keyboard.press("Escape");
					assert.equal(
						await page.$eval(MENU, (button) => button.getAttribute("aria-expanded")),
						"false"
					);
				} finally {
					await Promise.all(pending.map((request) => request.continue()));
					page.off("request", intercept);
					await page.setRequestInterception(false);
				}
				await page.waitForNetworkIdle({ idleTime: 100 });
				await page.waitForFunction(
					() => document.querySelector("[data-site-menu]") === document.activeElement
				);
				assert.equal(await page.$(PANEL), null);
			});

			await t.test(
				"touch open moves focus, locks scrolling and preserves header geometry",
				async () => {
					await page.tap(MENU);
					await page.waitForSelector(PANEL);
					await page.waitForFunction(() =>
						document.querySelector("[data-header-menu]")?.contains(document.activeElement)
					);
					assert.equal(
						await page.$eval(MENU, (button) => button.getAttribute("aria-label")),
						"Close menu"
					);
					assert.equal(
						await page.$eval(MENU, (button) => button.getAttribute("aria-controls")),
						await page.$eval(PANEL, (panel) => panel.id)
					);
					assert.equal(
						await page.evaluate(() => getComputedStyle(document.documentElement).overflow),
						"hidden"
					);
					assert.deepEqual(
						await page.$eval("header", (header) => header.getBoundingClientRect().toJSON()),
						original
					);
					const geometry = await page.$eval(PANEL, (panel) =>
						panel.getBoundingClientRect().toJSON()
					);
					assert.equal(geometry.x, original.x + 1);
					assert.equal(geometry.width, original.width - 2);
					assert.equal(geometry.y, original.bottom + 7);
					assert.equal(
						await page.$$eval(`${PANEL} nav [aria-current="page"]`, (links) => links.length),
						1
					);
				}
			);

			await t.test("Tab and Shift+Tab stay inside the panel; Escape returns focus", async () => {
				await Array.from({ length: 12 }).reduce(
					(steps) =>
						steps.then(async () => {
							await page.keyboard.press("Tab");
							assert.ok(await page.$eval(PANEL, (panel) => panel.contains(document.activeElement)));
						}),
					Promise.resolve()
				);
				await page.keyboard.down("Shift");
				await page.keyboard.press("Tab");
				await page.keyboard.up("Shift");
				assert.ok(await page.$eval(PANEL, (panel) => panel.contains(document.activeElement)));
				await page.keyboard.press("Escape");
				await page.waitForSelector(PANEL, { hidden: true });
				await page.waitForFunction(
					() => document.querySelector("[data-site-menu]") === document.activeElement
				);
				assert.ok(await page.$eval(MENU, (button) => button === document.activeElement));
				assert.notEqual(
					await page.evaluate(() => getComputedStyle(document.documentElement).overflow),
					"hidden"
				);
			});

			await t.test("outside press and the X both dismiss", async () => {
				await page.tap(MENU);
				await page.waitForSelector(PANEL);
				await page.touchscreen.tap(4, 500);
				await page.waitForSelector(PANEL, { hidden: true });
				await page.tap(MENU);
				await page.waitForSelector(PANEL);
				await page.tap(MENU);
				await page.waitForSelector(PANEL, { hidden: true });
			});

			await t.test("route changes close navigation and update the active row", async () => {
				await page.tap(MENU);
				await page.waitForSelector(PANEL);
				await page.click(`${PANEL} a[href="/blog"]`);
				await page.waitForFunction(() => location.pathname === "/blog");
				await page.waitForSelector(PANEL, { hidden: true });
				await page.tap(MENU);
				await page.waitForSelector(`${PANEL} a[href="/blog"][aria-current="page"]`);
				await page.evaluate(() => window.history.pushState(null, "", "/projects"));
				await page.waitForSelector(PANEL, { hidden: true });
				await page.tap(MENU);
				await page.waitForSelector(`${PANEL} a[href="/projects"][aria-current="page"]`);
			});

			await t.test("search shortcut replaces an open mobile menu", async () => {
				await page.keyboard.down("Control");
				await page.keyboard.press("k");
				await page.keyboard.up("Control");
				await page.waitForSelector(PANEL, { hidden: true });
				await page.waitForSelector('input[role="combobox"]');
				await page.waitForFunction(
					() => document.activeElement?.getAttribute("role") === "combobox"
				);
				await page.keyboard.press("Escape");
				await page.waitForSelector('input[role="combobox"]', { hidden: true });
				await page.tap(MENU);
				await page.waitForSelector(PANEL);
			});

			await t.test(
				"desktop resize releases the menu and keeps 44px navigation targets",
				async () => {
					await page.setViewport({ width: 1440, height: 900 });
					await page.waitForSelector(PANEL, { hidden: true });
					assert.equal(
						await page.$eval(MENU, (button) => getComputedStyle(button).display),
						"none"
					);
					const desktop = await page.$eval("header", (header) =>
						header.getBoundingClientRect().toJSON()
					);
					assert.equal(desktop.height, 52);
					assert.equal(desktop.width, 672);
					assert.ok(
						await page.$$eval('nav[aria-label="Primary"] a', (links) =>
							links.every(
								(link) =>
									link.getBoundingClientRect().height >= 44 &&
									link.getBoundingClientRect().width >= 44
							)
						)
					);
				}
			);

			await t.test(
				"search retains keyboard navigation, empty results and a 16px input",
				async () => {
					await page.click('button[aria-label="Search (⌘K)"]');
					await page.waitForSelector('input[role="combobox"]');
					assert.ok(
						await page.$eval(
							'input[role="combobox"]',
							(input) => input.getBoundingClientRect().height >= 44
						)
					);
					assert.ok(
						await page.$eval(
							'input[role="combobox"]',
							(input) => Number.parseFloat(getComputedStyle(input).fontSize) >= 16
						)
					);
					await page.type('input[role="combobox"]', "zz-no-matching-destination");
					assert.equal(await page.$$eval('[role="option"]', (options) => options.length), 0);
					await page.keyboard.press("Escape");
					await page.keyboard.down("Control");
					await page.keyboard.press("k");
					await page.keyboard.up("Control");
					await page.waitForSelector('input[role="combobox"]');
					await page.type('input[role="combobox"]', "Resume");
					await page.waitForSelector('[role="option"][aria-selected="true"]');
					await page.keyboard.press("ArrowDown");
					await page.keyboard.press("ArrowUp");
					await page.keyboard.press("Enter");
					await page.waitForFunction(() => location.pathname === "/resume");
				}
			);

			assert.deepEqual(hydrationErrors, []);
			assert.deepEqual(await page.evaluate(() => window.headerShifts), []);
			await t.test(
				"200% text keeps every header control inside the header and reserves clearance",
				async () => {
					await page.setViewport({ width: 390, height: 844 });
					await page.evaluate(() => {
						document.documentElement.style.fontSize = "200%";
					});
					assert.ok(
						await page.$eval("header", (header) => {
							const box = header.getBoundingClientRect();
							return (
								[...header.querySelectorAll("a,button")]
									.filter((element) => element.getClientRects().length)
									.every((element) => {
										const target = element.getBoundingClientRect();
										return (
											target.left >= box.left &&
											target.right <= box.right &&
											target.bottom <= box.bottom
										);
									}) && document.querySelector("main").getBoundingClientRect().top >= box.bottom
							);
						})
					);
				}
			);
		} finally {
			await browser.close();
		}
	});
});
