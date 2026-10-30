import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

/**
 * Reading frame for a real project and a real post. The production server
 * renders the shipped pages. Line length stays on the document measure, heading
 * roles stay on the scale, a caption shares the article edge when a figure is
 * on the page, and the end of the page names a next step.
 */
const CASES = [
	{
		route: "/projects/thorbis-design",
		next: "Back to projects",
	},
	{
		route: "/blog/building-thorbis",
		next: "More writing",
	},
];
const WIDTHS = [390, 1440];

function readFrame(page) {
	return page.evaluate(() => {
		const visible = (element) =>
			element?.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
		const box = (element) => {
			const rect = element.getBoundingClientRect();
			return {
				left: Math.round(rect.left * 10) / 10,
				width: Math.round(rect.width * 10) / 10,
				top: Math.round(rect.top + window.scrollY),
			};
		};
		const article = document.querySelector("main article");
		const paragraph = article?.querySelector("p");
		const title = document.querySelector("main h1");
		const heading = article?.querySelector("h2");
		const minor = article?.querySelector("h3");
		const caption = document.querySelector("main figure figcaption");
		const next = [...document.querySelectorAll("main h2, main a")].find((element) =>
			element.textContent.replace(/\s+/g, " ").includes(document.body.dataset.readingNext ?? "")
		);
		return {
			viewport: document.documentElement.clientWidth,
			scrollWidth: document.documentElement.scrollWidth,
			title: visible(title) ? box(title) : null,
			paragraph: visible(paragraph) ? box(paragraph) : null,
			headingSize: heading ? getComputedStyle(heading).fontSize : null,
			minorSize: minor ? getComputedStyle(minor).fontSize : null,
			captionLeft: visible(caption) ? box(caption).left : null,
			nextTop: visible(next) ? box(next).top : null,
			articleBottom: article ? box(article).top + article.getBoundingClientRect().height : null,
		};
	});
}

function assertFrame(route, width, frame) {
	assert.ok(frame.title, `${route} ${width} has a title`);
	assert.ok(frame.paragraph, `${route} ${width} has a paragraph`);
	assert.ok(frame.scrollWidth <= frame.viewport + 1, `${route} ${width} overflows`);
	assert.ok(
		Math.abs(frame.paragraph.left - frame.title.left) <= 1,
		`${route} ${width} paragraph leaves the title edge`
	);
	assert.ok(frame.paragraph.width >= 240, `${route} ${width} line is clipped`);
	assert.ok(frame.paragraph.width <= 674, `${route} ${width} line leaves the 42rem measure`);
	assert.ok(
		width < 500 || frame.paragraph.width < frame.viewport - 200,
		`${route} ${width} line uses the viewport instead of the measure`
	);
	assert.equal(frame.headingSize, "20px", `${route} ${width} section heading`);
	if (frame.minorSize) {
		assert.equal(frame.minorSize, "16px", `${route} ${width} minor heading`);
	}
	if (frame.captionLeft !== null) {
		assert.ok(
			Math.abs(frame.captionLeft - frame.title.left) <= 1,
			`${route} ${width} caption leaves the reading edge`
		);
	}
	assert.ok(frame.nextTop !== null, `${route} ${width} has no next path`);
	assert.ok(
		frame.nextTop >= frame.articleBottom - 1,
		`${route} ${width} next path is not after the article`
	);
}

async function openReading(page, origin, route, next, width) {
	await page.setViewport({ width, height: 900 });
	await page.goto(`${origin}${route}`, { waitUntil: "load" });
	await page.evaluate((label) => {
		document.body.dataset.readingNext = label;
	}, next);
	await page.waitForSelector("main article p");
	return readFrame(page);
}

async function openSpecimen(page, origin, width) {
	await page.setViewport({ width, height: 900 });
	await page.goto(`${origin}/`, { waitUntil: "load" });
	await page.waitForSelector("main figure figcaption");
	return page.evaluate(() => {
		const title = document.querySelector("main h1");
		const caption = document.querySelector("main figure figcaption");
		const range = document.createRange();
		range.selectNodeContents(caption);
		const text = range.getBoundingClientRect();
		const titleBox = title.getBoundingClientRect();
		return {
			titleLeft: Math.round(titleBox.left * 10) / 10,
			captionLeft: Math.round(text.left * 10) / 10,
			captionWidth: Math.round(text.width * 10) / 10,
			scrollWidth: document.documentElement.scrollWidth,
			viewport: document.documentElement.clientWidth,
		};
	});
}

function assertSpecimen(width, specimen) {
	assert.ok(specimen.scrollWidth <= specimen.viewport + 1, `home ${width} overflows`);
	assert.ok(
		Math.abs(specimen.captionLeft - specimen.titleLeft) <= 1,
		`home ${width} specimen caption leaves the title edge (${specimen.captionLeft} vs ${specimen.titleLeft})`
	);
	assert.ok(specimen.captionWidth <= 674, `home ${width} caption leaves the measure`);
}

const INDEX_TITLES = [
	"Thorbis Network",
	"Thorbis Design",
	"Subfield",
	"Hollowveil",
	"Plumbing Code Playbook",
];

async function assertProjectIndex(page, origin) {
	await page.setViewport({ width: 390, height: 900 });
	await page.goto(`${origin}/projects`, { waitUntil: "load" });
	await page.waitForSelector("main h1");
	const indexText = await page.evaluate(() => document.querySelector("main").innerText);
	for (const title of INDEX_TITLES) {
		assert.ok(indexText.includes(title), `projects index is missing ${title}`);
	}
}

test("project and post reading stay on the measure with a next step", {
	timeout: 180_000,
}, async (context) => {
	await withProductionServer((origin) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 30_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (request.url().startsWith(origin)) {
					request.continue();
				} else {
					request.respond({ status: 204, body: "" });
				}
			});
			for (const { route, next } of CASES) {
				for (const width of WIDTHS) {
					// biome-ignore lint/performance/noAwaitInLoops: one page must navigate in order
					assertFrame(route, width, await openReading(page, origin, route, next, width));
				}
			}
			for (const width of WIDTHS) {
				// biome-ignore lint/performance/noAwaitInLoops: one page must navigate in order
				assertSpecimen(width, await openSpecimen(page, origin, width));
			}
			await assertProjectIndex(page, origin);
		})
	);
});
