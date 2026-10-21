import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { withProductionServer } from "./production-session.mjs";

const phase = process.argv[2];
if (!["before", "after"].includes(phase)) {
	throw new Error("Choose before or after evidence");
}
const destination = `docs/evidence/design-polish/${phase}`;
mkdirSync(destination, { recursive: true });
let axeSource;
if (phase === "after") {
	const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js");
	assert.ok(response.ok, "the pinned accessibility audit must load");
	axeSource = await response.text();
}
const routes = [
	["home", "/"],
	["projects", "/projects"],
	["project", "/projects/thorbis-design"],
	["blog", "/blog"],
	["post", "/blog/building-thorbis"],
	["resume", "/resume"],
	["portfolio", "/portfolio"],
	["contact", "/contact"],
	["search", "/search"],
	["search-results", "/search?q=design"],
	["search-empty", "/search?q=zzzz-no-match"],
	["privacy", "/privacy"],
	["terms", "/terms"],
	["not-found", "/design-polish-missing-page"],
];
if (phase === "after") {
	routes.push(
		["project-evidence", "/projects/byronwade-ui"],
		["post-technical", "/blog/design-systems-that-earn-their-keep"]
	);
}
const initialReport = {
	phase,
	head: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
	serverNotFoundBreadcrumb:
		phase === "after"
			? readFileSync(".next/server/app/_not-found.html", "utf8")
					.match(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1]
					.replace(/<[^>]+>/g, " ")
					.replace(/\s+/g, " ")
					.trim()
			: undefined,
	cases: [],
};
const resume = process.argv.includes("--resume");
const report = resume
	? JSON.parse(readFileSync(`${destination}/matrix.json`, "utf8"))
	: initialReport;
assert.equal(report.head, initialReport.head, "resume must use the same source revision");
const captured = (name, width, theme) =>
	resume &&
	report.cases.some(
		(entry) =>
			entry.name === name &&
			entry.width === width &&
			entry.theme === theme &&
			existsSync(`${destination}/${entry.file}`)
	);

function readGeometry() {
	const visible = (element) =>
		element.getClientRects().length && getComputedStyle(element).visibility === "visible";
	const label = (element) =>
		element.querySelector("[data-resume-email]")
			? "Email (copy)"
			: element.getAttribute("aria-label") ||
				element.getAttribute("name") ||
				element.textContent.trim().slice(0, 100);
	const targets = [
		...document.querySelectorAll(
			"main a[href], main button, main input, main select, main textarea"
		),
	]
		.filter(visible)
		.map((element) => {
			const rect = element.getBoundingClientRect();
			return {
				label: label(element),
				tag: element.tagName,
				role: element.getAttribute("role"),
				width: rect.width,
				height: rect.height,
				inlineText:
					element.matches("a") &&
					getComputedStyle(element).display === "inline" &&
					Boolean(element.closest("p, li")),
			};
		});
	return {
		breadcrumb: document
			.querySelector('nav[aria-label="Breadcrumb"]')
			?.textContent.replace(/\s+/g, " ")
			.trim(),
		documentHeight: document.documentElement.scrollHeight,
		footerBottom: document.querySelector("footer").getBoundingClientRect().bottom + scrollY,
		overflow: document.documentElement.scrollWidth > innerWidth,
		headings: [...document.querySelectorAll("main h1")].map((element) => ({
			text: element.textContent,
			size: getComputedStyle(element).fontSize,
		})),
		truncated: [...document.querySelectorAll("main *")]
			.filter(
				(element) =>
					visible(element) &&
					getComputedStyle(element).textOverflow === "ellipsis" &&
					element.scrollWidth > element.clientWidth
			)
			.map(label),
		buttonLinks: targets.filter((target) => target.tag === "A" && target.role === "button"),
		smallTargets: targets.filter((target) => target.width < 44 || target.height < 44),
		inputs: [...document.querySelectorAll("main input, main select, main textarea")].map(
			(element) => ({
				label: label(element),
				size: getComputedStyle(element).fontSize,
			})
		),
	};
}

async function settleLayout(page) {
	// Header hydration and font swap can change full-page bounds after DOM ready.
	await page.evaluate(
		() =>
			new Promise((resolve, reject) => {
				let previous = document.documentElement.scrollHeight;
				let stable = 0;
				let samples = 0;
				const sample = () => {
					const height = document.documentElement.scrollHeight;
					stable = height === previous ? stable + 1 : 0;
					previous = height;
					samples += 1;
					if (stable >= 4) {
						resolve();
					} else if (samples >= 40) {
						reject(new Error("Page bounds did not settle"));
					} else {
						setTimeout(sample, 150);
					}
				};
				setTimeout(sample, 150);
			})
	);
}

async function screenshot(page, file, attempt = 0) {
	await settleLayout(page);
	const buffer = await page.screenshot({ path: file, fullPage: true });
	const geometry = await page.evaluate(readGeometry);
	const screenshotHeight = Buffer.from(buffer).readUInt32BE(20);
	// DOM rectangles retain subpixels; PNG bounds and scrollHeight are integer pixels.
	if (
		screenshotHeight < geometry.documentHeight ||
		screenshotHeight < Math.floor(geometry.footerBottom)
	) {
		assert.ok(
			attempt < 2,
			`full-page image must include settled bounds: ${JSON.stringify({ screenshotHeight, documentHeight: geometry.documentHeight, footerBottom: geometry.footerBottom })}`
		);
		return screenshot(page, file, attempt + 1);
	}
	return { ...geometry, screenshotHeight };
}

async function capture(page, url, name, route, width, theme) {
	const errors = [];
	const onError = (error) => errors.push(error.message);
	page.on("pageerror", onError);
	console.log(`Capturing ${name} ${width} ${theme}`);
	// Wait for the document and its fonts, not unrelated telemetry or route prefetch.
	const response = await page.goto(`${url}${route}`, { waitUntil: "domcontentloaded" });
	await page.waitForSelector("main h1");
	await page.evaluate(() => document.fonts.ready);
	if (name === "resume") {
		await page.waitForSelector("[data-resume-email]");
	}
	if (name === "portfolio" || name === "project") {
		try {
			await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"]'), {
				timeout: 12_000,
			});
		} catch (error) {
			errors.push(`${name} did not leave loading: ${error.message}`);
		}
	}
	const file = `${name}-${width}-${theme}.png`;
	const geometry = await screenshot(page, `${destination}/${file}`);
	let accessibility;
	if (axeSource) {
		await page.addScriptTag({ content: axeSource });
		accessibility = await page.evaluate(async () => {
			const results = await window.axe.run({
				runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
			});
			return {
				version: results.testEngine.version,
				violations: results.violations.map(({ id, impact, nodes }) => ({
					id,
					impact,
					nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
				})),
				incomplete: results.incomplete.map(({ id }) => id),
			};
		});
	}
	report.cases.push({
		name,
		route,
		width,
		theme,
		status: response.status(),
		geometry,
		accessibility,
		errors,
		file,
	});
	page.off("pageerror", onError);
	console.log(`${phase}: ${name} ${width} ${theme}; overflow=${geometry.overflow}`);
}

await withProductionServer(async (url) => {
	// One browser per viewport; serial navigation avoids adding measurement contention.
	const cases = [375, 768, 1440].flatMap((width) =>
		["light", "dark"].map((theme) => ({ width, theme }))
	);
	await cases.reduce(async (previous, { width, theme }) => {
		await previous;
		if (routes.every(([name]) => captured(name, width, theme))) {
			return;
		}
		const browser = await puppeteer.launch({
			executablePath:
				process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
			headless: true,
		});
		try {
			report.chrome = await browser.version();
			const page = await browser.newPage();
			page.setDefaultNavigationTimeout(60_000);
			await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
			await page.emulateMediaFeatures([
				{ name: "prefers-color-scheme", value: theme },
				{ name: "prefers-reduced-motion", value: "reduce" },
			]);
			await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
			await routes.reduce(async (prior, [name, route]) => {
				await prior;
				if (captured(name, width, theme)) {
					return;
				}
				await capture(page, url, name, route, width, theme);
			}, Promise.resolve());
		} finally {
			await browser.close();
			writeEvidenceJson(`${destination}/matrix.json`, report);
		}
	}, Promise.resolve());
});
// Every page error fails, including on the 404 route: main #98 fixed its hydration mismatch.
if (phase === "after") {
	assert.equal(report.cases.length, routes.length * 6, "complete route/viewport/theme matrix");
	const failures = report.cases.filter(
		(entry) =>
			entry.geometry.overflow ||
			entry.geometry.headings.length !== 1 ||
			entry.geometry.truncated.length > 0 ||
			entry.geometry.buttonLinks.length > 0 ||
			entry.geometry.smallTargets.some((target) => !target.inlineText) ||
			entry.accessibility.violations.length > 0 ||
			entry.errors.length > 0 ||
			entry.status !== (entry.name === "not-found" ? 404 : 200)
	);
	assert.deepEqual(
		failures,
		[],
		"routes fit, keep one heading, readable labels and expected status, and raise no page errors"
	);
}
