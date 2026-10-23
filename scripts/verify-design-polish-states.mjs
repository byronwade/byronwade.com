import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { withBrowser } from "../tests/fixtures/browser.mjs";
import { withPortfolioFixture } from "../tests/fixtures/portfolio-browser.mjs";
import { axeVersion, injectAxe, readAxe } from "./axe-audit.mjs";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { withProductionServer } from "./production-session.mjs";

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const destination = `${process.env.DESIGN_EVIDENCE_DIR || "docs/evidence/design-polish"}/${phase}/states`;
mkdirSync(destination, { recursive: true });
const report = {
	phase,
	head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", windowsHide: true }).trim(),
	buildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
	harnessHash: createHash("sha256")
		.update(readFileSync(import.meta.filename))
		.update(readFileSync("scripts/axe-audit.mjs"))
		.update(readFileSync("scripts/production-session.mjs"))
		.update(readFileSync("scripts/evidence-json.mjs"))
		.update(readFileSync("tests/fixtures/browser.mjs"))
		.update(readFileSync("tests/fixtures/portfolio-browser.mjs"))
		.update(readFileSync("tests/fixtures/portfolio-browser-preload.mjs"))
		.update(readFileSync("lib/cache.ts"))
		.digest("hex"),
	cases: [],
	readingProgress: [],
	portfolioPending: [],
	failures: [],
	pageErrors: [],
};
// Synthetic provider data stays in an isolated local Data Cache, never the public site.
const repository = {
	id: 1,
	name: "thorbis-design-with-a-long-repository-name-for-reflow-verification",
	full_name: "fixture/thorbis-design",
	html_url: "https://github.com/byronwade/thorbis-design",
	description:
		"Thorbis design foundations. This deliberately long fixture checks that identity and supporting detail remain readable on a narrow screen.",
	stargazers_count: 0,
	forks_count: 0,
	language: "TypeScript",
	pushed_at: "2026-10-16T12:00:00Z",
	updated_at: "2026-10-16T12:00:00Z",
	fork: false,
	archived: false,
};

async function verifyPortfolio(page, url, width, theme, fixture) {
	const load = () => page.goto(`${url}/portfolio`, { waitUntil: "networkidle2" });
	const unavailable = async (name) => {
		const state = await snapshot(page, name, width, theme);
		assert.equal(state.rows, 0);
		assert.ok(state.text.includes("Couldn’t load repositories"));
		const actions = await page.$$eval("main a", (links) =>
			links.map((link) => ({ label: link.textContent.trim(), href: link.getAttribute("href") }))
		);
		assert.ok(actions.some((link) => link.label === "Try again" && link.href === "/portfolio"));
		assert.ok(
			actions.some(
				(link) => link.label === "Open GitHub" && link.href === "https://github.com/byronwade"
			)
		);
	};
	const activate = async (label) => {
		const selector =
			label === "Refresh"
				? 'main header a[href="/portfolio"]'
				: 'main a[href="/portfolio"]:not(header a)';
		await page.waitForFunction(
			(target, text) => document.querySelector(target)?.textContent.trim() === text,
			{},
			selector,
			label
		);
		await page.focus(selector);
		await Promise.all([
			page.waitForNavigation({ waitUntil: "networkidle2" }),
			page.keyboard.press("Enter"),
		]);
	};
	fixture.setResponse({ status: 200, body: [] });
	await fixture.invalidate(url);
	const beforeEmpty = fixture.requests;
	await load();
	assert.equal(fixture.requests, beforeEmpty + 1, "empty data comes from the fixture");
	const empty = await snapshot(page, "portfolio-empty", width, theme);
	assert.equal(empty.rows, 0);
	assert.ok(empty.text.includes("No repositories yet"));

	fixture.setResponse({ status: 503, body: { message: "Fixture unavailable" } });
	await fixture.invalidate(url);
	await load();
	await unavailable("portfolio-error");

	fixture.setResponse({ hold: true });
	await fixture.invalidate(url);
	const requested = fixture.waitForRequest();
	let settled = false;
	const loading = load().finally(() => {
		settled = true;
	});
	// Observe server transport before its real five-second deadline, not a retired client spinner.
	await requested;
	assert.equal(settled, false, "navigation waits for the held provider");
	report.portfolioPending.push({ width, theme, providerObserved: true, navigationPending: true });
	await loading;
	await unavailable("portfolio-timeout");

	fixture.setResponse({ status: 200, body: [repository] });
	const beforeRecovery = fixture.requests;
	await activate("Try again");
	assert.equal(fixture.requests, beforeRecovery + 1, "provider failures are not cached");
	const recovered = await snapshot(page, "portfolio-recovered", width, theme);
	assert.equal(recovered.rows, 1);
	assert.ok(recovered.text.includes(repository.description));
	assert.ok(recovered.text.includes("TypeScript"));
	assert.ok(await page.$(`main ol a[href="${repository.html_url}"]`));

	fixture.setResponse({ status: 503, body: { message: "Fixture unavailable" } });
	await activate("Refresh");
	const cached = await snapshot(page, "portfolio-cached-refresh", width, theme);
	assert.equal(cached.rows, 1);
	assert.equal(fixture.requests, beforeRecovery + 1, "refresh reuses unexpired data");
	await fixture.invalidate(url);
	await activate("Refresh");
	await unavailable("portfolio-refresh-failed");
	fixture.setResponse({ status: 200, body: [repository] });
	const beforeRetry = fixture.requests;
	await activate("Try again");
	assert.equal((await snapshot(page, "portfolio-retry", width, theme)).rows, 1);
	assert.equal(fixture.requests, beforeRetry + 1, "keyboard retry reaches the recovered provider");
}

async function snapshot(page, name, width, theme) {
	const file = `${name}-${width}-${theme}.png`;
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: `${destination}/${file}`, fullPage: !name.includes("fullscreen") });
	const state = await page.evaluate(() => ({
		overflow: document.documentElement.scrollWidth > innerWidth,
		busy: Boolean(document.querySelector('main [aria-busy="true"]')),
		text: document
			.querySelector("main")
			.textContent.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email redacted]"),
		rows: document.querySelectorAll("main ol > li").length,
	}));
	report.cases.push({ name, width, theme, file, ...state });
	assert.equal(state.overflow, false, `${name} fits at ${width}`);
	if (phase === "after") {
		await injectAxe(page);
		const accessibility = await page.evaluate(readAxe);
		assert.equal(accessibility.version, axeVersion, "the page runs Lighthouse's copy of axe");
		report.cases.at(-1).accessibility = accessibility;
		assert.deepEqual(accessibility.violations, [], `${name} has no axe A/AA violations`);
	}
	return state;
}

async function verifyInlineContact(page, url, width, theme) {
	await page.goto(url, { waitUntil: "networkidle2" });
	await page.click('main button[data-slot="button"]');
	await page.waitForSelector('section[aria-label="Contact"] input[name="name"]', {
		visible: true,
	});
	await snapshot(page, "home-contact", width, theme);
	const control = await page.$eval('section[aria-label="Contact"]', (section) => {
		const copy = section.querySelector('button[aria-label="Copy email"]');
		const rect = copy.getBoundingClientRect();
		return {
			background: getComputedStyle(copy).backgroundColor,
			parentBackground: getComputedStyle(section).backgroundColor,
			width: rect.width,
			height: rect.height,
			label: copy.getAttribute("aria-label"),
		};
	});
	report.cases.at(-1).copyControl = control;
	assert.ok(control.width >= 44 && control.height >= 44);
	assert.notEqual(control.background, "rgba(0, 0, 0, 0)", "copy control has its own surface");
	assert.notEqual(control.background, control.parentBackground);
	// Verify confirmation without placing the revealed contact address on the OS clipboard.
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: () => Promise.resolve() },
		});
		document.querySelector('section[aria-label="Contact"] button[aria-label="Copy email"]').click();
	});
	// A status nested in the button is flattened into its name, so require a sibling live region.
	await page.waitForFunction(() =>
		[...document.querySelectorAll('section[aria-label="Contact"] [role="status"]')].some(
			(status) => status.textContent.includes("Email copied") && !status.closest("button")
		)
	);
	const copied = await page.$eval('section[aria-label="Contact"]', (section) => {
		const button = section.querySelector('button[aria-label="Copy email"]');
		return {
			width: button.getBoundingClientRect().width,
			label: button.getAttribute("aria-label"),
		};
	});
	assert.equal(copied.width, control.width, "copy confirmation keeps its footprint");
	assert.equal(copied.label, control.label, "copy confirmation keeps its accessible name");
	await snapshot(page, "home-contact-copied", width, theme);
	report.cases.at(-1).copyControl = copied;
}

async function verifyReadingProgress(page, url, width, theme) {
	await page.goto(`${url}/blog/design-systems-that-earn-their-keep`, {
		waitUntil: "networkidle2",
	});
	await page.waitForSelector('[role="progressbar"]');
	await page.setViewport({ width, height: 40_000 });
	await page.evaluate(() => {
		window.scrollTo(0, 0);
		window.dispatchEvent(new Event("scroll"));
	});
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
	);
	await page.waitForFunction(() => {
		const value = Number(
			document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow")
		);
		return Number.isFinite(value) && value >= 0 && value <= 100;
	});
	const fit = await page.evaluate(() => ({
		range: document.documentElement.scrollHeight - innerHeight,
		value: Number(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow")),
	}));
	assert.equal(fit.range, 0, "the complete article fits in the probe viewport");
	assert.equal(fit.value, 0, "a zero scroll range has finite zero progress");
	await page.setViewport({ width, height: 1000 });
	await page.evaluate(() => window.scrollTo(0, 600));
	await page.waitForFunction(
		() => Number(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow")) > 0
	);
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
	const scrolled = await page.$eval('[role="progressbar"]', (element) => ({
		value: Number(element.getAttribute("aria-valuenow")),
		duration: getComputedStyle(element.firstElementChild).transitionDuration,
	}));
	assert.ok(scrolled.value > 0 && scrolled.value <= 100);
	assert.equal(Number.parseFloat(scrolled.duration), 0, "frequent scroll feedback has no tween");
	report.readingProgress.push({ width, theme, fit, scrolled });
}

async function verifyToc(page, url, width, theme) {
	await page.goto(`${url}/projects/byronwade-ui`, { waitUntil: "networkidle2" });
	const selector = 'nav[aria-label="On this page"] li:last-child a';
	await page.keyboard.press("Tab");
	await page.focus(selector);
	const link = await page.$eval(selector, (element) => ({
		href: element.getAttribute("href"),
		height: element.getBoundingClientRect().height,
		outline: getComputedStyle(element).outlineStyle,
		outlineWidth: getComputedStyle(element).outlineWidth,
	}));
	assert.ok(link.height >= 44);
	assert.ok(link.outline !== "none" && link.outlineWidth !== "0px");
	await page.keyboard.press("Enter");
	await page.waitForFunction((id) => document.activeElement.id === id, {}, link.href.slice(1));
	assert.equal(new URL(page.url()).hash, link.href);
	const position = await page.evaluate(() => ({
		top: document.activeElement.getBoundingClientRect().top,
		headerBottom: document.querySelector("body header").getBoundingClientRect().bottom,
	}));
	assert.ok(position.top >= position.headerBottom, "focused heading clears the header");
	await snapshot(page, "project-toc-focus", width, theme);
	report.cases.at(-1).keyboard = {
		...link,
		...position,
		hashAndFocusMoved: true,
		reducedMotion: true,
	};
}

async function verifyCase(browser, url, width, theme, fixture) {
	try {
		const page = await browser.newPage();
		page.setDefaultTimeout(15_000);
		page.setDefaultNavigationTimeout(20_000);
		let previewMode = "loading";
		let contactRequest;
		// A browser exception fails the run even when the state still renders.
		page.on("pageerror", (error) =>
			report.pageErrors.push({
				width,
				theme,
				url: page.url(),
				previewMode,
				message: error.message,
			})
		);
		await page.setViewport({ width, height: 1000 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
		await page.setRequestInterception(true);
		const respond = async (request) => {
			if (request.method() === "POST" && request.url().endsWith("/contact")) {
				contactRequest = request;
				return;
			}
			if (request.url().includes("/api/screenshot?")) {
				if (previewMode !== "loading") {
					// The real API returns a distinct image URL for each capture size.
					const capture = new URL(request.url()).searchParams;
					// Main #88 removed the portfolio images; any committed local JPEG serves the frame.
					const image = new URL("/images/analysis/figma-analysis.jpg", url);
					image.searchParams.set("width", capture.get("width"));
					image.searchParams.set("height", capture.get("height"));
					await request.respond({
						status: previewMode === "error" ? 503 : 200,
						contentType: "application/json",
						body: JSON.stringify({ url: image.href }),
					});
				}
				return;
			}
			assert.ok(!request.url().endsWith("/api/portfolio"), "portfolio must render on the server");
			if (request.url().startsWith(url)) {
				await request.continue();
			} else {
				await request.respond({ status: 204, body: "" });
			}
		};
		page.on("request", (request) => {
			respond(request).catch((error) => report.failures.push(error.message));
		});
		await verifyPortfolio(page, url, width, theme, fixture);
		await page.goto(`${url}/contact`, { waitUntil: "networkidle2" });
		await page.click('main button[type="submit"]');
		await page.waitForSelector('main input[aria-invalid="true"]');
		const invalid = await page.$eval('main input[aria-invalid="true"]', (element) => ({
			focused: element === document.activeElement,
			outline: getComputedStyle(element).outlineStyle,
			outlineWidth: Number.parseFloat(getComputedStyle(element).outlineWidth),
		}));
		assert.ok(
			invalid.focused && invalid.outline !== "none" && invalid.outlineWidth >= 2,
			"invalid field receives visible focus"
		);
		await snapshot(page, "contact-invalid", width, theme);
		await page.type('main input[name="name"]', "Browser verification");
		await page.type('main input[name="email"]', "visitor@example.test");
		await page.type(
			'main textarea[name="message"]',
			"A local browser verification draft. No message is sent."
		);
		const buttonWidth = await page.$eval(
			'main button[type="submit"]',
			(element) => element.getBoundingClientRect().width
		);
		await page.click('main button[type="submit"]');
		await page.waitForSelector('main form[aria-busy="true"]');
		await snapshot(page, "contact-pending", width, theme);
		assert.equal(
			await page.$eval(
				'main button[type="submit"]',
				(element) => element.getBoundingClientRect().width
			),
			buttonWidth,
			"pending keeps button width"
		);
		assert.ok(contactRequest, "contact request is intercepted before delivery");
		await contactRequest.respond({
			status: 503,
			contentType: "text/plain",
			body: "Local verification failure",
		});
		await page.waitForSelector('main form[aria-busy="false"]');
		assert.equal(
			await page.$eval('main textarea[name="message"]', (element) => element.value),
			"A local browser verification draft. No message is sent.",
			"failed submission preserves the draft"
		);
		await snapshot(page, "contact-failed", width, theme);
		const fields = await page.evaluate(() => {
			const read = (selector) => {
				const element = document.querySelector(selector);
				const style = getComputedStyle(element);
				return {
					background: style.backgroundColor,
					border: style.borderTopColor,
					radius: style.borderRadius,
					height: element.getBoundingClientRect().height,
					fontSize: Number.parseFloat(style.fontSize),
				};
			};
			return { input: read('main input[name="email"]'), select: read("main select") };
		});
		report.cases.at(-1).fields = fields;
		if (phase === "after") {
			assert.equal(fields.input.height, 44);
			assert.equal(fields.select.height, 44);
			assert.equal(
				fields.select.background,
				fields.input.background,
				"select shares field material"
			);
			assert.equal(fields.select.border, fields.input.border, "select shares field rim");
			assert.equal(fields.select.radius, fields.input.radius, "select shares field radius");
			if (width === 375) {
				assert.ok(fields.input.fontSize >= 16 && fields.select.fontSize >= 16);
			}
		}
		if (phase === "after") {
			await page.goto(`${url}/projects/thorbis-design`, { waitUntil: "domcontentloaded" });
			await page.waitForSelector('main [aria-busy="true"]');
			await snapshot(page, "preview-loading", width, theme);
			previewMode = "loaded";
			await page.reload({ waitUntil: "domcontentloaded" });
			await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'));
			await page.waitForSelector('main button[aria-label="Resize preview width"]');
			await snapshot(page, "preview-loaded", width, theme);
			if (width >= 768) {
				await page.click('main button[aria-label^="Mobile ("]');
				await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'));
				const address = await page.$eval("main span.break-all", (element) => ({
					height: element.getBoundingClientRect().height,
					lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
				}));
				assert.ok(address.height <= address.lineHeight * 2, "mobile preset keeps address readable");
				await snapshot(page, "preview-mobile-preset", width, theme);
				await page.click('main button[aria-label^="Desktop ("]');
				await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'));
			}
			await page.focus('main button[aria-label="Resize preview width"]');
			await page.keyboard.press("ArrowLeft");
			await snapshot(page, "preview-keyboard-resize", width, theme);
			await page.click('main button[aria-label="Enter fullscreen"]');
			await page.waitForSelector("dialog[open]");
			assert.equal(await page.$eval("dialog", (dialog) => dialog.matches(":modal")), true);
			await snapshot(page, "preview-fullscreen", width, theme);
			await page.keyboard.press("Escape");
			assert.equal(
				await page.evaluate(() => document.activeElement.getAttribute("aria-label")),
				"Enter fullscreen",
				"preview returns focus"
			);
			previewMode = "error";
			await page.goto(`${url}/projects/thorbis-design`, { waitUntil: "domcontentloaded" });
			await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'));
			await snapshot(page, "preview-error", width, theme);
			const small = await page.$$eval('main [data-slot="button"]', (elements) =>
				elements
					.filter((element) => element.getClientRects().length)
					.map((element) => ({
						name: element.textContent || element.getAttribute("aria-label"),
						width: element.getBoundingClientRect().width,
						height: element.getBoundingClientRect().height,
					}))
					.filter((rect) => rect.width < 44 || rect.height < 44)
			);
			assert.deepEqual(small, [], "standalone preview actions have 44px targets");
			if (width === 1440) {
				await verifyToc(page, url, width, theme);
			}
			await verifyInlineContact(page, url, width, theme);
			await verifyReadingProgress(page, url, width, theme);
		}
		console.log(`State checks: ${width} ${theme}`);
	} finally {
		writeEvidenceJson(`${destination}/states.json`, report);
	}
}

await withPortfolioFixture((fixture) =>
	withProductionServer(
		async (url) => {
			const cases = [375, 768, 1440].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			);
			await cases.reduce(async (previous, { width, theme }) => {
				await previous;
				await withBrowser(
					{ diagnostic: console.log },
					{ timeout: 30_000, protocolTimeout: 30_000 },
					(browser) => verifyCase(browser, url, width, theme, fixture)
				);
			}, Promise.resolve());
		},
		{ env: fixture.env }
	)
);
assert.deepEqual(report.pageErrors, [], "state checks raise no page errors");
if (phase === "after") {
	assert.deepEqual(report.failures, [], "bounded requests must offer recovery");
}
