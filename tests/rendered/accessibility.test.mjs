import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { readAxe } from "../../scripts/axe-audit.mjs";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { withResendFixture } from "../fixtures/resend-browser.mjs";

// Lighthouse already ships axe for its own accessibility audit. Resolving it from
// there keeps this sensor on the version Lighthouse runs, with no new package.
const fromLighthouse = createRequire(import.meta.resolve("lighthouse"));
const axeSource = readFileSync(fromLighthouse.resolve("axe-core/axe.min.js"), "utf8");
const axeVersion = fromLighthouse("axe-core/package.json").version;

const MENU = "[data-site-menu]";
const PANEL = "[data-header-menu]";
const SEARCH_TRIGGER = 'button[aria-label="Search (⌘K)"]';
const STATUS = 'form p[aria-live="polite"]';
const BLOG_ROUTE = /^\/blog\/[^/]+$/;
const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const post = Object.keys(manifest.routes)
	.filter((route) => BLOG_ROUTE.test(route))
	.sort()[0];

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
	if (!(await page.evaluate(() => Boolean(window.axe)))) {
		await page.addScriptTag({ content: axeSource });
	}
	const violations = await page.evaluate(readAxe);
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

// Phone width, where navigation is the menu panel rather than inline links.
async function checkNavigation(browser, origin, theme) {
	const { page, errors } = await openPage(browser, origin, "/", { width: 390, theme });
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
		await assertNoViolations(page, `home ${theme}`);

		await pressOn(page, MENU, "Enter");
		await page.waitForSelector(PANEL, { visible: true });
		assert.equal(await page.$eval(MENU, (button) => button.getAttribute("aria-expanded")), "true");
		await assertNoViolations(page, `navigation menu open ${theme}`);
		await page.keyboard.press("Escape");
		await page.waitForSelector(PANEL, { hidden: true });

		await pressOn(page, SEARCH_TRIGGER, "Enter");
		await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
		await page.keyboard.type("thorbis");
		await page.waitForSelector('[role="listbox"] [role="option"]', { visible: true });
		await assertNoViolations(page, `search results open ${theme}`);
		await page.keyboard.press("Escape");
		await page.waitForSelector('input[role="combobox"]', { hidden: true });
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

async function checkPost(browser, origin, theme, width) {
	const { page, errors } = await openPage(browser, origin, post, { width, theme });
	try {
		const outline = await page.evaluate(() => ({
			h1: document.querySelectorAll("h1").length,
			levels: [...document.querySelectorAll("main :is(h1, h2, h3, h4, h5, h6)")].map((heading) =>
				Number(heading.tagName[1])
			),
		}));
		assert.equal(outline.h1, 1, "a post has exactly one h1");
		assert.equal(outline.levels[0], 1, "the post outline starts at its h1");
		const skipped = outline.levels.filter(
			(level, index) => level > (outline.levels[index - 1] ?? 0) + 1
		);
		assert.deepEqual(skipped, [], `heading levels are not skipped: ${outline.levels.join(" ")}`);
		await assertNoViolations(page, `${post} ${theme}`);
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
							[`navigation, ${theme}`, () => checkNavigation(browser, origin, theme)],
							[`reading a post, ${theme} ${width}`, () => checkPost(browser, origin, theme, width)],
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
