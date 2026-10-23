import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { withPortfolioFixture } from "../fixtures/portfolio-browser.mjs";

// Visual regression for the four Showcase routes, as resolved styles rather than pixels.
// A committed screenshot would change with every new post or project and with each Chrome
// release's text rasterizing, so it would fail for reasons nobody should act on. This
// records what a design change actually moves: each visible element's resolved type,
// colour, border, corner, shadow and spacing, column counts, and the left edge and width
// of every box whose width the layout (not its text) decides. Text, heights, vertical
// positions and item counts are left out, and repeated cards collapse into one line, so
// new content passes while a token, primitive or layout change fails with a readable diff.
//
// After an intended design change: UPDATE_VISUAL_BASELINE=1 node --test <this file>, then
// review the baseline diff in the pull request like any other change.
const BASELINE = new URL("../fixtures/showcase-visual.json", import.meta.url);
const ROUTES = ["/", "/projects", "/portfolio", "/blog"];
const WIDTHS = [390, 1280];
const THEMES = ["light", "dark"];
const UPDATE = process.env.UPDATE_VISUAL_BASELINE === "1";
// /portfolio renders GitHub repositories on request. Fixed ones keep the record off
// the live account and its shared anonymous rate limit; they cover each row variant.
const repository = (id, name, fields) => ({
	id,
	name,
	full_name: `byronwade/${name}`,
	html_url: `https://github.com/byronwade/${name}`,
	description: null,
	stargazers_count: 0,
	forks_count: 0,
	pushed_at: "2026-09-01T00:00:00Z",
	fork: false,
	archived: false,
	...fields,
});
const REPOSITORIES = [
	repository(1, "thorbis", {
		description: "Field-service platform.",
		language: "TypeScript",
		stargazers_count: 12,
		forks_count: 3,
	}),
	repository(2, "drone-pi", { description: "Flight controller.", language: "Python" }),
	repository(3, "realistic-face", { language: "Rust", stargazers_count: 2 }),
	repository(4, "notes", { pushed_at: null }),
];

/** Same-origin requests only; third-party images and data answer empty in every run. */
async function localOnly(page, origin) {
	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (request.url().startsWith(origin)) {
			request.continue();
		} else {
			request.respond({ status: 204, body: "" });
		}
	});
}

/** Fonts loaded and no transition mid-flight, so every value read is the resting one. */
async function settle(page) {
	// Contact mounts after hydration plus a short delay; load and fonts can finish first.
	await page.waitForSelector("[data-site-footer] button", { visible: true });
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

/** One sorted, de-duplicated line per distinct visible element style in the page chrome and main. */
function fingerprint() {
	// Runs in the page, so every helper lives inside this function.
	const visibility = { checkOpacity: true, checkVisibilityCSS: true };
	const px = (value) => Math.round(Number.parseFloat(value) * 10) / 10;
	const EDGES = ["top", "right", "bottom", "left"];
	const CORNERS = ["top-left", "top-right", "bottom-right", "bottom-left"];
	const MEDIA = new Set(["IMG", "SVG", "PICTURE", "VIDEO", "IFRAME", "CANVAS"]);
	const CONTROL = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "LABEL", "SUMMARY"]);
	const box = (style, side, suffix = "") =>
		EDGES.map((edge) => px(style.getPropertyValue(`${side}-${edge}${suffix}`)));
	const sides = (values) => (values.every((value) => value === values[0]) ? [values[0]] : values);
	const transparent = (color) => color === "rgba(0, 0, 0, 0)" || color === "transparent";
	const ownText = (element) =>
		[...element.childNodes].some(
			(node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
		);
	const borders = (style) =>
		box(style, "border", "-width").map((width, index) =>
			width > 0 ? `${width} ${style.getPropertyValue(`border-${EDGES[index]}-color`)}` : "0"
		);
	const painted = (style) =>
		!transparent(style.backgroundColor) ||
		borders(style).some((border) => border !== "0") ||
		style.boxShadow !== "none" ||
		style.backgroundImage !== "none";

	// A box's width belongs to the layout when it fills its container: a block, grid or flex
	// box in normal flow, unless a flex parent sizes it to its content.
	const layoutSized = (element, style) => {
		if (style.display.startsWith("inline") || style.display === "contents") {
			return false;
		}
		if (style.position === "absolute" || style.position === "fixed" || style.float !== "none") {
			return false;
		}
		const parent = element.parentElement && getComputedStyle(element.parentElement);
		if (!parent?.display.endsWith("flex")) {
			return true;
		}
		if (parent.flexDirection.startsWith("row")) {
			return style.flexGrow !== "0";
		}
		// A column flex item fills the cross axis only when it stretches.
		const align = style.alignSelf === "auto" ? parent.alignItems : style.alignSelf;
		return align === "stretch" || align === "normal";
	};

	const layout = (style) => {
		const parts = [];
		if (style.display.endsWith("grid")) {
			parts.push(`cols ${style.gridTemplateColumns.split(" ").length}`);
		}
		if (style.display.endsWith("flex")) {
			parts.push(`${style.flexDirection} ${style.flexWrap} align ${style.alignItems}`);
		}
		if (style.display.endsWith("flex") || style.display.endsWith("grid")) {
			parts.push(`gap ${px(style.rowGap) || 0}/${px(style.columnGap) || 0}`);
		}
		const padding = sides(box(style, "padding"));
		if (padding.some((value) => value !== 0)) {
			parts.push(`pad ${padding.join(" ")}`);
		}
		// Horizontal margins already show in the left edge; vertical ones are the rhythm.
		const [top, , bottom] = box(style, "margin");
		if (top !== 0 || bottom !== 0) {
			parts.push(`margin ${top} ${bottom}`);
		}
		return parts;
	};

	const type = (style) => {
		const family = style.fontFamily.split(",")[0].replaceAll('"', "").trim();
		const leading = px(style.lineHeight) || style.lineHeight;
		const parts = [
			`font ${family} ${px(style.fontSize)}/${leading} ${style.fontWeight}`,
			`tracking ${style.letterSpacing}`,
			`color ${style.color}`,
		];
		if (style.textTransform !== "none") {
			parts.push(`case ${style.textTransform}`);
		}
		if (style.textDecorationLine !== "none") {
			parts.push(`decoration ${style.textDecorationLine}`);
		}
		if (style.textAlign !== "start" && style.textAlign !== "left") {
			parts.push(`align ${style.textAlign}`);
		}
		return parts;
	};

	const paint = (style) => {
		const parts = [`fill ${style.backgroundColor}`, `border ${sides(borders(style)).join(" | ")}`];
		if (style.boxShadow !== "none") {
			parts.push(`shadow ${style.boxShadow}`);
		}
		if (style.backgroundImage !== "none") {
			parts.push("background image");
		}
		return parts;
	};

	const shape = (style) => {
		const radius = sides(
			CORNERS.map((corner) => px(style.getPropertyValue(`border-${corner}-radius`)))
		);
		const parts = [];
		if (radius.some((value) => value !== 0)) {
			// rounded-full resolves to a huge length; name it instead.
			parts.push(`radius ${radius.map((value) => (value > 9999 ? "full" : value)).join(" ")}`);
		}
		if (Number(style.opacity) !== 1) {
			parts.push(`opacity ${style.opacity}`);
		}
		return parts;
	};

	const describe = (element) => {
		const style = getComputedStyle(element);
		const rect = element.getBoundingClientRect();
		const text = ownText(element);
		const filled = painted(style);
		const media = MEDIA.has(element.tagName.toUpperCase());
		const control = CONTROL.has(element.tagName.toUpperCase()) || element.hasAttribute("data-slot");
		const sized = layoutSized(element, style);
		if (!(text || filled || media || control || (sized && rect.width >= 120))) {
			return null;
		}
		const name = [
			element.tagName.toLowerCase(),
			element.dataset.slot && `[${element.dataset.slot}]`,
			element.dataset.profile && `[${element.dataset.profile}]`,
		]
			.filter(Boolean)
			.join("");
		const parts = [
			name,
			style.display,
			...layout(style),
			...(text || control ? type(style) : []),
			...(filled ? paint(style) : []),
			...shape(style),
		];
		if (media && rect.height > 0) {
			parts.push(`ratio ${Math.round((rect.width / rect.height) * 100) / 100}`);
		}
		if (sized) {
			parts.push(`x ${Math.round(rect.left)} w ${Math.round(rect.width)}`);
		}
		return parts.join(" · ");
	};

	const lines = new Set();
	for (const selector of ["[data-site-header]", "main", "[data-site-footer]"]) {
		const root = document.querySelector(selector);
		for (const element of [root, ...root.querySelectorAll("*")]) {
			const insideIcon = element.closest("svg") && element.tagName.toLowerCase() !== "svg";
			const rect = element.getBoundingClientRect();
			const shown = rect.width > 0 && rect.height > 0 && element.checkVisibility(visibility);
			const line = !insideIcon && shown && describe(element);
			if (line) {
				lines.add(line);
			}
		}
	}
	return [...lines].sort();
}

async function capture(browser, origin, route, width, theme) {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	try {
		page.setDefaultTimeout(20_000);
		// Pages share one browser; a cached 304 would hide the route's real status.
		await page.setCacheEnabled(false);
		await localOnly(page, origin);
		await page.setViewport(
			width < 768 ? { width, height: 844, isMobile: true, hasTouch: true } : { width, height: 900 }
		);
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
		const response = await page.goto(origin + route, { waitUntil: "load", timeout: 30_000 });
		assert.ok(response.ok(), `${route} answered ${response.status()}`);
		assert.equal(
			await page.evaluate(() => document.documentElement.classList.contains("dark")),
			theme === "dark",
			`${route} applies the ${theme} theme`
		);
		await settle(page);
		// The body, not the root: the root reserves a stable scrollbar gutter yet reports the full width.
		const viewport = await page.evaluate(() => document.body.clientWidth);
		const styles = await page.evaluate(fingerprint);
		assert.deepEqual(errors, [], `${route} ${width} ${theme} threw`);
		return { viewport, styles };
	} finally {
		await page.close();
	}
}

/** Lines only the baseline has, and lines only this run has, per case. */
function differences(expected, actual) {
	return Object.keys({ ...expected, ...actual }).flatMap((key) => {
		const before = new Set(expected[key]?.styles ?? []);
		const after = new Set(actual[key]?.styles ?? []);
		const removed = [...before].filter((line) => !after.has(line)).map((line) => `- ${line}`);
		const added = [...after].filter((line) => !before.has(line)).map((line) => `+ ${line}`);
		return removed.length + added.length === 0 ? [] : [`${key}`, ...removed, ...added];
	});
}

test("the four Showcase routes keep their resolved type, colour, spacing and layout", {
	timeout: 300_000,
}, async (context) => {
	const cases = ROUTES.flatMap((route) =>
		WIDTHS.flatMap((width) => THEMES.map((theme) => ({ route, width, theme })))
	);
	const actual = await withPortfolioFixture((fixture) => {
		fixture.setResponse({ status: 200, body: REPOSITORIES });
		return withProductionServer(
			(origin) =>
				withBrowser(context, { timeout: 30_000, protocolTimeout: 30_000 }, (browser) =>
					cases.reduce(
						async (pending, { route, width, theme }) => ({
							...(await pending),
							[`${route} ${width} ${theme}`]: await capture(browser, origin, route, width, theme),
						}),
						Promise.resolve({})
					)
				),
			{ env: fixture.env }
		);
	});
	for (const [key, { styles }] of Object.entries(actual)) {
		assert.ok(styles.length > 20, `${key} recorded only ${styles.length} styles`);
	}
	if (UPDATE) {
		await writeFile(BASELINE, `${JSON.stringify(actual, null, 2)}\n`);
		context.diagnostic(`Wrote ${cases.length} cases to ${BASELINE.pathname}`);
		return;
	}
	const expected = JSON.parse(await readFile(BASELINE, "utf8"));
	// A scrollbar or machine change moves every edge at once; say that, not 200 lines.
	const viewports = Object.keys(actual)
		.filter((key) => expected[key]?.viewport !== actual[key].viewport)
		.map((key) => `${key}: ${expected[key]?.viewport} → ${actual[key].viewport}`);
	assert.deepEqual(
		viewports,
		[],
		"Viewport content width differs from the baseline (scrollbar or environment change). Regenerate on the machine that runs the release checks."
	);
	const changed = differences(expected, actual);
	assert.deepEqual(
		changed,
		[],
		`Showcase styles changed. If intended, regenerate with UPDATE_VISUAL_BASELINE=1:\n${changed.join("\n")}`
	);
	context.diagnostic(`Compared ${cases.length} cases against ${BASELINE.pathname}`);
});
