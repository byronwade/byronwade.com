import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import lighthouse, { snapshot } from "lighthouse";
import { withFigmaFixture } from "../tests/fixtures/figma-browser.mjs";
import { withResendFixture } from "../tests/fixtures/resend-browser.mjs";
import { launchAuditBrowser } from "./audit-browser.mjs";
import { serializeEvidence, writeEvidenceJson } from "./evidence-json.mjs";
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
const CONTENT_DETAIL_ROUTE = /^\/(blog|projects)\/[^/]+$/;
const prerenderManifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const publishedContentRoutes = Object.keys(prerenderManifest.routes)
	.filter((route) => CONTENT_DETAIL_ROUTE.test(route))
	.sort();
const projectRoutes = publishedContentRoutes.filter((route) => route.startsWith("/projects/"));
const blogRoutes = publishedContentRoutes.filter((route) => route.startsWith("/blog/"));
if (!(projectRoutes.length && blogRoutes.length)) {
	throw new Error("A production build must contain published project and writing detail routes");
}
const representatives = {
	"/projects/[slug]": projectRoutes,
	"/blog/[slug]": blogRoutes,
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
		.update(readFileSync("scripts/audit-browser.mjs"))
		.update(readFileSync("scripts/evidence-json.mjs"))
		.update(readFileSync("scripts/production-session.mjs"))
		.update(readFileSync("tests/fixtures/figma-browser.mjs"))
		.update(readFileSync("tests/fixtures/figma-browser-preload.mjs"))
		.update(readFileSync("tests/fixtures/resend-browser.mjs"))
		.update(readFileSync("lighthouse-budget.json"))
		.digest("hex"),
	figma: "Local API and embed fixtures; live provider integration is outside this audit",
	email: "Local Resend HTTP fixture; no message is delivered",
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
let browser = null;

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
	const header = document.querySelector("[data-site-header]");
	const nav = header.querySelector('nav[aria-label="Primary"]');
	const intersects = (element, bounds) => {
		const rect = element.getBoundingClientRect();
		return (
			rect.left < bounds.right &&
			rect.right > bounds.left &&
			rect.top < bounds.bottom &&
			rect.bottom > bounds.top
		);
	};
	// Header controls must clear the primary links; the separately fixed
	// breadcrumb must clear the whole header surface.
	const overlaps = [
		...[...header.querySelectorAll("button, a[href]")]
			.filter(visible)
			.filter((element) => !nav.contains(element))
			.filter((element) => intersects(element, nav.getBoundingClientRect())),
		...[...document.querySelectorAll('nav[aria-label="Breadcrumb"]')]
			.filter(visible)
			.filter((element) => intersects(element, header.getBoundingClientRect())),
	];
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

async function loadAuditedPage(page, url, route, width, theme, expectedStatus) {
	// A prior hydration leaves the chip warm, and simulated throttling then
	// scores that heat as page work. Let Lighthouse perform the only navigation
	// for a page whose timing budget is checked. Error pages have no timing
	// budget; load them first so the accessibility snapshot can see the response.
	if (measure && expectedStatus === 200) {
		const lighthouseResult = await measurePage(url, route, width, page);
		const status = await restoreAuditedPage(page, url, route, width, theme, expectedStatus);
		return { status, lighthouseResult };
	}
	const navigation = await page.goto(`${url}${route}`, {
		waitUntil: "networkidle2",
		timeout: 60_000,
	});
	if (navigation.status() !== expectedStatus) {
		throw new Error(`${route} returned HTTP ${navigation.status()}, expected ${expectedStatus}`);
	}
	await page.evaluate(() => document.fonts.ready);
	if (!measure) {
		return { status: navigation.status(), lighthouseResult: undefined };
	}
	const lighthouseResult = await measureErrorPage(page);
	// Snapshot mode still applies Lighthouse's mobile viewport. Put the
	// requested width back so the desktop breadcrumb can mount on 404s too.
	const status = await restoreAuditedPage(page, url, route, width, theme, expectedStatus);
	return { status, lighthouseResult };
}

async function restoreAuditedPage(page, url, route, width, theme, status) {
	await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
	const restored = await page.goto(`${url}${route}`, {
		waitUntil: "networkidle2",
		timeout: 60_000,
	});
	const acceptable = status === 200 ? [200, 304] : [status];
	if (!acceptable.includes(restored.status())) {
		throw new Error(`${route} returned HTTP ${restored.status()} after measurement`);
	}
	await page.evaluate(() => document.fonts.ready);
	return restored.status();
}

async function openBrowser(performanceSample) {
	if (browser) {
		return;
	}
	browser = await launchAuditBrowser({ lighthouse: performanceSample });
	report.chrome = report.chrome || (await browser.version());
}

async function closeBrowser() {
	if (!browser) {
		return;
	}
	const closing = browser;
	browser = null;
	await closing.close();
}

async function auditPage(url, route, width, theme) {
	const expectedStatus =
		route === "/audit-not-found" || route === "/portfolio/figma/audit-unavailable" ? 404 : 200;
	await openBrowser(measure && expectedStatus === 200);
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
		const loaded = await loadAuditedPage(page, url, route, width, theme, expectedStatus);
		const lighthouseResult = loaded.lighthouseResult;
		await page.addScriptTag({ content: axeSource });
		const violations = await page.evaluate(readAxe);
		const geometry = await page.evaluate(readGeometry);
		const result = {
			route,
			width,
			theme,
			status: loaded.status,
			expectedStatus,
			runtimeErrors,
			violations,
			...geometry,
			...(lighthouseResult ? { lighthouse: lighthouseResult } : {}),
		};
		if (
			phase === "final" &&
			((width === 1280 && theme === "light") || (width === 390 && theme === "dark"))
		) {
			result.screenshot = `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}-${theme}.png`;
			await page.screenshot({ path: `${destination}/${result.screenshot}`, fullPage: true });
		}
		if (phase === "final") {
			result.keyboard = await checkKeyboard(page);
			result.states = await checkRouteStates(page, route, width);
			if (width === 1280 && route !== "/") {
				result.states.push(...(await checkShellBreadcrumb(page, route)));
			}
			result.states.push(await checkReducedStyles(page));
			if (
				route === "/blog" ||
				route === "/projects" ||
				route.startsWith("/blog/") ||
				route.startsWith("/projects/")
			) {
				result.states.push(
					await checkReadingWithoutJavaScript(page, url, route, width, theme, expectedStatus)
				);
			}
		}
		return result;
	} finally {
		await context.close();
		// Chrome keeps the chip warm between samples. Close it before the next wait.
		if (measure) {
			await closeBrowser();
		}
	}
}

async function checkReadingWithoutJavaScript(page, url, route, width, theme, expectedStatus) {
	await page.setJavaScriptEnabled(false);
	try {
		await restoreAuditedPage(page, url, route, width, theme, expectedStatus);
		return await page.evaluate(() => {
			const headings = [...document.querySelectorAll("main h1")];
			const content = [
				...document.querySelectorAll(
					"main article p, main a[href^='/blog/'], main a[href^='/projects/']"
				),
			];
			const failures = [];
			if (
				headings.length !== 1 ||
				!headings[0].checkVisibility({ opacityProperty: true, visibilityProperty: true })
			) {
				failures.push("The reading heading must be visible without JavaScript");
			}
			if (
				!content.length ||
				content.some(
					(element) => !element.checkVisibility({ opacityProperty: true, visibilityProperty: true })
				)
			) {
				failures.push("The reading content must be visible without JavaScript");
			}
			return { name: "Reading without JavaScript", contentCount: content.length, failures };
		});
	} finally {
		await page.setJavaScriptEnabled(true);
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
	if (route === "/portfolio") {
		return await checkPortfolioStates(page);
	}
	if (route === "/portfolio/figma/audit-fixture") {
		await page.click('button[aria-pressed="false"]');
		const states = [await readState(page, "Missing static preview")];
		await page.click('button[aria-pressed="false"]');
		return states;
	}
	return [];
}

async function checkShellBreadcrumb(page, route) {
	if (route !== "/audit-not-found") {
		return await checkBreadcrumbStates(page);
	}
	// An unknown URL is not a page, so the shell shows no trail for it.
	if (await page.$('nav[aria-label="Breadcrumb"]')) {
		throw new Error("An unknown URL must not show a breadcrumb trail");
	}
	return [{ name: "Unknown URL shows no breadcrumb", passed: true }];
}

async function checkBreadcrumbStates(page) {
	const states = [];
	const trigger = 'button[aria-label="Show hidden breadcrumb levels"]';
	const nav = 'nav[aria-label="Breadcrumb"]';
	await page.waitForSelector(nav, { visible: true });
	const truncated = await page.$$eval(`${nav} a`, (links) =>
		links.some((link) => link.scrollWidth > link.clientWidth + 1)
	);
	if (truncated && !(await page.$(trigger))) {
		throw new Error("Breadcrumb label is truncated");
	}
	if (await page.$(trigger)) {
		await page.click(trigger);
		await page.waitForSelector('[data-slot="popover-content"]', { visible: true });
		states.push(await readState(page, "Breadcrumb overflow"));
		await page.keyboard.press("Escape");
		await page.waitForFunction(
			(selector) => document.activeElement === document.querySelector(selector),
			{},
			trigger
		);
		states.push({ name: "Breadcrumb overflow returns keyboard focus", passed: true });
	}
	const viewport = page.viewport();
	await page.setViewport({ ...viewport, width: 768 });
	await page.waitForFunction(
		(selector) => !document.querySelector(selector)?.getClientRects().length,
		{},
		nav
	);
	await page.setViewport(viewport);
	await page.waitForSelector(nav, { visible: true });
	const geometry = await page.evaluate(readGeometry);
	if (geometry.overflow || geometry.navOverlap.length) {
		throw new Error("Breadcrumb resize overlaps the navigation");
	}
	states.push({ name: "Breadcrumb follows the visible header breakpoint", passed: true });
	return states;
}

async function checkPortfolioStates(page) {
	const text = await page.evaluate(() => document.body.textContent ?? "");
	if (text.includes("Loading repositories") || text.includes("Refreshing…")) {
		throw new Error("Portfolio must not stay in a loading state");
	}
	const hasRepositories = await page.$("main a[href*='github.com']");
	const settled =
		hasRepositories ||
		text.includes("No repositories yet") ||
		text.includes("Couldn't load repositories");
	if (!settled) {
		throw new Error("Portfolio must show repositories, an empty profile, or a load error");
	}
	const refresh = await page.$("main a[href='/portfolio']");
	const refreshLabel = refresh
		? await page.evaluate((node) => node.textContent ?? "", refresh)
		: "";
	if (!(refreshLabel.includes("Refresh") || refreshLabel.includes("Try again"))) {
		throw new Error("Portfolio refresh must remain present");
	}
	const recoveryLinks = await page.$$eval("main a[href]", (links) =>
		links
			.filter((link) => ["Refresh", "Try again", "Open GitHub"].includes(link.textContent.trim()))
			.map((link) => link.getAttribute("role"))
	);
	if (recoveryLinks.some((role) => role && role !== "link")) {
		throw new Error("Portfolio recovery navigation must retain link semantics");
	}
	return [await readState(page, "Portfolio settled")];
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

async function waitForMotion(page) {
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

async function readState(page, name) {
	await waitForMotion(page);
	return {
		name,
		violations: await page.evaluate(readAxe),
		targetFailures: (await page.evaluate(readGeometry)).targetFailures,
	};
}

async function checkShellStates(page) {
	const states = [];
	states.push(...(await checkInlineContact(page)));
	// The menu trigger exists only while the header is too narrow for the primary links.
	const candidates = [
		{ trigger: 'button[aria-label="Search (⌘K)"]', label: "Search" },
		{ trigger: "button[data-site-menu]", label: "Navigate" },
	];
	const shown = await Promise.all(
		candidates.map(({ trigger }) =>
			page.$eval(trigger, (element) => element.getClientRects().length > 0)
		)
	);
	await candidates
		.filter((_, index) => shown[index])
		.reduce(
			(previous, { trigger, label }) =>
				previous.then(async () => {
					console.log(`Opening ${label}`);
					// Independent pointer scenarios start at rest; rapid exit/reopen is tested below.
					await waitForMotion(page);
					await page.click(trigger);
					await waitForHeaderPanel(page, label);
					states.push(await readState(page, label));
					states.push(await checkPanelKeyboard(page, label));
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
					await waitForHeaderPanel(page, label);
					const viewport = page.viewport();
					// The right edge can be the browser scrollbar rather than the document.
					await page.mouse.click(2, viewport.height - 24);
					await page.waitForFunction(
						(selector) =>
							document.querySelector(selector)?.getAttribute("aria-expanded") === "false",
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
					await waitForHeaderPanel(page, label);
					await focusPanelClose(page, label);
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
	// Popover closes can still be in their exit transition here. Counting every
	// animation with a long activeDuration treats that leftover motion as a
	// theme-toggle failure. Let it finish, then record only motion the toggle starts.
	await waitForMotion(page);
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
	);
	const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
	await page.click('button[aria-label="Toggle theme"]');
	await page.waitForFunction(
		(dark) => document.documentElement.classList.contains("dark") !== dark,
		{},
		before
	);
	const activeMotion = await page.evaluate(
		() =>
			document.getAnimations().filter((animation) => {
				const timing = animation.effect?.getComputedTiming();
				const running = animation.playState === "running" || animation.playState === "pending";
				return running && timing?.activeDuration > 1;
			}).length
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

// Header popovers mount only while open; their popups carry these data hooks.
const HEADER_PANELS = { Search: "[data-header-search]", Navigate: "[data-header-menu]" };

async function checkShortcutScope(page, label) {
	await page.keyboard.down("Control");
	await page.keyboard.press("k");
	await page.keyboard.up("Control");
	await page.evaluate(() => window.dispatchEvent(new Event("open-command-palette")));
	// A forbidden open could mount the deferred popover several commits later.
	await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
	const dialogs = await page.evaluate(
		(headerPanels) => [
			...[
				...document.querySelectorAll(
					["dialog[open]", ...headerPanels.map((selector) => `${selector}[data-open]`)].join(", ")
				),
			].map((dialog) => dialog.getAttribute("aria-label")),
			// An expanded trigger whose panel cannot mount still captures the next Escape.
			...[...document.querySelectorAll('button[aria-label="Search (⌘K)"][aria-expanded="true"]')]
				.filter(() => !document.querySelector(`${headerPanels[0]}[data-open]`))
				.map(() => "Search (unmounted)"),
		],
		Object.values(HEADER_PANELS)
	);
	if (dialogs.length !== 1 || dialogs[0] !== label) {
		throw new Error(`Search shortcut conflicted with ${label}: ${JSON.stringify(dialogs)}`);
	}
	return { name: `${label} owns dialog shortcuts`, passed: true };
}

async function waitForHeaderPanel(page, label) {
	await page.waitForFunction(
		(selector) => {
			const panel = document.querySelector(selector);
			return panel?.hasAttribute("data-open") && !panel.hasAttribute("data-starting-style");
		},
		{},
		HEADER_PANELS[label]
	);
	await waitForMotion(page);
}

// The search panel has a visible close control; the menu's close part is
// visually hidden until it receives focus.
async function focusPanelClose(page, label) {
	const focused = await page.$eval(HEADER_PANELS[label], (panel) => {
		const closes = [...panel.querySelectorAll("button")].filter((button) =>
			(button.getAttribute("aria-label") || button.textContent).trim().startsWith("Close")
		);
		const close = closes.find((button) => button.hasAttribute("aria-label")) ?? closes[0];
		close?.focus();
		return Boolean(close) && document.activeElement === close;
	});
	if (!focused) {
		throw new Error(`${label} has no focusable close control`);
	}
	await page.evaluate(() => new Promise(requestAnimationFrame));
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
	await page.click("main button");
	await page.waitForSelector('main input[name="email"]');
	const sent = await checkContactSuccess(page);
	await page.evaluate(() => {
		window.auditToastAdditions = 0;
		window.auditToastObserver = new MutationObserver((records) => {
			for (const record of records) {
				for (const node of record.addedNodes) {
					if (node instanceof Element) {
						window.auditToastAdditions +=
							Number(node.matches("[data-sonner-toast]")) +
							node.querySelectorAll("[data-sonner-toast]").length;
					}
				}
			}
		});
		window.auditToastObserver.observe(document.body, { childList: true, subtree: true });
	});
	await page.click('main button[aria-label="Close"]');
	await page.click("main button");
	await page.waitForSelector('main input[name="name"]');
	await delay(750);
	const repeatedToasts = await page.evaluate(() => {
		window.auditToastObserver.disconnect();
		return window.auditToastAdditions;
	});
	if (repeatedToasts) {
		throw new Error(
			`Reopening inline contact repeated the success notification ${repeatedToasts} times`
		);
	}
	await page.click('main button[aria-label="Close"]');
	return [
		state,
		{ name: "Inline contact focus return and draft", focusReturned, draftPreserved },
		sent,
		{ name: "Inline contact keeps one notification per send", repeatedToasts },
	];
}

async function checkContactSuccess(page) {
	const name = await page.$eval('main input[name="name"]', (element) => element.value);
	if (!name) {
		await page.type('main input[name="name"]', "Accessibility audit visitor");
	}
	await page.type('main input[name="email"]', "visitor@example.invalid");
	await page.type('main textarea[name="message"]', "Local browser fixture; no email is delivered.");
	await page.click('main button[type="submit"]');
	await page.waitForFunction(() =>
		document.querySelector('main [role="status"]')?.textContent.includes("Sent.")
	);
	await page.waitForSelector("[data-sonner-toast]");
	return await readState(page, "Contact success with local transport");
}

async function checkPanelKeyboard(page, label) {
	const selector = HEADER_PANELS[label];
	const count = await page.$eval(
		selector,
		(panel) =>
			[...panel.querySelectorAll("a[href], button, input")].filter(
				(element) => element.getClientRects().length && !element.matches(":disabled")
			).length
	);
	await focusPanelClose(page, label);
	const closeHit = await page.$eval(selector, (panel) => {
		const button = document.activeElement;
		const bounds = button.getBoundingClientRect();
		return (
			panel.contains(button) &&
			bounds.width >= 24 &&
			bounds.height >= 24 &&
			button.contains(
				document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
			)
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
	return [
		validation,
		{ name: "Main and footer email reveal", passed: true },
		await checkContactSuccess(page),
	];
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
						const header = document.querySelector("[data-site-header]");
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
								// The fixed breadcrumb shares the header's band beside it; only
								// a focus target under the header surface itself is obscured.
								!(header.contains(element) || element.classList.contains("skip-link")) &&
								rect.top < bounds.bottom &&
								rect.bottom > bounds.top &&
								rect.left < bounds.right &&
								rect.right > bounds.left,
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
		environment: lhr.environment,
		runWarnings: lhr.runWarnings,
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
	await withResendFixture((emailEnv) =>
		withFigmaFixture((env) =>
			withProductionServer(
				async (url) => {
					const cases = routes
						.filter((value) => !selectedRoute || selectedRoute === value)
						.flatMap((route) =>
							[390, 768, 1280].flatMap((width) =>
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
								writeFileSync(reportFile, serializeEvidence(report));
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
										stateViolations: result.states?.reduce(
											(total, state) => total + (state.violations?.length || 0),
											0
										),
										failed: caseFailed(result),
										lighthouseAccessibility: result.lighthouse?.accessibility,
										tbt: result.lighthouse?.timings?.["total-blocking-time"],
										lcp: result.lighthouse?.timings?.["largest-contentful-paint"],
										budgetFailures: result.lighthouse?.budget?.failures,
									})
								);
							}),
						Promise.resolve()
					);
				},
				{ env: { ...env, ...emailEnv } }
			)
		)
	);
} finally {
	try {
		writeEvidenceJson(reportFile, report);
	} finally {
		await closeBrowser();
	}
}
function caseFailed(entry) {
	return Boolean(
		entry.overflow ||
			(entry.actualTheme && entry.actualTheme !== entry.theme) ||
			entry.runtimeErrors?.length ||
			entry.h1Count !== 1 ||
			entry.navOverlap.length ||
			entry.targetFailures.length ||
			entry.keyboard?.failures.length ||
			entry.states?.some(
				(state) =>
					state.failures?.length ||
					state.targetFailures?.length ||
					state.activeMotion > 0 ||
					state.violations?.length
			) ||
			entry.violations.length ||
			(entry.lighthouse &&
				(entry.lighthouse.accessibility < 95 ||
					entry.lighthouse.budget?.failures.length ||
					(entry.lighthouse.theme && entry.lighthouse.theme !== entry.theme)))
	);
}
const failures = report.cases.filter(caseFailed);
console.log(`${report.cases.length} cases; ${failures.length} failed`);
process.exitCode = failures.length || report.cases.length !== report.expectedCases ? 1 : 0;
