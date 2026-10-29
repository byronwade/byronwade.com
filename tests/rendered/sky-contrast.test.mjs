import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const AA = 4.5;
const ROUTES = ["/", "/projects/thorbis-design", "/blog/building-thorbis"];
const WIDTHS = [390, 1440];
const THEMES = ["light", "dark"];
const CASES = ROUTES.flatMap((route) =>
	WIDTHS.flatMap((width) => THEMES.map((theme) => ({ route, width, theme })))
);

function luminance(rgb) {
	const linear = rgb.map((channel) => {
		const value = channel / 255;
		return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

// Retain the computed ink (including opacity) and each text line's real geometry.
// A CSS-token contrast check alone cannot see a bright galaxy behind that line.
function textSamples() {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	const samples = [];
	while (walker.nextNode()) {
		const node = walker.currentNode;
		const element = node.parentElement;
		if (
			!node.textContent.trim() ||
			element.closest("script, style, noscript, svg, .sr-only, [aria-hidden='true']") ||
			!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
		) {
			continue;
		}
		context.clearRect(0, 0, 1, 1);
		context.fillStyle = getComputedStyle(element).color;
		context.fillRect(0, 0, 1, 1);
		const color = [...context.getImageData(0, 0, 1, 1).data];
		const clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
		for (let parent = element; parent; parent = parent.parentElement) {
			const style = getComputedStyle(parent);
			const bounds = parent.getBoundingClientRect();
			color[3] *= Number(style.opacity);
			// A Range includes ellipsized text outside its painted box. Sampling
			// that hidden tail would incorrectly compare it with adjacent controls.
			if (style.overflowX !== "visible") {
				clip.left = Math.max(clip.left, bounds.left);
				clip.right = Math.min(clip.right, bounds.right);
			}
			if (style.overflowY !== "visible") {
				clip.top = Math.max(clip.top, bounds.top);
				clip.bottom = Math.min(clip.bottom, bounds.bottom);
			}
		}
		const range = document.createRange();
		range.selectNodeContents(node);
		for (const rect of range.getClientRects()) {
			const x = Math.max(rect.x, clip.left);
			const y = Math.max(rect.y, clip.top);
			const width = Math.min(rect.right, clip.right) - x;
			const height = Math.min(rect.bottom, clip.bottom) - y;
			if (width > 0 && height > 0) {
				samples.push({
					text: node.textContent.trim().slice(0, 100),
					color,
					x,
					y,
					width,
					height,
				});
			}
		}
	}
	return samples;
}

function minimumContrast(sample, pixels) {
	const { data, info } = pixels;
	const alpha = sample.color[3] / 255;
	let minimum = Number.POSITIVE_INFINITY;
	// Every background pixel under every text line, not a few hand-picked dark spots.
	for (
		let y = Math.max(0, Math.floor(sample.y));
		y < Math.min(info.height, Math.ceil(sample.y + sample.height));
		y += 1
	) {
		for (
			let x = Math.max(0, Math.floor(sample.x));
			x < Math.min(info.width, Math.ceil(sample.x + sample.width));
			x += 1
		) {
			const offset = (y * info.width + x) * info.channels;
			const background = [data[offset], data[offset + 1], data[offset + 2]];
			const foreground = background.map(
				(channel, index) => sample.color[index] * alpha + channel * (1 - alpha)
			);
			const a = luminance(foreground);
			const b = luminance(background);
			minimum = Math.min(minimum, (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05));
		}
	}
	return minimum;
}

async function open(page, origin, route, width, theme) {
	await page.setCacheEnabled(false);
	await page.setViewport({ width, height: 1500, deviceScaleFactor: 1 });
	await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
	await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
	const response = await page.goto(origin + route, { waitUntil: "networkidle0" });
	assert.ok(response.ok(), `${route} answered ${response.status()}`);
	await page.evaluate(() => document.fonts.ready);
	await page.waitForSelector("main h1", { visible: true });
	const bands = await page.$$eval('img[src*="hubble-xdf-band"]', (images) =>
		images
			.filter((image) => image.checkVisibility())
			.map((image) => ({
				loaded: image.complete && image.naturalWidth > 0,
				src: image.getAttribute("src"),
			}))
	);
	assert.equal(bands.length, theme === "dark" ? 1 : 0);
	assert.ok(
		bands.every((band) => band.loaded),
		"the photograph must load before sampling"
	);
}

async function backgroundPixels(page) {
	// Hide glyph paint only: layout, colour-dependent surfaces and the sky stay intact.
	await page.addStyleTag({
		content:
			"* { -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; text-shadow: none !important; caret-color: transparent !important; }",
	});
	return sharp(Buffer.from(await page.screenshot()))
		.raw()
		.toBuffer({ resolveWithObject: true });
}

async function assertContrast(page, context) {
	const samples = await page.evaluate(textSamples);
	assert.ok(samples.length > 20, "sample real content, metadata and controls");
	const pixels = await backgroundPixels(page);
	const results = samples.map((sample) => ({
		text: sample.text,
		ratio: minimumContrast(sample, pixels),
	}));
	context.diagnostic(
		`${results.length} text lines, minimum ${Math.min(...results.map(({ ratio }) => ratio)).toFixed(3)}:1`
	);
	assert.deepEqual(
		results.filter(({ ratio }) => ratio < AA),
		[],
		"every sampled line must meet 4.5:1, without rounding up"
	);
}

test("pixel sampling clips hidden text tails and still detects bad visible contrast", async (context) => {
	await withBrowser(context, {}, async (browser) => {
		const page = await browser.newPage();
		try {
			await page.setViewport({ width: 390, height: 200, deviceScaleFactor: 1 });
			await page.setContent(
				"<style>body { margin: 0; background: white; color: black; } p { margin: 0; width: 80px; white-space: nowrap; overflow: hidden; } div { position: absolute; left: 100px; top: 0; width: 200px; height: 80px; background: black; }</style><p>Healthy text extending beyond its clipped box</p><div></div>"
			);
			const samples = await page.evaluate(textSamples);
			assert.equal(samples.length, 1);
			assert.ok(
				samples[0].x + samples[0].width <= 80,
				"exclude the hidden tail over the adjacent dark box"
			);
			const pixels = await backgroundPixels(page);
			assert.equal(minimumContrast(samples[0], pixels), 21);
			await page.$eval("p", (element) => {
				element.style.backgroundColor = "black";
			});
			assert.ok(
				minimumContrast(samples[0], await backgroundPixels(page)) < AA,
				"a bad background inside the visible clip must fail"
			);
		} finally {
			await page.close();
		}
	});
});

test("text holds AA over the rendered sky on home, a detail and an article outline, in both themes", async (context) => {
	await withProductionServer(
		(origin) =>
			withBrowser(context, {}, (browser) =>
				// Keep screenshots serial so the measured tab owns the foreground frame.
				CASES.reduce(
					(previous, { route, width, theme }) =>
						previous.then(() =>
							context.test(`${route} ${width} ${theme}`, async (subtest) => {
								const page = await browser.newPage();
								try {
									await open(page, origin, route, width, theme);
									await assertContrast(page, subtest);
								} finally {
									await page.close();
								}
							})
						),
					Promise.resolve()
				)
			),
		{ env: { SCREENSHOTONE_ACCESS_KEY: "" } }
	);
});

test("index row hover and keyboard feedback retain AA in both themes", async (context) => {
	const cases = WIDTHS.flatMap((width) => THEMES.map((theme) => ({ width, theme })));
	const row = 'main a[href="/projects/thorbis"]';
	await withProductionServer(
		(origin) =>
			withBrowser(context, {}, (browser) =>
				cases.reduce(
					(previous, { width, theme }) =>
						previous.then(() =>
							context.test(`${width} ${theme}`, async (subtest) => {
								const page = await browser.newPage();
								try {
									await open(page, origin, "/projects", width, theme);
									await page.hover(row);
									await assertContrast(page, subtest);
									await page.mouse.move(0, 0);
									await page.focus(row);
									await page.keyboard.press("Tab");
									await page.keyboard.down("Shift");
									await page.keyboard.press("Tab");
									await page.keyboard.up("Shift");
									assert.ok(
										await page.$eval(
											row,
											(element) =>
												element === document.activeElement && element.matches(":focus-visible")
										),
										"exercise actual keyboard focus"
									);
									await assertContrast(page, subtest);
								} finally {
									await page.close();
								}
							})
						),
					Promise.resolve()
				)
			),
		{ env: { SCREENSHOTONE_ACCESS_KEY: "" } }
	);
});

test("the sky ends inside the layout on short pages", async (context) => {
	await withProductionServer(
		(origin) =>
			withBrowser(context, {}, (browser) =>
				WIDTHS.reduce(
					(previous, width) =>
						previous.then(async () => {
							const page = await browser.newPage();
							try {
								await open(page, origin, "/search", width, "dark");
								await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
								const bounds = await page.$eval('img[src*="hubble-xdf-band"]', (image) => {
									const band = image.parentElement;
									return {
										sky: band.getBoundingClientRect().bottom,
										layout: band.parentElement.getBoundingClientRect().bottom,
									};
								});
								assert.ok(bounds.sky <= bounds.layout + 1, JSON.stringify({ width, ...bounds }));
							} finally {
								await page.close();
							}
						}),
					Promise.resolve()
				)
			),
		{ env: { SCREENSHOTONE_ACCESS_KEY: "" } }
	);
});
