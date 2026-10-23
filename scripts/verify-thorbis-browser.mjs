import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";
import { withBrowser } from "../tests/fixtures/browser.mjs";
import { readGeometry } from "./audit-geometry.mjs";
import { axeVersion, injectAxe, readAxe } from "./axe-audit.mjs";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { withProductionServer } from "./production-session.mjs";
import { assertThorbisHome, readThorbisHome } from "./thorbis-home-contract.mjs";

const destination = process.env.THORBIS_EVIDENCE_DIR || "docs/evidence/thorbis";
mkdirSync(destination, { recursive: true });
let browser;
const report = {
	status: "running",
	checkedAt: new Date().toISOString(),
	head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", windowsHide: true }).trim(),
	buildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
	harnessHash: createHash("sha256")
		.update(readFileSync(import.meta.filename))
		.update(readFileSync("scripts/thorbis-home-contract.mjs"))
		.update(readFileSync("scripts/audit-geometry.mjs"))
		.update(readFileSync("scripts/axe-audit.mjs"))
		.update(readFileSync("scripts/production-session.mjs"))
		.update(readFileSync("scripts/evidence-json.mjs"))
		.update(readFileSync("tests/fixtures/browser.mjs"))
		.digest("hex"),
	source: "46b6654d02fda9d8fde737395185c3141df52cd2",
	axe: axeVersion,
	cases: [],
	keyboard: [],
	noJavaScript: [],
	routes: [],
	panels: [],
	interactions: {},
	pageErrors: [],
	referenceErrors: [],
};

const SEARCH_TRIGGER = 'button[aria-label="Search (⌘K)"]';
const MENU_TRIGGER = "[data-site-menu]";

// Browser cases stay serial so viewport/focus state and machine load stay isolated.
function serial(items, visit) {
	return items.reduce((previous, item) => previous.then(() => visit(item)), Promise.resolve());
}

// Panels load on first open and return focus a frame after closing; wait, bounded, for it to settle.
function focusSettlesOn(page, selector) {
	return page.waitForFunction(
		(value) => document.activeElement === document.querySelector(value),
		{ timeout: 2000 },
		selector
	);
}

async function openPage(errors = report.pageErrors) {
	const page = await browser.newPage();
	page.setDefaultTimeout(10_000);
	page.setDefaultNavigationTimeout(20_000);
	page.on("pageerror", (error) => errors.push(error.message));
	return page;
}

function readElementVisibility(element) {
	let current = element;
	let visible = true;
	while (current) {
		const style = getComputedStyle(current);
		if (style.opacity === "0" || style.visibility === "hidden" || style.display === "none") {
			visible = false;
			break;
		}
		current = current.parentElement;
	}
	const rect = element.getBoundingClientRect();
	return { visible: visible && rect.height > 0, top: rect.top };
}

function assertTargets(geometry, width) {
	assert.deepEqual(geometry.targetFailures, [], `interactive targets at ${width}px`);
}

function readContrast() {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	const luminance = (rgb) => {
		const values = rgb.slice(0, 3).map((value) => {
			const c = value / 255;
			return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
	};
	const results = [];
	for (const element of document.querySelectorAll("header *, main *, footer *")) {
		const field = element.matches("input:not(:disabled), textarea:not(:disabled)");
		if (
			!element.getClientRects().length ||
			element.closest("[inert], .sr-only") ||
			!(
				field ||
				[...element.childNodes].some(
					(node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
				)
			)
		) {
			continue;
		}
		const parents = [];
		let parent = element;
		while (parent) {
			parents.unshift(parent);
			parent = parent.parentElement;
		}
		context.clearRect(0, 0, 1, 1);
		for (const ancestor of parents) {
			context.fillStyle = getComputedStyle(ancestor).backgroundColor;
			context.fillRect(0, 0, 1, 1);
		}
		const background = luminance([...context.getImageData(0, 0, 1, 1).data]);
		const style = getComputedStyle(element);
		context.fillStyle = field ? style.borderTopColor : style.color;
		context.fillRect(0, 0, 1, 1);
		const foreground = luminance([...context.getImageData(0, 0, 1, 1).data]);
		const ratio =
			(Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
		const large =
			Number.parseFloat(style.fontSize) >= 24 ||
			(Number.parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
		results.push({
			text: field
				? `Field: ${element.getAttribute("name") || element.getAttribute("aria-label")}`
				: element.textContent.trim().slice(0, 55),
			ratio: Math.round(ratio * 100) / 100,
			required: field || large ? 3 : 4.5,
		});
	}
	return results;
}

async function auditCase(url, width, theme) {
	const page = await openPage();
	await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
	await page.goto(url, { waitUntil: "networkidle2" });
	// Exercise the real control in both directions, including the non-reduced path.
	await serial([theme !== "dark", theme === "dark"], async (expected) => {
		await page.click('button[aria-label="Toggle theme"]');
		await page.waitForFunction(
			(dark) => document.documentElement.classList.contains("dark") === dark,
			{},
			expected
		);
		await page.evaluate(async () => {
			await Promise.all(document.getAnimations().map((animation) => animation.finished));
		});
	});
	await page.evaluate(() => document.fonts.ready);
	await injectAxe(page);
	const { version, violations: axe } = await page.evaluate(readAxe);
	assert.equal(version, axeVersion, "the page runs Lighthouse's copy of axe");
	const geometry = await readThorbisHome(page);
	const contrast = await page.evaluate(readContrast);
	const targets = await readGeometry(page);
	const file = `home-${width}-${theme}.png`;
	await page.screenshot({ path: `${destination}/${file}`, fullPage: true });
	report.cases.push({
		width,
		theme,
		themeToggleRoundTrip: true,
		axe,
		geometry,
		contrast,
		targets,
		file,
	});
	assertTargets(targets, width);
	console.log(`Audited ${width}px ${theme}`);
	assertThorbisHome(geometry);
	assert.ok(
		contrast.every(({ ratio, required }) => ratio >= required),
		JSON.stringify(contrast.filter(({ ratio, required }) => ratio < required))
	);
	assert.equal(
		axe.filter(({ impact }) => impact === "serious" || impact === "critical").length,
		0,
		JSON.stringify(axe)
	);
	return page;
}

async function compareReference(page, width, theme) {
	const reference = await openPage(report.referenceErrors);
	await reference.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	const response = await reference.goto("https://design.thorbis.com", {
		waitUntil: "networkidle2",
	});
	assert.equal(response.status(), 200, "live Thorbis reference loads successfully");
	await reference.evaluate((value) => {
		document.documentElement.dataset.theme = value;
		document.documentElement.dataset.resolved = value;
	}, theme);
	await reference.evaluate(() => document.fonts.ready);
	const tokenNames = [
		"accent",
		"bg",
		"fg",
		"body",
		"marker",
		"panel",
		"field",
		"on-panel",
		"success",
		"warning",
		"danger",
		"info",
	];
	const readTokens = (names, prefix) =>
		Object.fromEntries(
			names.map((name) => {
				const swatch = document.createElement("span");
				swatch.style.color = `var(--${prefix}${name})`;
				document.body.append(swatch);
				const value = getComputedStyle(swatch).color;
				swatch.remove();
				return [name, value];
			})
		);
	const local = await page.evaluate(readTokens, tokenNames, "thorbis-");
	const upstream = await reference.evaluate(readTokens, tokenNames, "color-");
	// The port is pinned; this live page can advance independently. Preserve drift
	// as sync evidence without turning an upstream change into a local failure.
	const drift = tokenNames.filter((name) => local[name] !== upstream[name]);
	report.cases.at(-1).tokens = {
		url: reference.url(),
		checkedAt: new Date().toISOString(),
		informational: true,
		comparison: "computed CSS text; differences do not establish a visible color change",
		local,
		upstream,
		drift,
	};
	const localImage = await page.screenshot();
	const sourceImage = await reference.screenshot({
		path: `${destination}/thorbis-${width}-${theme}.png`,
	});
	await sharp({
		create: {
			width: width * 2,
			height: 1000,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite([
			{ input: localImage, left: 0, top: 0 },
			{ input: sourceImage, left: width, top: 0 },
		])
		.png()
		.toFile(`${destination}/comparison-${width}-${theme}.png`);
	await reference.close();
}

async function checkKeyboard(page, width) {
	await page.goto(page.url(), { waitUntil: "networkidle2" });
	const steps = [];
	await serial(Array.from({ length: 14 }), async () => {
		await page.keyboard.press("Tab");
		await page.evaluate(() => new Promise(requestAnimationFrame));
		steps.push(
			await page.evaluate(() => {
				const element = document.activeElement;
				const style = getComputedStyle(element);
				const rect = element.getBoundingClientRect();
				const header = document.querySelector("body header");
				return {
					label:
						element.getAttribute("aria-label") ||
						element.getAttribute("title") ||
						element.textContent.trim().slice(0, 70),
					outline: style.outlineStyle,
					outlineWidth: style.outlineWidth,
					shadow: style.boxShadow,
					inViewport: rect.top >= 0 && rect.bottom <= innerHeight,
					inert: Boolean(element.closest("[inert]")),
					obscuredByHeader:
						!(header.contains(element) || element.classList.contains("skip-link")) &&
						rect.top < header.getBoundingClientRect().bottom,
				};
			})
		);
	});
	assert.ok(
		steps.every(
			(step) =>
				!(step.inert || step.obscuredByHeader) &&
				step.inViewport &&
				((step.outline !== "none" && step.outlineWidth !== "0px") || step.shadow !== "none")
		),
		JSON.stringify(steps)
	);
	const { navigation } = await readThorbisHome(page);
	if (navigation.primaryVisible) {
		await page.focus('nav[aria-label="Primary"] a[href="/projects"]');
	} else {
		await page.focus(MENU_TRIGGER);
		await page.keyboard.press("Enter");
		await page.waitForSelector("[data-header-menu]", { visible: true });
		await page.focus('[data-header-menu] a[href="/projects"]');
	}
	await page.screenshot({ path: `${destination}/focus-${width}-light.png` });
	if (!navigation.primaryVisible) {
		await page.keyboard.press("Escape");
		await focusSettlesOn(page, MENU_TRIGGER);
	}
	await page.click(SEARCH_TRIGGER);
	await page.waitForFunction(() => document.activeElement.getAttribute("aria-label") === "Search");
	await page.keyboard.press("Escape");
	await focusSettlesOn(page, SEARCH_TRIGGER);
	report.keyboard.push({ width, steps, searchFocusReturn: true });
}

async function checkShellStates(page, width, theme) {
	await injectAxe(page);
	// The #80 header has two panels: search at every width, and the navigation menu that
	// replaces the inline primary links below the 40rem header container.
	const panels = [{ trigger: SEARCH_TRIGGER, label: "Search" }];
	if ((await readThorbisHome(page)).navigation.menuVisible) {
		assert.ok(
			await page.$eval(MENU_TRIGGER, (button) => getComputedStyle(button).display !== "none"),
			`navigation menu is offered at ${width}`
		);
		panels.push({ trigger: MENU_TRIGGER, label: "Navigate" });
	}
	await serial(panels, async ({ trigger, label }) => {
		await page.click(trigger);
		const selector = `[role="dialog"][aria-label="${label}"]`;
		await page.waitForFunction(
			(value) => {
				const panel = document.querySelector(value);
				return panel && getComputedStyle(panel).opacity === "1";
			},
			{},
			selector
		);
		if (label === "Search") {
			await page.waitForFunction(
				() => document.activeElement.getAttribute("aria-label") === "Search"
			);
		}
		// Every rule, not only readAxe's WCAG set: dialog naming (aria-dialog-name)
		// is tagged best practice, and these panels are dialogs.
		const violations = await page.evaluate(async () =>
			(await window.axe.run()).violations.map(({ id, impact }) => ({ id, impact }))
		);
		const contrast = await page.evaluate(readContrast);
		const targets = await readGeometry(page);
		assertTargets(targets, width);
		if (label === "Navigate") {
			const size = await page.$eval(
				'[data-header-menu] a[href="/projects"] span.font-medium',
				(element) => getComputedStyle(element).fontSize
			);
			assert.equal(size, "13px", "Thorbis visible mobile navigation role");
		}
		const bounds = await page.$eval(selector, (element) => {
			const rect = element.getBoundingClientRect();
			return { left: rect.left, right: rect.right, viewport: innerWidth };
		});
		report.panels.push({ width, theme, label, bounds, violations, contrast, targets });
		assert.ok(bounds.left >= 0 && bounds.right <= bounds.viewport, `${label} fits ${width}`);
		assert.equal(
			violations.filter(({ impact }) => impact === "serious" || impact === "critical").length,
			0,
			JSON.stringify(violations)
		);
		assert.ok(
			contrast.every(({ ratio, required }) => ratio >= required),
			JSON.stringify(contrast.filter(({ ratio, required }) => ratio < required))
		);
		if (width === 768 && theme === "light") {
			await page.screenshot({
				path: `${destination}/panel-${label.replaceAll(" ", "-").toLowerCase()}-768.png`,
			});
		}
		if (label === "Search") {
			await page.type('input[aria-label="Search"]', "zzzz-no-matching-entry");
			await page.waitForSelector('[role="dialog"]');
			assert.ok(
				await page.$eval(selector, (element) => element.textContent.includes("No results"))
			);
		}
		await page.keyboard.press("Escape");
		await page.waitForSelector(selector, { hidden: true });
		await focusSettlesOn(page, trigger);
	});
}

async function checkInteractions(url) {
	const page = await openPage();
	await page.setViewport({ width: 390, height: 1000 });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await page.goto(url, { waitUntil: "networkidle2" });
	await page.click('main button[data-slot="button"]');
	const name = 'section[aria-label="Contact"] input[name="name"]';
	await page.waitForSelector(name);
	await page.type(name, "Browser verification draft");
	await page.click('section[aria-label="Contact"] button[aria-label="Close"]');
	await page.click('main button[data-slot="button"]');
	assert.equal(await page.$eval(name, (element) => element.value), "Browser verification draft");
	await page.click('section[aria-label="Contact"] button[type="submit"]');
	await page.waitForFunction(() => document.activeElement.getAttribute("name") === "email");
	const contactContrast = await page.evaluate(readContrast);
	const contactTargets = await readGeometry(page);
	assertTargets(contactTargets, 390);
	assert.ok(
		contactContrast.every(({ ratio, required }) => ratio >= required),
		JSON.stringify(contactContrast.filter(({ ratio, required }) => ratio < required))
	);
	await page.screenshot({ path: `${destination}/contact-error-390.png`, fullPage: true });
	await page.click("footer button");
	assert.ok(await page.$('footer a[href^="mailto:"]'));
	await page.focus('footer a[href="/privacy"]');
	await page.keyboard.down("Control");
	await page.keyboard.press("k");
	await page.keyboard.up("Control");
	await page.waitForFunction(() => document.activeElement.getAttribute("aria-label") === "Search");
	const shortcut = await page.$eval('input[aria-label="Search"]', (element) => {
		const rect = element.getBoundingClientRect();
		return {
			visible: rect.top >= 0 && rect.bottom <= innerHeight,
			reducedTransition: getComputedStyle(element.closest('[role="dialog"]').parentElement)
				.transitionDuration,
		};
	});
	assert.ok(shortcut.visible, "global search stays visible from the footer");
	assert.ok(Number.parseFloat(shortcut.reducedTransition) <= 0.000_01, "reduced motion snaps");
	await page.keyboard.press("Escape");
	await focusSettlesOn(page, 'footer a[href="/privacy"]');
	const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
	await page.click('button[aria-label="Toggle theme"]');
	await page.waitForFunction(
		(value) => document.documentElement.classList.contains("dark") !== value,
		{},
		before
	);
	report.interactions = {
		contactDraftPreserved: true,
		invalidEmailFocused: true,
		footerReveal: true,
		reducedMotionThemeToggle: true,
		globalShortcutFromFooter: shortcut,
	};
	await page.close();
}

async function checkSearchInterruption(page) {
	// The current header has no entrance animation; its retired capsule's duration
	// override cannot slow this panel. Inspect actual styles and exercise interruption.
	await page.click(SEARCH_TRIGGER);
	await page.waitForSelector("[data-header-search]", { visible: true });
	const styles = await page.$eval("[data-header-search]", (panel) => {
		const computed = getComputedStyle(panel);
		return {
			transitionDuration: computed.transitionDuration,
			animationDuration: computed.animationDuration,
		};
	});
	await page.screenshot({ path: `${destination}/search-open-768.png` });
	await page.keyboard.press("Escape");
	await focusSettlesOn(page, SEARCH_TRIGGER);
	await page.screenshot({ path: `${destination}/search-closed-768.png` });
	// Interrupt an open immediately; focus must still return to the trigger.
	await page.click(SEARCH_TRIGGER);
	await page.keyboard.press("Escape");
	await focusSettlesOn(page, SEARCH_TRIGGER);
	report.searchInterruption = { styles, interruptedOpenClose: true, focusReturned: true };
}

try {
	await withBrowser(
		{ diagnostic: console.log },
		{ timeout: 20_000, protocolTimeout: 20_000 },
		async (ownedBrowser) => {
			browser = ownedBrowser;
			report.chrome = await browser.version();
			await verify();
		}
	);
	report.status = "passed";
} catch (error) {
	report.status = "failed";
	report.failure = error.message;
	throw error;
} finally {
	// A completed matrix is not a pass until owned browser/server cleanup succeeds.
	writeEvidenceJson(`${destination}/browser.json`, report);
}

async function verify() {
	await withProductionServer(async (url) => {
		await serial(
			[1440, 390, 768, 320].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			),
			async ({ width, theme }) => {
				const page = await auditCase(url, width, theme);
				if (width === 1440 || width === 390) {
					await compareReference(page, width, theme);
				}
				if (theme === "light") {
					await checkKeyboard(page, width);
				}
				await checkShellStates(page, width, theme);
				if (width === 768 && theme === "light") {
					await checkSearchInterruption(page);
				}
				await page.close();
			}
		);
		await serial([1440, 390], async (width) => {
			const page = await openPage();
			await page.setViewport({ width, height: 1000 });
			await page.setJavaScriptEnabled(false);
			await page.goto(url, { waitUntil: "networkidle2" });
			const heading = await page.$eval("h1", readElementVisibility);
			const visible = heading.visible && heading.top < 350;
			assert.ok(visible, "no-JS content must be visible at first paint");
			// Below the 40rem header container the #80 header replaces its inline links with a
			// menu that needs JavaScript, so the footer's full navigation is the no-JS route there.
			const navigationSelector =
				width < 640 ? 'nav[aria-label="Footer"]' : 'nav[aria-label="Primary"]';
			const navigation = await page.$eval(navigationSelector, readElementVisibility);
			const navigationVisible = navigation.visible;
			assert.ok(
				navigationVisible,
				"no-JS navigation must remain visible across hydration boundaries"
			);
			const sections = await page.$eval(navigationSelector, (element) =>
				[...element.querySelectorAll("a[href]")].map((link) => link.getAttribute("href"))
			);
			for (const href of ["/", "/projects", "/portfolio", "/blog", "/resume"]) {
				assert.ok(sections.includes(href), `no-JS navigation reaches ${href} at ${width}`);
			}
			await page.screenshot({ path: `${destination}/home-${width}-no-js.png` });
			report.noJavaScript.push({
				width,
				visible,
				navigation: navigationSelector,
				navigationVisible,
			});
			await page.close();
		});
		await checkInteractions(url);
		await serial(
			[
				"/projects",
				"/projects/byronwade-ui",
				"/portfolio",
				"/blog",
				"/blog/building-thorbis",
				"/resume",
				"/contact",
				"/privacy",
				"/terms",
			],
			async (path) => {
				const page = await openPage();
				const response = await page.goto(`${url}${path}`, { waitUntil: "networkidle2" });
				assert.equal(response.status(), 200);
				if (path === "/resume") {
					const signature = await page.$eval(".font-signature", (element) => ({
						family: getComputedStyle(element).fontFamily,
						loaded: document.fonts.check('400 48px "Byron Signature"'),
					}));
					assert.ok(signature.family.includes("Byron Signature") && signature.loaded);
					report.signature = signature;
				}
				report.routes.push({
					path,
					status: response.status(),
					h1: await page.$eval("h1", (element) => element.textContent),
				});
				await page.close();
			}
		);
	});
	assert.deepEqual(report.pageErrors, [], "local routes raise no page exceptions");
}
