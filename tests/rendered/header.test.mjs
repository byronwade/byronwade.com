import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const MENU = "[data-site-menu]";
const PANEL = "[data-header-menu]";
const SEARCH = "[data-header-search]";
const SEARCH_TRIGGER = 'button[aria-label="Search (⌘K)"]';
const HYDRATION_ERROR = /hydration|hydrating|did not match|Minified React error/i;

/** Let queued animation-frame work finish, e.g. Base UI moving focus off a modal edge guard. */
function settleFrames(page) {
	return page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
	);
}

/** Each subtest states the menu it starts from, so one failure cannot cascade into the next. */
async function setMenuOpen(page, open) {
	if ((await page.$eval(MENU, (button) => button.getAttribute("aria-expanded"))) !== String(open)) {
		await page.tap(MENU);
	}
	await page.waitForSelector(PANEL, { hidden: !open });
}

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
	assert.ok(
		layout.mainTop >= layout.header.bottom,
		`the header must reserve content clearance: ${JSON.stringify(layout)}`
	);
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
		// An unsized panel once widened the mobile layout viewport past the screen.
		layoutViewport: innerWidth,
		positioner: element.parentElement.getAttribute("style"),
	}));
	assert.equal(panel.layoutViewport, width, `the panel widened the page: ${JSON.stringify(panel)}`);
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

/** Every case loads fresh at its viewport and text size, so no state carries between cases. */
async function checkResponsiveHeader(page, client, url, { width, theme, textSize }) {
	await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
	// Larger text arrives as the reader's default font size, before the first style pass.
	// Rewriting the root size under a laid-out page left container-query styles stale in
	// Chrome on Linux: one size-11 button measured 44px while two others measured 88px.
	await client.send("Page.setFontSizes", {
		fontSizes: { standard: (16 * Number.parseFloat(textSize)) / 100 },
	});
	await page.goto(url, { waitUntil: "networkidle0" });
	await page.waitForFunction(
		() => document.querySelector("[data-site-menu]")?.getAttribute("aria-expanded") === "false"
	);
	// Isolate shared chrome from page-specific reflow while retaining its real CSS and shell.
	await page.$eval("main", (main) => {
		main.textContent = "Header geometry fixture.";
	});
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
	await settleFrames(page);
	await assertHeaderFits(page, width);
	const hasMenu = await page.$eval(MENU, (button) => getComputedStyle(button).display !== "none");
	if (hasMenu) {
		await exerciseHeaderPanel(page, MENU, PANEL, width);
	}
	await exerciseHeaderPanel(page, SEARCH_TRIGGER, SEARCH, width);
}

test("site header preserves layout and accessible navigation", { timeout: 180_000 }, async (t) => {
	await withProductionServer((url) =>
		withBrowser(t, {}, async (browser) => {
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
							// Enough to name the cause: a late font swap once moved header text 3.7px.
							window.headerShifts.push({
								value: entry.value,
								hadRecentInput: entry.hadRecentInput,
								startTime: Math.round(entry.startTime),
								path: location.pathname,
								sources: entry.sources.map((source) => ({
									node: `${source.node?.nodeName}.${source.node?.className?.baseVal ?? source.node?.className}`,
									previous: source.previousRect.toJSON(),
									current: source.currentRect.toJSON(),
								})),
							});
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
				let fallbackTrigger;
				try {
					await page.tap(MENU);
					await page.waitForFunction(
						() => document.querySelector("[data-site-menu]")?.getAttribute("aria-busy") === "true"
					);
					// While the panel code loads, this busy button is a stand-in that React replaces.
					fallbackTrigger = await page.$(MENU);
					assert.equal(
						await fallbackTrigger.evaluate((button) => button.getAttribute("aria-controls")),
						null,
						"the loading trigger does not reference an unmounted panel"
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
				// Later steps tap the loaded trigger, so wait for the swap rather than racing it.
				await page.waitForFunction((trigger) => !trigger.isConnected, {}, fallbackTrigger);
				await fallbackTrigger.dispose();
				await page.waitForFunction(
					() => document.querySelector("[data-site-menu]") === document.activeElement
				);
				assert.equal(await page.$(PANEL), null);
			});

			await t.test(
				"touch open moves focus, locks scrolling and preserves header geometry",
				async () => {
					await setMenuOpen(page, false);
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
				await setMenuOpen(page, true);
				// The modal focus guard returns focus a frame after the key press, so wait for it
				// to settle before the next key. A wrap that never lands in the panel still fails.
				const focusSettlesInPanel = () =>
					page.waitForFunction(
						(selector) => document.querySelector(selector)?.contains(document.activeElement),
						{ timeout: 2000 },
						PANEL
					);
				await Array.from({ length: 12 }).reduce(
					(steps) =>
						steps.then(async () => {
							await page.keyboard.press("Tab");
							await focusSettlesInPanel();
						}),
					Promise.resolve()
				);
				await page.keyboard.down("Shift");
				await page.keyboard.press("Tab");
				await page.keyboard.up("Shift");
				await focusSettlesInPanel();
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
				await setMenuOpen(page, false);
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
				await setMenuOpen(page, false);
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
				await setMenuOpen(page, true);
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
				// The menu link that had focus closed with the menu, so focus falls back to search.
				await page.waitForFunction(
					(selector) => document.activeElement === document.querySelector(selector),
					{ timeout: 2000 },
					SEARCH_TRIGGER
				);
				await page.tap(MENU);
				await page.waitForSelector(PANEL);
			});

			await t.test("the search X closes it; tapping a result opens it", async () => {
				await setMenuOpen(page, false);
				await page.tap(SEARCH_TRIGGER);
				await page.waitForSelector('input[role="combobox"]');
				// The visual baseline skips the portaled panel; the X stays round like the toolbar.
				assert.equal(
					await page.$eval(
						`${SEARCH} button[aria-label="Close search"]`,
						(close) => getComputedStyle(close).borderRadius
					),
					await page.$eval(SEARCH_TRIGGER, (trigger) => getComputedStyle(trigger).borderRadius)
				);
				await page.tap(`${SEARCH} button[aria-label="Close search"]`);
				await page.waitForSelector('input[role="combobox"]', { hidden: true });
				await page.tap(SEARCH_TRIGGER);
				await page.waitForSelector('input[role="combobox"]');
				await page.type('input[role="combobox"]', "Privacy policy");
				await page.tap(`${SEARCH} [role="option"]`);
				await page.waitForFunction(() => location.pathname === "/privacy");
				await page.waitForSelector('input[role="combobox"]', { hidden: true });
			});

			await t.test(
				"desktop resize releases the menu and keeps 44px navigation targets",
				async () => {
					await setMenuOpen(page, true);
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

			await t.test("closing shortcut search returns focus to where it was opened", async () => {
				const origin = 'footer a[href="/privacy"]';
				await page.focus(origin);
				await page.keyboard.down("Control");
				await page.keyboard.press("k");
				await page.keyboard.up("Control");
				await page.waitForFunction(
					() => document.activeElement?.getAttribute("role") === "combobox"
				);
				await page.keyboard.press("Escape");
				await page.waitForSelector('input[role="combobox"]', { hidden: true });
				await page.waitForFunction(
					(selector) => document.activeElement === document.querySelector(selector),
					{ timeout: 2000 },
					origin
				);
				// Focusing the footer scrolled the page; later geometry checks start from the top.
				await page.evaluate(() => window.scrollTo(0, 0));
			});

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
					// Otherwise the reopened wait can match the closing input and type into it.
					await page.waitForSelector('input[role="combobox"]', { hidden: true });
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

			await t.test(
				"clicking a search result opens it; the press leaves focus in the input",
				async () => {
					await page.click(SEARCH_TRIGGER);
					await page.waitForFunction(
						() => document.activeElement?.getAttribute("role") === "combobox"
					);
					await page.type('input[role="combobox"]', "Terms of service");
					const option = await page.waitForSelector(`${SEARCH} [role="option"]`);
					const box = await option.boundingBox();
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down();
					assert.equal(
						await page.evaluate(() => document.activeElement?.getAttribute("role")),
						"combobox"
					);
					await page.mouse.up();
					await page.waitForFunction(() => location.pathname === "/terms");
				}
			);

			// Snapshot before the 200% case rewrites the root size, but assert after it, so a
			// failure here never drops that subtest from the run.
			const loadErrors = [...hydrationErrors];
			const headerShifts = await page.evaluate(() => window.headerShifts);
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
			assert.deepEqual(loadErrors, []);
			assert.deepEqual(
				headerShifts.map((shift) => shift.value),
				[],
				`header layout shift: ${JSON.stringify(headerShifts)}`
			);
		})
	);
});

test("header controls and panels fit real responsive viewports", {
	timeout: 180_000,
}, async (t) => {
	await withProductionServer((url) =>
		withBrowser(t, {}, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(30_000);
			const runtimeErrors = [];
			page.on("pageerror", (error) => runtimeErrors.push(error.message));
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			const client = await page.createCDPSession();
			// Include both sides of viewport and header-container breakpoints.
			const cases = ["light", "dark"].flatMap((theme) =>
				["100%", "200%"].flatMap((textSize) =>
					[320, 390, 639, 640, 679, 680, 768, 1440].map((width) => ({ width, theme, textSize }))
				)
			);
			// Cases share one browser page and must run sequentially.
			await cases.reduce(
				(steps, scenario) =>
					steps.then(() =>
						t.test(`${scenario.width}px, ${scenario.theme}, ${scenario.textSize} text`, () =>
							checkResponsiveHeader(page, client, url, scenario)
						)
					),
				Promise.resolve()
			);
			assert.deepEqual(runtimeErrors, []);
		})
	);
});

const OVERFLOW_TRIGGER = 'button[aria-label="Show hidden breadcrumb levels"]';
const OVERFLOW_MENU = '[data-slot="popover-content"]';

/** Opens the collapsed trail from the keyboard and reads the menu's enter animation. */
async function openOverflowMenu(page) {
	await page.focus(OVERFLOW_TRIGGER);
	await page.keyboard.press("Enter");
	// Read the live node: the lazily loaded menu can replace the first one it renders.
	const motion = await page.waitForFunction(
		(selector) => {
			const element = document.querySelector(selector);
			const style = element?.getClientRects().length ? getComputedStyle(element) : null;
			return style?.animationName
				? {
						name: style.animationName,
						duration: style.animationDuration,
						easing: style.animationTimingFunction,
					}
				: null;
		},
		{},
		OVERFLOW_MENU
	);
	return motion.jsonValue();
}

async function closeOverflowMenu(page) {
	await page.keyboard.press("Escape");
	await page.waitForSelector(OVERFLOW_MENU, { hidden: true });
	await page.waitForFunction(
		(selector) => document.activeElement === document.querySelector(selector),
		{},
		OVERFLOW_TRIGGER
	);
}

async function setDarkTheme(page, dark) {
	if ((await page.evaluate(() => document.documentElement.classList.contains("dark"))) !== dark) {
		await page.click('button[aria-label="Toggle theme"]');
		await page.waitForFunction(
			(expected) => document.documentElement.classList.contains("dark") === expected,
			{},
			dark
		);
	}
}

// tw-animate falls back to 150ms and the CSS `ease` keyword unless the popover
// sets both tokens; the menu once ran at 100ms on that second curve.
test("the breadcrumb overflow menu moves on the site's one curve", {
	timeout: 120_000,
}, async (t) => {
	await withProductionServer((url) =>
		withBrowser(t, {}, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			const runtimeErrors = [];
			page.on("pageerror", (error) => runtimeErrors.push(error.message));
			await page.setViewport({ width: 1280, height: 800 });
			await page.goto(`${url}/blog/scaling-plumbing-business`, { waitUntil: "networkidle0" });
			// The tokens in computed form, e.g. 0.12s on cubic-bezier(0.23, 1, 0.32, 1).
			const tokens = await page.evaluate(() => {
				const probe = document.body.appendChild(document.createElement("div"));
				probe.style.animation = "enter var(--motion-fast) var(--ease-out)";
				const { animationDuration, animationTimingFunction } = getComputedStyle(probe);
				probe.remove();
				return { name: "enter", duration: animationDuration, easing: animationTimingFunction };
			});
			// Themes share one page and must run sequentially. Each case closes the menu
			// before asserting, so one failure cannot leave it open for the next.
			await [false, true].reduce(
				(steps, dark) =>
					steps.then(() =>
						t.test(`${dark ? "dark" : "light"}: --motion-fast on --ease-out`, async () => {
							await setDarkTheme(page, dark);
							const motion = await openOverflowMenu(page);
							await closeOverflowMenu(page);
							assert.deepEqual(motion, tokens);
						})
					),
				Promise.resolve()
			);
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			await t.test("reduced motion collapses the entrance", async () => {
				const motion = await openOverflowMenu(page);
				await closeOverflowMenu(page);
				assert.equal(motion.duration, "1e-05s");
			});
			assert.deepEqual(runtimeErrors, []);
		})
	);
});
