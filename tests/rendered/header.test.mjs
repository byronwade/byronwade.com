import assert from "node:assert/strict";
import { test } from "node:test";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { closeBrowser } from "../fixtures/browser.mjs";

const MENU = "[data-site-menu]";
const PANEL = "[data-header-menu]";
const SEARCH = "[data-header-search]";
const SEARCH_TRIGGER = 'button[aria-label="Search (⌘K)"]';
const HYDRATION_ERROR = /hydration|hydrating|did not match|Minified React error/i;

async function assertHeaderFits(page, width) {
	const layout = await page.$eval("[data-site-header]", (header) => ({
		viewport: innerWidth,
		client: document.documentElement.clientWidth,
		scroll: document.documentElement.scrollWidth,
		header: header.getBoundingClientRect().toJSON(),
		mainTop: document.querySelector("main").getBoundingClientRect().top,
		controls: [...header.querySelectorAll("a,button")]
			.filter((element) => element.getClientRects().length)
			.map((element) => {
				const box = element.getBoundingClientRect();
				return {
					label: element.getAttribute("aria-label") || element.textContent.trim(),
					box: box.toJSON(),
					reachable: element.contains(
						document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
					),
				};
			}),
	}));
	assert.equal(layout.viewport, width, "mobile emulation must preserve the requested viewport");
	assert.equal(layout.client, width);
	assert.ok(layout.scroll <= width, `horizontal document overflow: ${JSON.stringify(layout)}`);
	assert.ok(layout.header.left >= 0 && layout.header.right <= width);
	assert.ok(layout.mainTop >= layout.header.bottom, "the header must reserve content clearance");
	assert.ok(layout.controls.length >= 4, "identity, search, theme and navigation must be present");
	const overlaps = layout.controls.flatMap((control, index) =>
		layout.controls
			.slice(index + 1)
			.filter(
				(other) =>
					Math.min(control.box.right, other.box.right) -
						Math.max(control.box.left, other.box.left) >
						0.5 &&
					Math.min(control.box.bottom, other.box.bottom) -
						Math.max(control.box.top, other.box.top) >
						0.5
			)
			.map((other) => [control.label, other.label])
	);
	assert.deepEqual(overlaps, [], "header controls must not overlap");
	for (const { label, box, reachable } of layout.controls) {
		assert.ok(box.width >= 44 && box.height >= 44, `${label}: touch target is too small`);
		assert.ok(
			box.left >= layout.header.left &&
				box.right <= layout.header.right &&
				box.top >= layout.header.top &&
				box.bottom <= layout.header.bottom,
			`${label}: control is clipped by the header: ${JSON.stringify(layout)}`
		);
		assert.ok(reachable, `${label}: another element covers the control's center`);
	}
}

async function assertPanelFits(page, selector, width) {
	const panel = await page.$eval(selector, (element) => ({
		box: element.getBoundingClientRect().toJSON(),
		client: element.clientWidth,
		scroll: element.scrollWidth,
		containsFocus: element.contains(document.activeElement),
	}));
	assert.ok(panel.box.left >= 0 && panel.box.right <= width, JSON.stringify(panel));
	assert.ok(panel.scroll <= panel.client, `horizontal panel overflow: ${JSON.stringify(panel)}`);
	assert.ok(panel.containsFocus, "opening the panel must move focus inside it");
}

async function exerciseHeaderPanel(page, trigger, panel, width) {
	await page.tap(trigger);
	try {
		await page.waitForSelector(panel);
		await page.waitForFunction(
			(selector) => document.querySelector(selector)?.contains(document.activeElement),
			{},
			panel
		);
		await assertPanelFits(page, panel, width);
	} finally {
		await page.keyboard.press("Escape");
		await page.waitForSelector(panel, { hidden: true });
		await page.waitForFunction(
			(selector) => document.querySelector(selector) === document.activeElement,
			{},
			trigger
		);
	}
	await assertHeaderFits(page, width);
}

async function checkResponsiveHeader(page, { width, theme, textSize }) {
	await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
	if (
		(await page.evaluate(() => document.documentElement.classList.contains("dark"))) !==
		(theme === "dark")
	) {
		await page.tap('button[aria-label="Toggle theme"]');
		await page.waitForFunction(
			(dark) => document.documentElement.classList.contains("dark") === dark,
			{},
			theme === "dark"
		);
	}
	await page.evaluate((size) => {
		document.documentElement.style.fontSize = size;
	}, textSize);
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
	);
	await assertHeaderFits(page, width);
	const hasMenu = await page.$eval(MENU, (button) => getComputedStyle(button).display !== "none");
	if (hasMenu) {
		await exerciseHeaderPanel(page, MENU, PANEL, width);
	}
	await exerciseHeaderPanel(page, SEARCH_TRIGGER, SEARCH, width);
}

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
				// The loaded panel code replaces the fallback trigger with Base UI's own
				// node. Network idle can arrive before React commits that swap, and the
				// next test would then tap the fallback as it is removed. Wait for focus
				// on the mounted trigger, which is what the cancelled open promises.
				await page.waitForFunction(() => {
					const menu = document.querySelector("[data-site-menu]");
					return (
						menu?.hasAttribute("data-base-ui-click-trigger") && menu === document.activeElement
					);
				});
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
				// Past the last control, Tab lands on Base UI's focus-guard span, which
				// moves focus back into the panel on its own focus event. Sampling the
				// active element synchronously raced that redirect and failed on main
				// as well. Waiting is not lenient: focus that escapes to the page never
				// returns, so the wait still times out on a broken trap.
				const focusInsidePanel = () =>
					page.waitForFunction(
						(selector) => document.querySelector(selector)?.contains(document.activeElement),
						{ timeout: 1000 },
						PANEL
					);
				await Array.from({ length: 12 }).reduce(
					(steps) =>
						steps.then(async () => {
							await page.keyboard.press("Tab");
							await focusInsidePanel();
						}),
					Promise.resolve()
				);
				await page.keyboard.down("Shift");
				await page.keyboard.press("Tab");
				await page.keyboard.up("Shift");
				await focusInsidePanel();
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
					await page.click(SEARCH_TRIGGER);
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
			await closeBrowser(browser, t);
		}
	});
});

test("header controls and panels fit real responsive viewports", {
	timeout: 180_000,
}, async (t) => {
	await withProductionServer(async (url) => {
		const browser = await puppeteer.launch({
			executablePath:
				process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
			headless: true,
		});
		try {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(30_000);
			const runtimeErrors = [];
			page.on("pageerror", (error) => runtimeErrors.push(error.message));
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			await page.goto(url, { waitUntil: "networkidle0" });
			await page.waitForFunction(
				() => document.querySelector("[data-site-menu]")?.getAttribute("aria-expanded") === "false"
			);
			// Isolate shared chrome from page-specific reflow while retaining its real CSS and shell.
			await page.$eval("main", (main) => {
				main.textContent = "Header geometry fixture.";
			});
			// Include both sides of viewport and header-container breakpoints.
			const cases = ["light", "dark"].flatMap((theme) =>
				["100%", "200%"].flatMap((textSize) =>
					[320, 390, 639, 640, 679, 680, 768, 1440].map((width) => ({ width, theme, textSize }))
				)
			);
			// Viewports and modal states share one page and must run sequentially.
			await cases.reduce(
				(steps, scenario) =>
					steps.then(() =>
						t.test(`${scenario.width}px, ${scenario.theme}, ${scenario.textSize} text`, () =>
							checkResponsiveHeader(page, scenario)
						)
					),
				Promise.resolve()
			);
			assert.deepEqual(runtimeErrors, []);
		} finally {
			await closeBrowser(browser, t);
		}
	});
});
