import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// The page title, the header and the footer share one left edge (the 42rem
// measure) at desktop widths, and no route scrolls sideways on a small phone.
const ALIGNED_WIDTHS = [1440, 1280];
const PHONE_WIDTHS = [390, 360, 320];
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
		};
	});
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
		const { title, header, footer } = await measure(page);
		const edges = [title, header, footer];
		const aligned =
			edges.every((edge) => typeof edge === "number") &&
			Math.max(...edges) - Math.min(...edges) <= TOLERANCE;
		return aligned ? [] : [{ route, width, title, header, footer }];
	});
}

/** Document overflow at each phone width, from one load with touch emulation. */
async function sidewaysScroll(page, url, route) {
	const phone = (width) => ({ width, height: 844, isMobile: true, hasTouch: true });
	await page.setViewport(phone(PHONE_WIDTHS[0]));
	await page.goto(url + route, { waitUntil: "load" });
	return serially(PHONE_WIDTHS, async (width) => {
		await page.setViewport(phone(width));
		await settled(page);
		const box = await measure(page);
		const fits = box.width === width && box.scrollWidth <= box.width;
		return fits ? [] : [{ route, width, clientWidth: box.width, scrollWidth: box.scrollWidth }];
	});
}

test("every route keeps the title, header and footer on one edge without sideways scroll", {
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
	assert.deepEqual(failures, [], "misaligned edges or horizontal overflow");
	context.diagnostic(
		`Checked ${routes.length} routes at ${ALIGNED_WIDTHS.join("/")} and ${PHONE_WIDTHS.join("/")}`
	);
});
