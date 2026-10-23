import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// The page title, the header and the footer share one left edge (the 42rem
// measure) at desktop widths, and no route scrolls sideways on a small phone. The
// narrowest phone is also checked with root text at 200%, stricter than WCAG 1.4.4 or
// 1.4.10 asks on its own. Buttons may grow to fit enlarged text, so at default text
// every visible button rendered on load must still be exactly the 44px target.
const ALIGNED_WIDTHS = [1440, 1280];
const PHONE_WIDTHS = [390, 360, 320];
const ENLARGED_TEXT = { width: 320, rootFontSize: "200%" };
const TARGET_HEIGHT = 44;
const TOLERANCE = 1;
const PAGE_ROUTE = /^\/(?!api\/|_)[^.]*$/;
// Routes the prerender manifest cannot list: a search with results, the not-found
// page, and a Figma file (its fallback renders without a token).
const EXTRA_ROUTES = [
	"/search?q=thorbis",
	"/this-route-does-not-exist",
	"/portfolio/figma/ExampleKey",
];

async function pageRoutes() {
	const manifest = JSON.parse(
		await readFile(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	const prerendered = Object.keys(manifest.routes).filter((path) => PAGE_ROUTE.test(path));
	assert.ok(prerendered.length > 10, "Run npm run build before checking layout");
	return [...prerendered.sort(), ...EXTRA_ROUTES];
}

/** Same-origin requests only; third-party calls answer empty so layout never waits on them. */
async function localOnly(page, url) {
	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (request.url().startsWith(url)) {
			request.continue();
		} else {
			request.respond({ status: 204, body: "" });
		}
	});
}

// Fonts change line breaks; reading a box afterwards forces a synchronous layout. No
// animation frame: one of the two tabs is always in the background, where none fire.
function settled(page) {
	return page.evaluate(() => document.fonts.ready.then(() => undefined));
}

function measure(page) {
	return page.evaluate(() => {
		const visibility = { checkOpacity: true, checkVisibilityCSS: true };
		const left = (element) => element && Math.round(element.getBoundingClientRect().left * 10) / 10;
		const title = [...document.querySelectorAll("main h1")].find((heading) =>
			heading.checkVisibility(visibility)
		);
		return {
			width: document.documentElement.clientWidth,
			scrollWidth: document.documentElement.scrollWidth,
			title: left(title),
			header: left(document.querySelector("[data-site-header]")),
			footer: left(document.querySelector("[data-site-footer]")),
			captions: [
				...document.querySelectorAll('[data-profile="evidence"] > figure > figcaption'),
			].map(left),
			buttons: [...document.querySelectorAll('[data-slot="button"]')]
				.filter((button) => button.checkVisibility(visibility))
				.map((button) => ({
					label: (button.getAttribute("aria-label") ?? button.textContent).trim().slice(0, 40),
					height: Math.round(button.getBoundingClientRect().height * 10) / 10,
				})),
		};
	});
}

/** Visible buttons that are not exactly the touch target's height at default text. */
function offTarget(buttons) {
	return buttons.filter((button) => Math.abs(button.height - TARGET_HEIGHT) > 0.5);
}

/** Runs `visit` over `items` one at a time, collecting what each returns. */
function serially(items, visit) {
	return items.reduce(
		async (previous, item) => [...(await previous), ...(await visit(item))],
		Promise.resolve([])
	);
}

/** Title, header and footer left edges at each desktop width, from one load. */
async function misalignedEdges(page, url, route) {
	await page.setViewport({ width: ALIGNED_WIDTHS[0], height: 900 });
	await page.goto(url + route, { waitUntil: "load" });
	return serially(ALIGNED_WIDTHS, async (width) => {
		// Same mobile flags, so resizing reflows the page instead of reloading it.
		await page.setViewport({ width, height: 900 });
		await settled(page);
		const { title, header, footer, captions, buttons } = await measure(page);
		const edges = [title, header, footer, ...captions];
		const aligned =
			edges.every((edge) => typeof edge === "number") &&
			Math.max(...edges) - Math.min(...edges) <= TOLERANCE;
		const misaligned = aligned ? [] : [{ route, width, title, header, footer, captions }];
		const tall = offTarget(buttons);
		return tall.length === 0 ? misaligned : [...misaligned, { route, width, buttons: tall }];
	});
}

/** The innermost elements whose right edge passes the viewport, to name the cause. */
function overflowing(page) {
	return page.evaluate(() => {
		const limit = document.documentElement.clientWidth;
		const past = [...document.body.querySelectorAll("*")].filter(
			(element) => element.getBoundingClientRect().right > limit + 1
		);
		return past
			.filter((element) => !past.some((other) => other !== element && element.contains(other)))
			.slice(0, 5)
			.map((element) => {
				const text = element.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
				const right = Math.round(element.getBoundingClientRect().right);
				return `${element.tagName.toLowerCase()}${text ? ` "${text}"` : ""} right=${right}`;
			});
	});
}

/** Document overflow at each phone width, then at 200% text, from one load with touch emulation. */
async function sidewaysScroll(page, url, route) {
	const phone = (width) => ({ width, height: 844, isMobile: true, hasTouch: true });
	const check = async (width, text) => {
		await page.setViewport(phone(width));
		await settled(page);
		const box = await measure(page);
		const tall = text === "100%" ? offTarget(box.buttons) : [];
		const failures = tall.length === 0 ? [] : [{ route, width, buttons: tall }];
		if (box.width === width && box.scrollWidth <= box.width) {
			return failures;
		}
		const causes = await overflowing(page);
		const { width: clientWidth, scrollWidth } = box;
		return [...failures, { route, width, text, clientWidth, scrollWidth, causes }];
	};
	await page.setViewport(phone(PHONE_WIDTHS[0]));
	await page.goto(url + route, { waitUntil: "load" });
	const standard = await serially(PHONE_WIDTHS, (width) => check(width, "100%"));
	await page.evaluate((size) => {
		document.documentElement.style.fontSize = size;
	}, ENLARGED_TEXT.rootFontSize);
	return [...standard, ...(await check(ENLARGED_TEXT.width, ENLARGED_TEXT.rootFontSize))];
}

test("every route keeps one edge, 44px buttons and no sideways scroll, even at 200% text", {
	timeout: 900_000,
}, async (context) => {
	const routes = await pageRoutes();
	const failures = await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 30_000 }, async (browser) => {
			const [desktop, phone] = await Promise.all([browser.newPage(), browser.newPage()]);
			await Promise.all(
				[desktop, phone].map((page) => {
					page.setDefaultTimeout(30_000);
					return localOnly(page, url);
				})
			);
			return serially(routes, async (route) => [
				...(await misalignedEdges(desktop, url, route)),
				...(await sidewaysScroll(phone, url, route)),
			]);
		})
	);
	assert.deepEqual(failures, [], "misaligned edges, off-target buttons or horizontal overflow");
	context.diagnostic(
		`Checked ${routes.length} routes at ${ALIGNED_WIDTHS.join("/")}, ${PHONE_WIDTHS.join("/")} and ${ENLARGED_TEXT.width} with ${ENLARGED_TEXT.rootFontSize} text`
	);
});
