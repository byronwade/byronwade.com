import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import lighthouse, { snapshot } from "lighthouse";
import puppeteer from "puppeteer-core";
import { withFigmaFixture } from "../tests/fixtures/figma-browser.mjs";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { assessBudget } from "./lighthouse-budget.mjs";
import { withProductionServer } from "./production-session.mjs";

// Extend the design-port audit to every public page template. Keep browser work
// serial: concurrent Lighthouse runs would measure our own resource contention.
const destination = "docs/evidence/a11y-perf";
const phase = process.argv.includes("--baseline") ? "baseline" : "final";
const measure = process.argv.includes("--lighthouse");
const selectedRoute = process.argv.find((arg) => arg.startsWith("--route="))?.slice(8);
const reportFile = `${destination}/${phase}${selectedRoute ? `-${selectedRoute.replaceAll("/", "_")}` : ""}${measure ? "-lighthouse" : ""}.json`;
const budgets = JSON.parse(readFileSync("lighthouse-budget.json", "utf8"));
const PAGE_SUFFIX = /\/?page\.tsx$/;
const representatives = {
	"/projects/[slug]": ["/projects/byronwade-ui"],
	"/blog/[slug]": ["/blog/building-thorbis"],
	"/portfolio/[...slug]": [
		"/portfolio/thorbis",
		"/portfolio/thorbis-ai",
		"/portfolio/thorbis-mobile",
	],
	"/portfolio/figma/[key]": [
		"/portfolio/figma/audit-fixture",
		"/portfolio/figma/audit-unavailable",
	],
};
const routeCoverage = readdirSync("app", { recursive: true })
	.filter((path) => path === "page.tsx" || path.endsWith("page.tsx"))
	.map((path) => {
		const template = `/${path.replaceAll("\\", "/").replace(PAGE_SUFFIX, "")}`;
		if (template.includes("[") && !representatives[template]) {
			throw new Error(`Add a representative for the new dynamic route ${template}`);
		}
		return { template, routes: representatives[template] || [template] };
	});
const routes = [...routeCoverage.flatMap((entry) => entry.routes), "/audit-not-found"];
if (selectedRoute && !routes.includes(selectedRoute)) {
	throw new Error(`Unknown audit route ${selectedRoute}`);
}
mkdirSync(destination, { recursive: true });
const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js");
if (!response.ok) {
	throw new Error("axe must load; a missing audit cannot pass");
}
const axeSource = await response.text();
const report = {
	checkedAt: new Date().toISOString(),
	commit: execFileSync("git", ["rev-parse", "HEAD"], {
		encoding: "utf8",
		windowsHide: true,
	}).trim(),
	phase,
	harnessHash: createHash("sha256")
		.update(readFileSync(import.meta.filename))
		.update(readFileSync("scripts/lighthouse-budget.mjs"))
		.update(readFileSync("scripts/production-session.mjs"))
		.update(readFileSync("tests/fixtures/figma-browser.mjs"))
		.update(readFileSync("tests/fixtures/figma-browser-preload.mjs"))
		.update(readFileSync("lighthouse-budget.json"))
		.digest("hex"),
	figma: "Local API and embed fixtures; live provider integration is outside this audit",
	buildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
	chrome: "",
	axe: "4.10.3",
	routeCoverage,
	expectedCases: (selectedRoute ? 1 : routes.length) * 6,
	cases: [],
};
if (process.argv.includes("--resume")) {
	const previous = JSON.parse(readFileSync(reportFile, "utf8"));
	if (
		previous.commit !== report.commit ||
		previous.harnessHash !== report.harnessHash ||
		(previous.buildId && previous.buildId !== report.buildId)
	) {
		throw new Error("Cannot resume evidence from another commit or production build");
	}
	report.cases = previous.cases;
	report.resumedAt = report.checkedAt;
	report.checkedAt = previous.checkedAt;
}
const browser = await puppeteer.launch({
	executablePath:
		process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
	headless: true,
});

function readGeometry() {
	const visible = (element) =>
		element.getClientRects().length &&
		!element.closest('[inert], [aria-hidden="true"], .sr-only') &&
		!element.matches(":disabled, .skip-link") &&
		getComputedStyle(element).visibility === "visible";
	const label = (element) =>
		element.getAttribute("aria-label") ||
		element.getAttribute("name") ||
		(element.querySelector("[data-resume-email]")
			? "Copy email"
			: element.textContent.trim().slice(0, 70));
	const targets = [
		...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex='0']"),
	]
		.filter(visible)
		.map((element) => {
			const rect = element.getBoundingClientRect();
			return {
				label: label(element),
				tag: element.tagName,
				width: rect.width,
				height: rect.height,
			};
		});
	const nav = document.querySelector('nav[aria-label="Primary"]');
	const navBounds = nav.getBoundingClientRect();
	const overlaps = [
		...document.querySelectorAll(
			'header button, header a[href], header nav[aria-label="Breadcrumb"]'
		),
	]
		.filter(visible)
		.filter((element) => !nav.contains(element))
		.filter((element) => {
			const rect = element.getBoundingClientRect();
			return (
				rect.left < navBounds.right &&
				rect.right > navBounds.left &&
				rect.top < navBounds.bottom &&
				rect.bottom > navBounds.top
			);
		});
	return {
		actualTheme: document.documentElement.classList.contains("dark") ? "dark" : "light",
		overflow: document.documentElement.scrollWidth > innerWidth,
		h1Count: document.querySelectorAll("h1").length,
		navOverlap: overlaps.map(label),
		targetFailures: targets.filter(
			({ width, height }) =>
				width < (innerWidth < 640 ? 44 : 24) - 0.1 || height < (innerWidth < 640 ? 44 : 24) - 0.1
		),
	};
}

async function auditPage(url, route, width, theme) {
	const context = await browser.createBrowserContext();
	const page = await context.newPage();
	const runtimeErrors = [];
	page.on("pageerror", (error) => runtimeErrors.push(error.message));
	await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
	await page.evaluateOnNewDocument((value) => {
		// Lighthouse also visits an opaque about:blank document while resetting.
		if (window.top === window && location.origin !== "null") {
			localStorage.setItem("theme", value);
		}
	}, theme);
	await prepareFigmaFrame(page, route, runtimeErrors);
	try {
		const navigation = await page.goto(`${url}${route}`, {
			waitUntil: "networkidle2",
			timeout: 60_000,
		});
		const expectedStatus =
			route === "/audit-not-found" || route === "/portfolio/figma/audit-unavailable" ? 404 : 200;
		if (navigation.status() !== expectedStatus) {
			throw new Error(`${route} returned HTTP ${navigation.status()}, expected ${expectedStatus}`);
		}
		await page.evaluate(() => document.fonts.ready);
		await page.addScriptTag({ content: axeSource });
		const violations = await page.evaluate(readAxe);
		const geometry = await page.evaluate(readGeometry);
		const result = {
			route,
			width,
			theme,
			status: navigation.status(),
			expectedStatus,
			runtimeErrors,
			violations,
			...geometry,
		};
		if (
			phase === "final" &&
			((width === 1280 && theme === "light") || (width === 375 && theme === "dark"))
		) {
			result.screenshot = `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}-${theme}.png`;
			await page.screenshot({ path: `${destination}/${result.screenshot}`, fullPage: true });
		}
		if (phase === "final") {
			result.keyboard = await checkKeyboard(page);
			result.states = await checkRouteStates(page, route, width);
			result.states.push(await checkReducedStyles(page));
		}
		if (measure) {
			result.lighthouse =
				navigation.status() === 200
					? await measurePage(url, route, width, page)
					: await measureErrorPage(page);
		}
		return result;
	} finally {
		await context.close();
	}
}

async function prepareFigmaFrame(page, route, runtimeErrors) {
	if (route !== "/portfolio/figma/audit-fixture") {
		return;
	}
	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (request.url().startsWith("https://www.figma.com/embed?")) {
			return request
				.respond({
					status: 200,
					contentType: "text/html",
					body: '<!doctype html><html lang="en"><title>Design fixture</title><body><main>Local design embed fixture</main></body></html>',
				})
				.catch((error) => runtimeErrors.push(`Embed interception: ${error.message}`));
		}
		return request
			.continue()
			.catch((error) => runtimeErrors.push(`Embed interception: ${error.message}`));
	});
}

async function checkRouteStates(page, route, width) {
	if (route === "/") {
		return await checkShellStates(page);
	}
	if (route === "/projects/byronwade-ui") {
		return await checkPreviewStates(page, width);
	}
	if (route === "/contact") {
		return await checkContactStates(page);
	}
	if (route === "/portfolio/figma/audit-fixture") {
		await page.click('button[aria-pressed="false"]');
		const states = [await readState(page, "Missing static preview")];
		await page.click('button[aria-pressed="false"]');
		return states;
	}
	return [];
}

async function readAxe() {
	const results = await window.axe.run(document, {
		runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
	});
	const errors = results.incomplete.filter((result) => result.error);
	if (errors.length) {
		throw new Error(`axe could not evaluate ${errors.map((result) => result.id).join(", ")}`);
	}
	return results.violations.map(({ id, impact, nodes }) => ({
		id,
		impact,
		nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
	}));
}

async function readState(page, name) {
	await page.waitForFunction(() =>
		document
			.getAnimations()
			.every(
				(animation) =>
					animation.effect?.getComputedTiming().iterations === Number.POSITIVE_INFINITY ||
					animation.playState !== "running"
			)
	);
	return {
		name,
		violations: await page.evaluate(readAxe),
		targetFailures: (await page.evaluate(readGeometry)).targetFailures,
	};
}

async function checkShellStates(page) {
	const states = [];
	states.push(...(await checkInlineContact(page)));
	await [
		{ trigger: 'button[title="All products"]', label: "All products" },
		{ trigger: 'button[aria-label="Search (⌘K)"]', label: "Search" },
		{ trigger: 'button[aria-label="Support open source"]', label: "Support open source" },
	].reduce(
		(previous, { trigger, label }) =>
			previous.then(async () => {
				console.log(`Opening ${label}`);
				await page.click(trigger);
				await page.waitForFunction(
					(name) => {
						const panel = document.querySelector(`[role="dialog"][aria-label="${name}"]`);
						return panel && getComputedStyle(panel).opacity === "1";
					},
					{},
					label
				);
				states.push(await readState(page, label));
				states.push(await checkCapsuleKeyboard(page, label));
				if (label === "All products") {
					states.push(await checkShortcutScope(page, label));
				}
				if (label === "Search") {
					await page.type('input[aria-label="Search"]', "zzzz-no-matching-entry");
					await page.waitForFunction(() => document.body.textContent.includes("No results"));
					states.push(await readState(page, "Empty search"));
				}
				await page.keyboard.press("Escape");
				await page.waitForFunction(
					(selector) => document.activeElement === document.querySelector(selector),
					{},
					trigger
				);
				await page.keyboard.press("Tab");
				const active = await page.evaluate(
					() =>
						document.activeElement.tagName !== "BODY" &&
						!document.activeElement.closest('[inert], [aria-hidden="true"]')
				);
				if (!active) {
					throw new Error(`${label} trapped focus during exit`);
				}
				await page.focus(trigger);
				await page.keyboard.press("Enter");
				await page.waitForFunction(
					(name) =>
						document
							.querySelector(`[role="dialog"][aria-label="${name}"]`)
							?.getAttribute("aria-hidden") === "false",
					{},
					label
				);
				const viewport = page.viewport();
				// The right edge can be the browser scrollbar rather than the document.
				await page.mouse.click(2, viewport.height - 24);
				await page.waitForFunction(
					(selector) => document.querySelector(selector)?.getAttribute("aria-expanded") === "false",
					{},
					trigger
				);
				// Outside pointer actions retain normal background focus; keyboard dismissal returns it.
				await page.keyboard.press("Tab");
				const outsideFocus = await page.evaluate(() => {
					const element = document.activeElement;
					return (
						element.tagName !== "BODY" &&
						!element.closest('[inert], [aria-hidden="true"]') &&
						element.getBoundingClientRect().height > 0
					);
				});
				if (!outsideFocus) {
					throw new Error(`${label} retained hidden focus after outside dismissal`);
				}
				await page.focus(trigger);
				await page.keyboard.press("Enter");
				await page.waitForFunction(
					(name) => {
						const panel = document.querySelector(`[role="dialog"][aria-label="${name}"]`);
						return (
							panel?.getAttribute("aria-hidden") === "false" &&
							getComputedStyle(panel).opacity === "1"
						);
					},
					{},
					label
				);
				await page.focus(`[role="dialog"][aria-label="${label}"] button[aria-label^="Close"]`);
				await page.keyboard.press("Enter");
				await page.waitForFunction(
					(selector) => document.activeElement === document.querySelector(selector),
					{},
					trigger
				);
				states.push({
					name: `${label} rapid reopening, exit Tab and outside dismissal`,
					passed: true,
				});
			}),
		Promise.resolve()
	);
	await page.focus('button[aria-label="Support open source"]');
	await page.keyboard.press("Enter");
	await page.waitForSelector(
		'[role="dialog"][aria-label="Support open source"][aria-hidden="false"]'
	);
	await page.keyboard.down("Control");
	await page.keyboard.press("k");
	await page.keyboard.up("Control");
	await page.waitForSelector('[role="dialog"][aria-label="Search"][aria-hidden="false"]');
	await page.evaluate(() => window.dispatchEvent(new Event("open-command-palette")));
	await page.keyboard.press("Escape");
	await page.waitForFunction(
		() =>
			document.activeElement === document.querySelector('button[aria-label="Support open source"]')
	);
	states.push({ name: "Support to search keeps the original invoking control", passed: true });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
	await page.click('button[aria-label="Toggle theme"]');
	await page.waitForFunction(
		(dark) => document.documentElement.classList.contains("dark") !== dark,
		{},
		before
	);
	const activeMotion = await page.evaluate(
		() =>
			document
				.getAnimations()
				.filter((animation) => animation.effect.getComputedTiming().activeDuration > 1).length
	);
	states.push({ name: "Reduced motion theme", activeMotion });
	// Restore the audited theme before Lighthouse's separate navigation.
	await page.click('button[aria-label="Toggle theme"]');
	await page.waitForFunction(
		(dark) => document.documentElement.classList.contains("dark") === dark,
		{},
		before
	);
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	return states;
}

async function checkShortcutScope(page, label) {
	await page.keyboard.down("Control");
	await page.keyboard.press("k");
	await page.keyboard.up("Control");
	await page.evaluate(() => window.dispatchEvent(new Event("open-command-palette")));
	// A forbidden open could mount the deferred dialog several commits later.
	await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
	const dialogs = await page.evaluate(() =>
		[...document.querySelectorAll('dialog[open], [role="dialog"][aria-hidden="false"]')].map(
			(dialog) => dialog.getAttribute("aria-label")
		)
	);
	if (dialogs.length !== 1 || dialogs[0] !== label) {
		throw new Error(`Search shortcut conflicted with ${label}: ${JSON.stringify(dialogs)}`);
	}
	return { name: `${label} owns dialog shortcuts`, passed: true };
}

async function checkReducedStyles(page) {
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	const failures = await page.evaluate(() =>
		[...document.querySelectorAll("body *")]
			.filter((element) => {
				const style = getComputedStyle(element);
				return [style.transitionDuration, style.animationDuration].some((value) =>
					value.split(",").some((duration) => Number.parseFloat(duration) * 1000 > 1)
				);
			})
			.map((element) => element.tagName)
	);
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	if (failures.length) {
		throw new Error(`Reduced motion leaves animated durations on ${failures.join(", ")}`);
	}
	return { name: "Reduced motion CSS across the document", passed: true };
}

async function checkInlineContact(page) {
	await page.focus("main button");
	await page.keyboard.press("Enter");
	await page.waitForSelector('main input[name="name"]');
	await page.type('main input[name="name"]', "Accessibility audit draft");
	const state = await readState(page, "Inline contact open");
	await page.focus('main button[aria-label="Close"]');
	await page.keyboard.press("Enter");
	await page.waitForFunction(() => !document.querySelector('main input[name="name"]'));
	await page.waitForFunction(
		() => document.activeElement === document.querySelector("main button")
	);
	const focusReturned = await page.evaluate(
		() => document.activeElement === document.querySelector("main button")
	);
	if (!focusReturned) {
		throw new Error("Closing inline contact must return focus to Start a conversation");
	}
	await page.keyboard.press("Enter");
	await page.waitForSelector('main input[name="name"]');
	const draftPreserved = await page.$eval(
		'main input[name="name"]',
		(element) => element.value === "Accessibility audit draft"
	);
	if (!draftPreserved) {
		throw new Error("Inline contact lost the visitor's draft after reopening");
	}
	await page.click('main button[aria-label="Close"]');
	return [state, { name: "Inline contact focus return and draft", focusReturned, draftPreserved }];
}

async function checkCapsuleKeyboard(page, label) {
	const selector = `[role="dialog"][aria-label="${label}"]`;
	const count = await page.$eval(
		selector,
		(panel) =>
			[...panel.querySelectorAll("a[href], button, input")].filter(
				(element) => element.getClientRects().length && !element.matches(":disabled")
			).length
	);
	const closeHit = await page.$eval(selector, (panel) => {
		const button = panel.querySelector('button[aria-label^="Close"]');
		const bounds = button.getBoundingClientRect();
		return button.contains(
			document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
		);
	});
	if (!closeHit) {
		throw new Error(`${label} close button is obscured`);
	}
	await Array.from({ length: count + 2 }).reduce(
		(previous) =>
			previous.then(async () => {
				await page.keyboard.press("Tab");
				await page.evaluate(() => new Promise(requestAnimationFrame));
				const contained = await page.$eval(selector, (panel) =>
					panel.contains(document.activeElement)
				);
				if (!contained) {
					throw new Error(`${label} leaked keyboard focus`);
				}
			}),
		Promise.resolve()
	);
	return { name: `${label} keyboard containment and close hit area`, checked: count + 2, closeHit };
}

async function checkPreviewStates(page, width) {
	const states = [];
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await page.click('button[aria-label="Enter fullscreen"]');
	await page.waitForSelector("dialog[open]");
	states.push(
		await checkShortcutScope(
			page,
			await page.$eval("dialog[open]", (dialog) => dialog.getAttribute("aria-label"))
		)
	);
	states.push(await readState(page, "Fullscreen preview"));
	await Array.from({ length: 12 }).reduce(
		(previous) =>
			previous.then(async () => {
				await page.keyboard.press("Tab");
				await page.evaluate(() => new Promise(requestAnimationFrame));
				const focus = await page.evaluate(() => ({
					contained: document.querySelector("dialog").contains(document.activeElement),
					pageFocused: document.hasFocus(),
					tag: document.activeElement.tagName,
					label: document.activeElement.getAttribute("aria-label"),
					modal: Boolean(document.querySelector("dialog:modal")),
				}));
				// Native dialogs allow Tab to visit browser chrome. No control in the
				// application may receive focus outside the open modal.
				if (!focus.contained && focus.tag !== "BODY") {
					throw new Error(`Fullscreen preview leaked keyboard focus: ${JSON.stringify(focus)}`);
				}
			}),
		Promise.resolve()
	);
	const backgroundFocusBlocked = await page.evaluate(() => {
		const link = document.querySelector("footer a");
		link.focus();
		return document.activeElement !== link;
	});
	if (!backgroundFocusBlocked) {
		throw new Error("Fullscreen background must be inert to programmatic focus");
	}
	await page.keyboard.press("Escape");
	await page.waitForFunction(
		() => document.activeElement.getAttribute("aria-label") === "Enter fullscreen"
	);
	states.push({ name: "Preview focus containment and return", passed: true });
	if (width === 1280) {
		await page.evaluate(() => {
			window.auditScrollRequests = [];
			const original = Element.prototype.scrollIntoView;
			Element.prototype.scrollIntoView = function recordScroll(options) {
				window.auditScrollRequests.push(options);
				original.call(this, options);
			};
		});
		await page.click('nav[aria-label="On this page"] a');
		const behavior = await page.evaluate(() => window.auditScrollRequests.at(-1)?.behavior);
		states.push({ name: "Reduced motion table of contents", behavior });
		if (behavior !== "instant") {
			throw new Error("Table of contents must not smooth scroll with reduced motion");
		}
	}
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	return states;
}

async function checkContactStates(page) {
	await page.click('main button[type="submit"]');
	await page.waitForFunction(() => document.activeElement.getAttribute("name") === "name");
	await page.type('input[name="name"]', "Accessibility audit draft");
	await page.click('main button[type="submit"]');
	await page.waitForFunction(() => document.activeElement.getAttribute("name") === "email");
	const draftPreserved = await page.$eval(
		'input[name="name"]',
		(element) => element.value === "Accessibility audit draft"
	);
	if (!draftPreserved) {
		throw new Error("Contact validation lost the visitor's draft");
	}
	const validation = { ...(await readState(page, "Contact validation")), draftPreserved };
	await page.click('main button[type="button"]');
	await page.waitForSelector('main a[href^="mailto:"]');
	await page.click("footer button");
	await page.waitForSelector('footer a[href^="mailto:"]');
	return [validation, { name: "Main and footer email reveal", passed: true }];
}

async function checkKeyboard(page) {
	const count = await page.evaluate(
		() =>
			[
				...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex='0']"),
			].filter(
				(element) =>
					element.getClientRects().length &&
					!element.closest('[inert], [aria-hidden="true"]') &&
					!element.matches(":disabled") &&
					getComputedStyle(element).visibility === "visible"
			).length
	);
	const steps = await Array.from({ length: count }).reduce(
		(previous) =>
			previous.then(async (results) => {
				await page.keyboard.press("Tab");
				await page.evaluate(() => new Promise(requestAnimationFrame));
				results.push(
					await page.evaluate(() => {
						const element = document.activeElement;
						const style = getComputedStyle(element);
						const rect = element.getBoundingClientRect();
						const header = document.querySelector("body header");
						const bounds = header.getBoundingClientRect();
						return {
							label:
								element.getAttribute("aria-label") ||
								element.getAttribute("name") ||
								(element.querySelector("[data-resume-email]")
									? "Copy email"
									: element.textContent.trim().slice(0, 70)),
							visibleFocus:
								style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 2,
							inViewport: rect.top >= 0 && rect.top < innerHeight && rect.bottom <= innerHeight + 1,
							obscured:
								!(header.contains(element) || element.classList.contains("skip-link")) &&
								rect.top < bounds.bottom &&
								rect.bottom > bounds.top,
						};
					})
				);
				return results;
			}),
		Promise.resolve([])
	);
	return {
		checked: steps.length,
		failures: steps.filter((step) => !(step.visibleFocus && step.inViewport) || step.obscured),
	};
}

async function measureErrorPage(page) {
	const result = await snapshot(page, {
		flags: { onlyCategories: ["accessibility"], logLevel: "error" },
	});
	if (!result || result.lhr.runtimeError) {
		throw new Error(result?.lhr.runtimeError?.message || "Lighthouse returned no snapshot");
	}
	return { mode: "snapshot", accessibility: readLighthouseAccessibility(result.lhr) };
}

function readLighthouseAccessibility(lhr) {
	const errors = Object.entries(lhr.audits)
		.filter(([, audit]) => audit.errorMessage)
		.map(([id, audit]) => `${id}: ${audit.errorMessage}`);
	const score = lhr.categories.accessibility.score;
	if (!Number.isFinite(score) || errors.length) {
		throw new Error(`Lighthouse audit incomplete: ${errors.join("; ")}`);
	}
	return score * 100;
}

async function measurePage(url, route, width, page) {
	const port = Number(new URL(browser.wsEndpoint()).port);
	const result = await lighthouse(
		`${url}${route}`,
		{
			port,
			output: "json",
			onlyCategories: ["performance", "accessibility"],
			logLevel: "error",
			screenEmulation: {
				mobile: width < 640,
				width,
				height: 1000,
				deviceScaleFactor: 1,
				disabled: false,
			},
			formFactor: width < 640 ? "mobile" : "desktop",
		},
		undefined,
		page
	);
	if (!result || result.lhr.runtimeError) {
		throw new Error(result?.lhr.runtimeError?.message || "Lighthouse returned no result");
	}
	const { lhr } = result;
	return {
		theme: await page.evaluate(() =>
			document.documentElement.classList.contains("dark") ? "dark" : "light"
		),
		lighthouseVersion: lhr.lighthouseVersion,
		profile: {
			formFactor: lhr.configSettings.formFactor,
			screenEmulation: lhr.configSettings.screenEmulation,
			throttlingMethod: lhr.configSettings.throttlingMethod,
			throttling: lhr.configSettings.throttling,
		},
		performance: lhr.categories.performance.score * 100,
		accessibility: readLighthouseAccessibility(lhr),
		timings: Object.fromEntries(
			[
				"first-contentful-paint",
				"largest-contentful-paint",
				"total-blocking-time",
				"cumulative-layout-shift",
				"speed-index",
			].map((key) => [key, lhr.audits[key].numericValue])
		),
		resources: lhr.audits["resource-summary"].details.items,
		budget: assessBudget(lhr, budgets[0]),
		failedAudits: Object.entries(lhr.audits)
			.filter(([, audit]) => audit.score !== null && audit.score < 1)
			.map(([id, audit]) => ({ id, title: audit.title, score: audit.score })),
	};
}

try {
	report.chrome = await browser.version();
	await withFigmaFixture((env) =>
		withProductionServer(
			async (url) => {
				const cases = routes
					.filter((value) => !selectedRoute || selectedRoute === value)
					.flatMap((route) =>
						[375, 768, 1280].flatMap((width) =>
							["light", "dark"].map((theme) => ({ route, width, theme }))
						)
					)
					.filter(
						({ route, width, theme }) =>
							!report.cases.some(
								(entry) => entry.route === route && entry.width === width && entry.theme === theme
							)
					);
				await cases.reduce(
					(previous, { route, width, theme }) =>
						previous.then(async () => {
							const result = await auditPage(url, route, width, theme);
							report.cases.push(result);
							writeFileSync(reportFile, JSON.stringify(report));
							console.log(
								JSON.stringify({
									route,
									width,
									theme,
									violations: result.violations.length,
									targets: result.targetFailures.length,
									overflow: result.overflow,
									navOverlap: result.navOverlap,
									keyboardFailures: result.keyboard?.failures.length,
									lighthouseAccessibility: result.lighthouse?.accessibility,
									budgetFailures: result.lighthouse?.budget?.failures,
								})
							);
						}),
					Promise.resolve()
				);
			},
			{ env }
		)
	);
} finally {
	try {
		writeEvidenceJson(reportFile, report);
	} finally {
		await browser.close();
	}
}
const failures = report.cases.filter(
	(entry) =>
		entry.overflow ||
		(entry.actualTheme && entry.actualTheme !== entry.theme) ||
		entry.runtimeErrors?.length ||
		entry.h1Count !== 1 ||
		entry.navOverlap.length ||
		entry.targetFailures.length ||
		entry.keyboard?.failures.length ||
		entry.states?.some(
			(state) =>
				state.targetFailures?.length ||
				state.activeMotion > 0 ||
				state.violations?.some(({ impact }) => impact === "serious" || impact === "critical")
		) ||
		entry.violations.some(({ impact }) => impact === "serious" || impact === "critical") ||
		(entry.lighthouse &&
			(entry.lighthouse.accessibility < 95 ||
				entry.lighthouse.budget?.failures.length ||
				(entry.lighthouse.theme && entry.lighthouse.theme !== entry.theme)))
);
console.log(`${report.cases.length} cases; ${failures.length} failed`);
process.exitCode = failures.length || report.cases.length !== report.expectedCases ? 1 : 0;
