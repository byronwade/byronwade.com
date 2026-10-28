import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { axeVersion, injectAxe, readAxe } from "../../scripts/axe-audit.mjs";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { withResendFixture } from "../fixtures/resend-browser.mjs";

const MENU = "[data-site-menu]";
const PANEL = "[data-header-menu]";
const SEARCH_TRIGGER = 'button[aria-label="Search (⌘K)"]';
const STATUS = 'form p[aria-live="polite"]';
const BLOG_ROUTE = /^\/blog\/[^/]+$/;
const OUTSIDE_PANEL = /^outside: /;
const TOPIC_ROUTE = /^\/blog\/topic\/[^/]+$/;
const HEADING = /<h([1-6])\b/g;
const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const topics = Object.keys(manifest.routes).filter((route) => TOPIC_ROUTE.test(route));
const post = Object.keys(manifest.routes)
	.filter((route) => BLOG_ROUTE.test(route))
	.sort()[0];

test("every built topic page has one h1 followed by h2 post titles", async (context) => {
	assert.ok(topics.length > 0, "a production build must contain writing topics");
	await Promise.all(
		topics.map((route) =>
			context.test(route, () => {
				const html = readFileSync(`.next/server/app${route}.html`, "utf8");
				const levels = [...html.matchAll(HEADING)].map(([, level]) => Number(level));
				assert.equal(levels[0], 1, "the outline starts with the topic's h1");
				assert.equal(levels.filter((level) => level === 1).length, 1, "exactly one h1");
				assert.ok(levels.length > 1, "the topic lists post titles");
				assert.deepEqual(
					levels.slice(1),
					levels.slice(1).map(() => 2),
					"posts follow at h2"
				);
			})
		)
	);
});

/** Fonts loaded and no transition mid-flight: a fading layer reads as low contrast. */
async function settle(page) {
	await page.evaluate(() => document.fonts.ready);
	await page.waitForFunction(() =>
		document
			.getAnimations()
			.every(
				(animation) =>
					animation.effect?.getComputedTiming().iterations === Number.POSITIVE_INFINITY ||
					animation.playState !== "running"
			)
	);
}

async function assertNoViolations(page, state) {
	await settle(page);
	await injectAxe(page);
	const { version, violations } = await page.evaluate(readAxe);
	assert.equal(version, axeVersion, "the page runs Lighthouse's copy of axe");
	assert.deepEqual(violations, [], `${state}: ${JSON.stringify(violations, null, 1)}`);
}

async function openPage(browser, origin, route, { width, theme }) {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.setDefaultTimeout(15_000);
	// Pages share one browser; a cached 304 would hide the route's real status.
	await page.setCacheEnabled(false);
	await page.setViewport({ width, height: 900 });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
	const response = await page.goto(origin + route, { waitUntil: "networkidle0", timeout: 20_000 });
	assert.ok(response.ok(), `${route} answered ${response.status()}`);
	assert.equal(
		await page.evaluate(() => document.documentElement.classList.contains("dark")),
		theme === "dark",
		"the requested theme is applied"
	);
	return { page, errors };
}

async function pressOn(page, selector, key) {
	await page.focus(selector);
	await page.keyboard.press(key);
}

async function assertHeaderReferences(page, state) {
	const missing = await page.$$eval(
		"header [aria-controls], [data-header-search] [aria-controls]",
		(elements, separator) =>
			elements.flatMap((element) =>
				element
					.getAttribute("aria-controls")
					.split(new RegExp(separator))
					.filter((id) => !document.getElementById(id))
					.map((id) => ({ label: element.getAttribute("aria-label"), id }))
			),
		"\\s+"
	);
	assert.deepEqual(missing, [], `${state}: header controls reference mounted elements`);
}

async function assertHeaderDialog(page, trigger, panel, name) {
	assert.equal(
		await page.$eval(trigger, (element) => element.getAttribute("aria-controls")),
		await page.$eval(panel, (element) => element.id),
		"the open trigger controls its own panel"
	);
	// Read the computed accessibility tree: aria-labelledby can override aria-label,
	// and a visible heading alone does not name a dialog.
	const session = await page.createCDPSession();
	try {
		const { nodes } = await session.send("Accessibility.getFullAXTree");
		assert.deepEqual(
			nodes
				.filter((node) => !node.ignored && node.role?.value === "dialog")
				.map((node) => node.name?.value),
			[name],
			"the open header dialog has its expected accessible name"
		);
	} finally {
		await session.detach();
	}
	await assertHeaderReferences(page, `${name} open`);
}

/** Presses Tab (or Shift+Tab) and names the panel stop focus lands on, or "outside: <element>". */
async function tabFrom(page, panel, shift) {
	if (shift) {
		await page.keyboard.down("Shift");
	}
	await page.keyboard.press("Tab");
	if (shift) {
		await page.keyboard.up("Shift");
	}
	// Base UI's focus guards sit outside the panel and pass focus on a moment later.
	const landed = await page.waitForFunction(
		(selector) => {
			const active = document.activeElement;
			if (!active || active === document.body || active.hasAttribute("data-base-ui-focus-guard")) {
				return false;
			}
			return document.querySelector(selector)?.contains(active)
				? `${active.getAttribute("role") ?? active.localName} ${active.getAttribute("aria-label") ?? active.textContent.trim()}`
				: `outside: ${active.outerHTML.slice(0, 120)}`;
		},
		{},
		panel
	);
	return landed.jsonValue();
}

/**
 * An open header panel marks the rest of the page aria-hidden, so axe can only ask for a
 * manual check that nothing behind it is still reachable (aria-hidden-focus). Answer it:
 * Tab and Shift+Tab past the wrap must always land inside the panel.
 */
async function assertFocusContained(page, panel, state) {
	const stops = await page.$eval(
		panel,
		(element) => element.querySelectorAll("a[href], button, input").length
	);
	await ["Tab", "Shift+Tab"]
		.flatMap((key) => Array.from({ length: stops + 2 }, (_, index) => [key, index + 1]))
		.reduce(
			(pending, [key, step]) =>
				pending.then(async () =>
					assert.doesNotMatch(
						await tabFrom(page, panel, key === "Shift+Tab"),
						OUTSIDE_PANEL,
						`${state}: ${key} ${step} stays in the panel`
					)
				),
			Promise.resolve()
		);
}

/**
 * Results are a combobox listbox: arrows move through them while focus stays in the input
 * (APG). So Tab and Shift+Tab only alternate between the input and the visible X, which is
 * also the panel's one Close part.
 */
async function assertSearchTabCycle(page, theme) {
	const cycle = ["button Close search", "combobox Search"];
	await page.focus('input[role="combobox"]');
	await ["Tab", "Shift+Tab"]
		.flatMap((key) => Array.from({ length: 4 }, (_, index) => [key, index]))
		.reduce(
			(pending, [key, index]) =>
				pending.then(async () =>
					assert.equal(
						await tabFrom(page, "[data-header-search]", key === "Shift+Tab"),
						cycle[index % 2],
						`search results ${theme}: ${key} ${index + 1}`
					)
				),
			Promise.resolve()
		);
}

async function checkMenuCycle(page, theme) {
	await pressOn(page, MENU, "Enter");
	await page.waitForSelector(PANEL, { visible: true });
	assert.equal(await page.$eval(MENU, (button) => button.getAttribute("aria-expanded")), "true");
	await assertHeaderDialog(page, MENU, PANEL, "Navigate");
	await assertNoViolations(page, `navigation menu open ${theme}`);
	await assertFocusContained(page, PANEL, `navigation menu ${theme}`);
	await page.keyboard.press("Escape");
	await page.waitForSelector(PANEL, { hidden: true });
	await assertHeaderReferences(page, "menu closed");
}

async function checkSearchCycle(page, theme) {
	await pressOn(page, SEARCH_TRIGGER, "Enter");
	await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
	await assertHeaderDialog(page, SEARCH_TRIGGER, "[data-header-search]", "Search");
	await page.keyboard.type("thorbis");
	await page.waitForSelector('[role="listbox"] [role="option"]', { visible: true });
	await assertHeaderReferences(page, "search results");
	await assertNoViolations(page, `search results open ${theme}`);
	await assertFocusContained(page, "[data-header-search]", `search results ${theme}`);
	await assertSearchTabCycle(page, theme);
	await page.keyboard.down("Control");
	await page.keyboard.press("A");
	await page.keyboard.up("Control");
	await page.keyboard.type("zzzznonexistentzzzz");
	await page.waitForSelector('[role="listbox"]', { hidden: true });
	await assertHeaderReferences(page, "search without results");
	await page.keyboard.press("Escape");
	await page.waitForSelector('input[role="combobox"]', { hidden: true });
	await assertHeaderReferences(page, "search closed");
}

async function checkNavigation(browser, origin, theme, width) {
	const { page, errors } = await openPage(browser, origin, "/", { width, theme });
	try {
		await page.waitForFunction(
			(selector) => document.querySelector(selector)?.getAttribute("aria-expanded") === "false",
			{},
			MENU
		);
		await page.keyboard.press("Tab");
		assert.equal(
			await page.evaluate(() => document.activeElement?.getAttribute("href")),
			"#main-content",
			"the first Tab reaches the skip link"
		);
		await assertHeaderReferences(page, "initial closed header");
		await assertNoViolations(page, `home ${theme}`);

		// Desktop offers inline navigation; only phones expose the menu trigger.
		if (width < 640) {
			await checkMenuCycle(page, theme);
			await checkMenuCycle(page, theme);
		}

		await checkSearchCycle(page, theme);
		await checkSearchCycle(page, theme);
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

async function checkWriting(browser, origin, route, theme, width) {
	const { page, errors } = await openPage(browser, origin, route, { width, theme });
	try {
		const outline = await page.evaluate(() => ({
			h1: document.querySelectorAll("h1").length,
			levels: [...document.querySelectorAll("main :is(h1, h2, h3, h4, h5, h6)")].map((heading) =>
				Number(heading.tagName[1])
			),
		}));
		assert.equal(outline.h1, 1, "a writing page has exactly one h1");
		assert.equal(outline.levels[0], 1, "the writing outline starts at its h1");
		const skipped = outline.levels.filter(
			(level, index) => level > (outline.levels[index - 1] ?? 0) + 1
		);
		assert.deepEqual(skipped, [], `heading levels are not skipped: ${outline.levels.join(" ")}`);
		await assertNoViolations(page, `${route} ${theme}`);
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

async function checkContact(browser, origin, theme, width) {
	const { page, errors } = await openPage(browser, origin, "/contact", { width, theme });
	try {
		await page.waitForSelector('form input[name="name"]', { visible: true });
		// axe accepts a placeholder as a name, and every field here has one.
		assert.deepEqual(
			await page.$$eval('form :is(input:not([type="hidden"]), select, textarea)', (controls) =>
				controls.filter((control) => !control.labels?.length).map((control) => control.name)
			),
			[],
			"every contact field keeps a visible label"
		);
		await pressOn(page, 'button[type="submit"]', "Enter");
		await page.waitForSelector("#name-error", { visible: true });
		assert.deepEqual(
			await page.evaluate(() => ({
				focused: document.activeElement?.getAttribute("name"),
				invalid: document.activeElement?.getAttribute("aria-invalid"),
				describedBy: document.activeElement?.getAttribute("aria-describedby"),
			})),
			{ focused: "name", invalid: "true", describedBy: "name-error" },
			"an empty send focuses the first field and names its error"
		);
		await assertNoViolations(page, `contact validation ${theme}`);

		await page.type('input[name="name"]', "Test Visitor");
		await page.type('input[name="email"]', "visitor@example.com");
		await page.type('textarea[name="message"]', "Accessibility regression check.");
		await pressOn(page, 'button[type="submit"]', "Enter");
		await page.waitForFunction(
			(selector) => document.querySelector(selector)?.textContent.includes("Sent."),
			{},
			STATUS
		);
		await assertNoViolations(page, `contact sent ${theme}`);
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

test("navigation, a post and the contact form have no WCAG A/AA axe violations", {
	timeout: 180_000,
}, async (context) => {
	assert.ok(post, "a production build must contain a published post");
	context.diagnostic(`axe-core ${axeVersion}; post ${post}`);
	await withResendFixture((env) =>
		withProductionServer(
			(origin) =>
				withBrowser(context, { timeout: 30_000 }, (browser) =>
					// One page at a time on the shared server and browser.
					[
						["light", 1280],
						["dark", 390],
					]
						.flatMap(([theme, width]) => [
							[`navigation, ${theme} 390`, () => checkNavigation(browser, origin, theme, 390)],
							[`navigation, ${theme} 1280`, () => checkNavigation(browser, origin, theme, 1280)],
							[
								`reading a post, ${theme} ${width}`,
								() => checkWriting(browser, origin, post, theme, width),
							],
							[
								`submitting the contact form, ${theme} ${width}`,
								() => checkContact(browser, origin, theme, width),
							],
						])
						.reduce(
							(pending, [name, check]) => pending.then(() => context.test(name, check)),
							Promise.resolve()
						)
				),
			{ env }
		)
	);
});

test("writing topics have ordered headings and no WCAG A/AA axe violations in both themes", {
	timeout: 180_000,
}, async (context) => {
	assert.ok(topics.length > 0, "a production build must contain writing topics");
	await withProductionServer((origin) =>
		withBrowser(context, { timeout: 30_000 }, (browser) =>
			[
				["light", 1280],
				["dark", 390],
			]
				.flatMap(([theme, width]) => topics.map((route) => ({ route, theme, width })))
				.reduce(
					(pending, { route, theme, width }) =>
						pending.then(() =>
							context.test(`${route} ${theme} ${width}`, () =>
								checkWriting(browser, origin, route, theme, width)
							)
						),
					Promise.resolve()
				)
		)
	);
});
