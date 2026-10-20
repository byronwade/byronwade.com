import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { withProductionServer } from "./production-session.mjs";

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const destination = `docs/evidence/design-polish/${phase}/states`;
mkdirSync(destination, { recursive: true });
let axeSource;
if (phase === "after") {
	const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js");
	assert.ok(response.ok, "the pinned accessibility audit must load");
	axeSource = await response.text();
}
const report = {
	phase,
	head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
	cases: [],
	readingProgress: [],
	failures: [],
};
// Controlled browser fixtures exercise presentation; these never enter app data.
const repository = {
	id: 1,
	name: "thorbis-design-with-a-long-repository-name-for-reflow-verification",
	html_url: "https://github.com/byronwade/thorbis-design",
	description:
		"Thorbis design foundations. This deliberately long fixture checks that identity and supporting detail remain readable on a narrow screen.",
	stargazers_count: 0,
	forks_count: 0,
	language: "TypeScript",
	pushed_at: "2026-10-16T12:00:00Z",
	archived: true,
};

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
	if (axeSource) {
		if (!(await page.evaluate(() => Boolean(window.axe)))) {
			await page.addScriptTag({ content: axeSource });
		}
		const accessibility = await page.evaluate(async () => {
			const results = await window.axe.run({
				runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
			});
			return {
				violations: results.violations.map(({ id, impact, nodes }) => ({
					id,
					impact,
					targets: nodes.map(({ target }) => target),
				})),
				incomplete: results.incomplete.map(({ id }) => id),
			};
		});
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
		const copy = [...section.querySelectorAll("button")].find(
			(button) => button.textContent.trim() === "Copy"
		);
		const rect = copy.getBoundingClientRect();
		return {
			background: getComputedStyle(copy).backgroundColor,
			parentBackground: getComputedStyle(section).backgroundColor,
			width: rect.width,
			height: rect.height,
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
		[...document.querySelectorAll('section[aria-label="Contact"] button')]
			.find((button) => button.textContent.trim() === "Copy")
			.click();
	});
	// A status nested in the button is flattened into its name, so require a sibling live region.
	await page.waitForFunction(() =>
		[...document.querySelectorAll('section[aria-label="Contact"] [role="status"]')].some(
			(status) => status.textContent.includes("Email copied") && !status.closest("button")
		)
	);
	const copied = await page.$eval('section[aria-label="Contact"]', (section) => {
		const button = [...section.querySelectorAll("button")].find((element) =>
			element.textContent.trim().startsWith("Copy")
		);
		return {
			width: button.getBoundingClientRect().width,
			label: [...button.childNodes]
				.filter((node) => node.nodeType === Node.TEXT_NODE)
				.map((node) => node.textContent.trim())
				.join(""),
		};
	});
	assert.equal(copied.width, control.width, "copy confirmation keeps its footprint");
	assert.equal(copied.label, "Copy", "copy confirmation keeps its visible label");
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

async function verifyCase(url, width, theme) {
	const browser = await puppeteer.launch({
		executablePath:
			process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.setViewport({ width, height: 1000 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
		let mode = "empty";
		let previewMode = "loading";
		let contactRequest;
		await page.setRequestInterception(true);
		page.on("request", async (request) => {
			if (request.method() === "POST" && request.url().endsWith("/contact")) {
				contactRequest = request;
				return;
			}
			if (request.url().includes("/api/screenshot?")) {
				if (previewMode !== "loading") {
					// The real API returns a distinct image URL for each capture size.
					const capture = new URL(request.url()).searchParams;
					const image = new URL("/images/portfolio/thorbis-preview.jpg", url);
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
			if (!request.url().endsWith("/api/portfolio")) {
				await request.continue();
				return;
			}
			if (mode === "loading") {
				return;
			}
			await request.respond({
				status: mode === "error" ? 503 : 200,
				contentType: "application/json",
				// Mirrors /api/portfolio: `degraded` covers every provider, `githubFailed` only repositories.
				body: JSON.stringify({
					repos: ["populated", "partial", "provider"].includes(mode) ? [repository] : [],
					degraded: ["degraded", "partial", "provider"].includes(mode),
					githubFailed: ["degraded", "partial"].includes(mode),
				}),
			});
		});
		const states =
			phase === "after"
				? ["empty", "error", "populated", "partial", "provider"]
				: ["empty", "error", "populated"];
		await states.reduce(async (previous, next) => {
			await previous;
			mode = next;
			await page.goto(`${url}/portfolio`, { waitUntil: "networkidle2" });
			await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'));
			const state = await snapshot(page, `portfolio-${mode}`, width, theme);
			if (mode === "partial") {
				assert.equal(state.rows, 1);
				assert.ok(state.text.includes("Some GitHub data may be unavailable or stale"));
			}
			if (mode === "provider") {
				assert.equal(state.rows, 1);
				assert.ok(
					!(state.text.includes("GitHub data may be") || state.text.includes("Couldn")),
					"a Dribbble, Figma or stats failure is not a repository warning"
				);
			}
		}, Promise.resolve());
		if (phase === "after") {
			mode = "error";
			const refreshResponse = page.waitForResponse((response) =>
				response.url().endsWith("/api/portfolio")
			);
			await page.click("main header button");
			await refreshResponse;
			await page.waitForFunction(() => !document.querySelector("main header button:disabled"));
			const refresh = await snapshot(page, "portfolio-refresh-failed", width, theme);
			assert.equal(refresh.rows, 1, "failed refresh retains previous repositories");
			mode = "degraded";
			const degradedResponse = page.waitForResponse((response) =>
				response.url().endsWith("/api/portfolio")
			);
			await page.click("main header button");
			await degradedResponse;
			await page.waitForFunction(() => !document.querySelector("main header button:disabled"));
			const degraded = await snapshot(page, "portfolio-degraded-refresh", width, theme);
			assert.equal(degraded.rows, 1, "degraded empty refresh retains previous repositories");
			assert.ok(degraded.text.includes("previous results are still here"));
		}
		mode = "loading";
		await page.goto(`${url}/portfolio`, { waitUntil: "networkidle2" });
		await snapshot(page, "portfolio-loading", width, theme);
		// The existing request bound is 8s. Navigation is a separate cleanup path.
		await new Promise((resolve) => setTimeout(resolve, 9000));
		const timeout = await snapshot(page, "portfolio-timeout", width, theme);
		if (timeout.busy) {
			report.failures.push(`Portfolio remains loading after timeout at ${width} ${theme}`);
		}
		await page.goto(`${url}/contact`, { waitUntil: "networkidle2" });
		await page.click('main button[type="submit"]');
		await page.waitForSelector('main input[aria-invalid="true"]');
		const invalid = await page.$eval('main input[aria-invalid="true"]', (element) => ({
			focused: element === document.activeElement,
			outline: getComputedStyle(element).boxShadow,
		}));
		assert.ok(
			invalid.focused && invalid.outline !== "none",
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
			await page.waitForSelector('[role="dialog"][aria-modal="true"]');
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
		await browser.close();
		writeEvidenceJson(`${destination}/states.json`, report);
	}
}

await withProductionServer(async (url) => {
	const cases = [375, 768, 1440].flatMap((width) =>
		["light", "dark"].map((theme) => ({ width, theme }))
	);
	await cases.reduce(async (previous, { width, theme }) => {
		await previous;
		await verifyCase(url, width, theme);
	}, Promise.resolve());
});
if (phase === "after") {
	assert.deepEqual(report.failures, [], "bounded requests must offer recovery");
}
