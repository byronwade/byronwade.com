import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { withProductionServer } from "./production-session.mjs";

const destination = "docs/evidence/thorbis";
mkdirSync(destination, { recursive: true });
const axeResponse = await fetch(
	"https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js"
);
assert.ok(axeResponse.ok, "axe must load; a missing audit cannot pass");
const axeSource = await axeResponse.text();
const browser = await puppeteer.launch({
	executablePath:
		process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
	headless: true,
});
const report = {
	source: "46b6654d02fda9d8fde737395185c3141df52cd2",
	axe: "4.10.3",
	cases: [],
	keyboard: [],
	noJavaScript: [],
	routes: [],
	interactions: {},
};

// Browser cases stay serial so viewport/focus state and machine load stay isolated.
function serial(items, visit) {
	return items.reduce((previous, item) => previous.then(() => visit(item)), Promise.resolve());
}

async function auditCase(url, width, theme) {
	const page = await browser.newPage();
	await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
	await page.goto(url, { waitUntil: "networkidle2" });
	await page.evaluate(() => document.fonts.ready);
	await page.addScriptTag({ content: axeSource });
	const axe = await page.evaluate(async () => {
		const results = await window.axe.run(document, {
			runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
		});
		return results.violations.map(({ id, impact, nodes }) => ({
			id,
			impact,
			nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
		}));
	});
	const geometry = await page.evaluate(() => {
		const heading = document.querySelector("h1");
		const style = getComputedStyle(heading);
		return {
			overflow: document.documentElement.scrollWidth > innerWidth,
			headingTop: heading.getBoundingClientRect().top,
			headingSize: style.fontSize,
			font: style.fontFamily,
			h1Count: document.querySelectorAll("h1").length,
			headerCount: document.querySelectorAll("body header").length,
			navSize: getComputedStyle(document.querySelector('nav[aria-label="Primary"] a')).fontSize,
			cardTitleSize: getComputedStyle(document.querySelector('[data-slot="card-title"]')).fontSize,
		};
	});
	const contrast = await page.evaluate(() => {
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
		for (const element of document.querySelectorAll("main *, footer *")) {
			if (
				!element.getClientRects().length ||
				element.closest("[inert], .sr-only") ||
				![...element.childNodes].some(
					(node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
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
			context.fillStyle = style.color;
			context.fillRect(0, 0, 1, 1);
			const foreground = luminance([...context.getImageData(0, 0, 1, 1).data]);
			const ratio =
				(Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
			const large =
				Number.parseFloat(style.fontSize) >= 24 ||
				(Number.parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
			results.push({
				text: element.textContent.trim().slice(0, 55),
				ratio: Math.round(ratio * 100) / 100,
				required: large ? 3 : 4.5,
			});
		}
		return results;
	});
	const file = `home-${width}-${theme}.png`;
	await page.screenshot({ path: `${destination}/${file}`, fullPage: true });
	report.cases.push({ width, theme, axe, geometry, contrast, file });
	console.log(`Audited ${width}px ${theme}`);
	assert.equal(geometry.overflow, false, `overflow at ${width} ${theme}`);
	assert.equal(geometry.h1Count, 1);
	assert.equal(geometry.headingSize, "32px", "Thorbis heading role");
	assert.equal(geometry.navSize, "13px", "Thorbis navigation role survives class merging");
	assert.equal(geometry.cardTitleSize, "14px", "Thorbis card title role survives class merging");
	assert.ok(
		contrast.every(({ ratio, required }) => ratio >= required),
		JSON.stringify(contrast.filter(({ ratio, required }) => ratio < required))
	);
	assert.ok(geometry.headingTop < 350, "hero must begin near the top");
	assert.equal(
		axe.filter(({ impact }) => impact === "serious" || impact === "critical").length,
		0,
		JSON.stringify(axe)
	);
	return page;
}

async function compareReference(page, width, theme) {
	const reference = await browser.newPage();
	await reference.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
	await reference.goto("https://design.thorbis.com", { waitUntil: "networkidle2" });
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
	assert.deepEqual(local, upstream, "live/reference theme token parity");
	report.cases.at(-1).tokens = { local, upstream };
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
				};
			})
		);
	});
	assert.ok(
		steps.every(
			(step) =>
				!step.inert &&
				step.inViewport &&
				((step.outline !== "none" && step.outlineWidth !== "0px") || step.shadow !== "none")
		),
		JSON.stringify(steps)
	);
	await page.click('button[aria-label="Search (⌘K)"]');
	await page.keyboard.press("Escape");
	assert.equal(
		await page.evaluate(() => document.activeElement.getAttribute("aria-label")),
		"Search (⌘K)"
	);
	report.keyboard.push({ width, steps, searchFocusReturn: true });
}

async function checkInteractions(url) {
	const page = await browser.newPage();
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
	await page.screenshot({ path: `${destination}/contact-error-390.png`, fullPage: true });
	await page.click("footer button");
	assert.ok(await page.$('footer a[href^="mailto:"]'));
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
	};
	await page.close();
}

try {
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
				await page.close();
			}
		);
		await serial([1440, 390], async (width) => {
			const page = await browser.newPage();
			await page.setViewport({ width, height: 1000 });
			await page.setJavaScriptEnabled(false);
			await page.goto(url, { waitUntil: "networkidle2" });
			const visible = await page.$eval("h1", (element) => {
				let current = element;
				while (current) {
					const style = getComputedStyle(current);
					if (style.opacity === "0" || style.visibility === "hidden" || style.display === "none") {
						return false;
					}
					current = current.parentElement;
				}
				return element.getBoundingClientRect().top < 350;
			});
			assert.ok(visible, "no-JS content must be visible at first paint");
			await page.screenshot({ path: `${destination}/home-${width}-no-js.png` });
			report.noJavaScript.push({ width, visible });
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
				const page = await browser.newPage();
				const response = await page.goto(`${url}${path}`, { waitUntil: "networkidle2" });
				assert.equal(response.status(), 200);
				report.routes.push({
					path,
					status: response.status(),
					h1: await page.$eval("h1", (element) => element.textContent),
				});
				await page.close();
			}
		);
	});
} finally {
	writeFileSync(`${destination}/browser.json`, `${JSON.stringify(report, null, 2)}\n`);
	await browser.close();
}
