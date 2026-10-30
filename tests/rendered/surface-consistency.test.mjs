import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { KEYED_BUILD_HINT } from "../fixtures/preview-build.mjs";

/**
 * The four surfaces that had drifted, measured in a real browser from a fresh
 * navigation. Sizes come from the CSS variables, not from a copied pixel list.
 */
const PHONE = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

test("topic pages, post endings, preview recovery and failures share roles", {
	timeout: 180_000,
}, async (context) => {
	assert.ok(
		!process.env.SCREENSHOTONE_ACCESS_KEY?.trim(),
		`Preview recovery is the keyless answer. ${KEYED_BUILD_HINT}`
	);
	await withProductionServer(async (origin) => {
		const previewHtml = await (await fetch(`${origin}/projects/thorbis-design`)).text();
		assert.ok(
			previewHtml.includes('site preview"'),
			`No project preview in this build. ${KEYED_BUILD_HINT}`
		);

		await withBrowser(context, { timeout: 20_000, protocolTimeout: 20_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			page.setDefaultNavigationTimeout(30_000);
			await page.setViewport(PHONE);
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (request.url().startsWith(origin)) {
					request.continue();
				} else {
					request.respond({ status: 204, body: "" });
				}
			});

			await page.goto(`${origin}/blog/topic/product-engineering`, {
				waitUntil: "domcontentloaded",
			});
			await page.waitForSelector("main h1");
			const topic = await page.evaluate(tokenPxSource(), "topic");
			assert.equal(topic.currentFont, topic.copy13, "Topic chips use the 13px meta role");
			assert.ok(topic.currentHeight >= 44, `Topic target is ${topic.currentHeight}px`);
			assert.equal(topic.countColor, topic.labelColor, "The selected count matches its label");
			assert.equal(topic.blur, false);

			// Touch emulation does not match :hover, and a colour transition would be
			// read mid-flight. A fine pointer with reduced motion shows the settled fill.
			// Parallel Chrome sessions can drop the emulation, so confirm it stuck.
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			assert.equal(
				await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
				true,
				"reduced motion emulation is active"
			);
			await page.setViewport({
				width: 1440,
				height: 900,
				isMobile: false,
				hasTouch: false,
				deviceScaleFactor: 1,
			});
			await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded" });
			await page.waitForSelector('a[href^="/blog/"]');
			const hover = await page.evaluate(() => {
				const row = document.querySelector('main a[href^="/blog/"]:not([href^="/blog/topic"])');
				const chip = document.querySelector('main a[href^="/blog/topic/"]');
				return { row: row?.getAttribute("href"), chip: chip?.getAttribute("href") };
			});
			await page.hover(`a[href="${hover.row}"]`);
			const rowFill = await page.$eval(
				`a[href="${hover.row}"]`,
				(element) => getComputedStyle(element).backgroundColor
			);
			await page.hover(`a[href="${hover.chip}"]`);
			const chipFill = await page.$eval(
				`a[href="${hover.chip}"]`,
				(element) => getComputedStyle(element).backgroundColor
			);
			assert.notEqual(rowFill, "rgba(0, 0, 0, 0)", "A fine pointer shows the row hover fill");
			assert.equal(chipFill, rowFill, "Topic hover fill matches an index row");
			await page.mouse.down();
			const pressed = await page.$eval(
				`a[href="${hover.chip}"]`,
				(element) => getComputedStyle(element).backgroundColor
			);
			await page.mouse.up();
			assert.equal(pressed, chipFill, "The press fill matches the hover fill");

			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			const motion = await page.evaluate((selector) => {
				const element = document.querySelector(selector);
				return {
					duration: getComputedStyle(element).transitionDuration,
					reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
				};
			}, `a[href="${hover.chip}"]`);
			assert.equal(motion.reduced, true, "reduced motion emulation is still active");
			assert.ok(
				motion.duration === "0s" ||
					motion.duration.split(",").every((part) => part.trim() === "0s"),
				motion.duration
			);

			await page.setViewport(PHONE);
			await page.goto(`${origin}/blog/building-thorbis`, {
				waitUntil: "domcontentloaded",
			});
			await page.waitForSelector("#more-writing");
			const ending = await page.evaluate(() => {
				const px = (name) => {
					const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
					const probe = document.createElement("div");
					probe.style.fontSize = raw;
					document.body.append(probe);
					const size = getComputedStyle(probe).fontSize;
					probe.remove();
					return size;
				};
				const heading = document.querySelector("#more-writing");
				const related = document.querySelector("#related-posts");
				const topics = document.querySelector("#post-topics");
				const link = heading?.parentElement?.querySelector("a");
				const title = link?.querySelector(".text-heading-16");
				const box = link?.getBoundingClientRect();
				return {
					heading: getComputedStyle(heading).fontSize,
					related: related ? getComputedStyle(related).fontSize : "",
					topics: topics ? getComputedStyle(topics).fontSize : "",
					title: title ? getComputedStyle(title).fontSize : "",
					height: box ? box.height : 0,
					width: box ? box.width : 0,
					heading20: px("--thorbis-text-heading-20"),
					heading16: px("--thorbis-text-heading-16"),
					overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
				};
			});
			assert.equal(ending.heading, ending.heading20);
			assert.equal(ending.related, ending.heading);
			assert.equal(ending.topics, ending.heading);
			assert.equal(ending.title, ending.heading16);
			assert.ok(ending.height >= 44 && ending.width >= 44, `${ending.width}x${ending.height}`);
			assert.equal(ending.overflow, false);

			await page.goto(`${origin}/projects/thorbis-design`, {
				waitUntil: "domcontentloaded",
			});
			await page.waitForFunction(
				() =>
					document
						.querySelector('section[aria-label$=" site preview"]')
						?.innerText.includes("Live preview is off"),
				{ timeout: 15_000 }
			);
			const recovery = await page.evaluate(() => {
				const px = (name) => {
					const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
					const probe = document.createElement("div");
					probe.style.fontSize = raw;
					document.body.append(probe);
					const size = getComputedStyle(probe).fontSize;
					probe.remove();
					return size;
				};
				const frame = document.querySelector('section[aria-label$=" site preview"]');
				const title = [...frame.querySelectorAll("p")].find((node) =>
					node.textContent.includes("Live preview is off")
				);
				const copy = [...frame.querySelectorAll("p")].find((node) =>
					node.textContent.includes("unaffected")
				);
				const action = [...frame.querySelectorAll("a, button")].find((node) =>
					node.textContent.includes("Open site")
				);
				const box = action?.getBoundingClientRect();
				const titleBox = title.getBoundingClientRect();
				const frameBox = frame.getBoundingClientRect();
				return {
					align: getComputedStyle(title).textAlign,
					inset: titleBox.left - frameBox.left,
					title: getComputedStyle(title).fontSize,
					copy: getComputedStyle(copy).fontSize,
					heading16: px("--thorbis-text-heading-16"),
					copy14: px("--thorbis-text-copy-14"),
					height: box?.height ?? 0,
					width: box?.width ?? 0,
					blur:
						frame.innerHTML.includes("blur-") || getComputedStyle(frame).filter.includes("blur"),
				};
			});
			assert.ok(
				recovery.align === "start" || recovery.align === "left",
				`Preview recovery aligns ${recovery.align}`
			);
			assert.ok(recovery.inset < 40, `Preview title starts ${recovery.inset}px into the frame`);
			assert.equal(recovery.title, recovery.heading16);
			assert.equal(recovery.copy, recovery.copy14);
			assert.ok(
				recovery.height >= 44 && recovery.width >= 44,
				`${recovery.width}x${recovery.height}`
			);
			assert.equal(recovery.blur, false);

			await assertTopicFits(page, origin, 320);
			await assertTopicFits(page, origin, 360);
			await assertTopicFits(page, origin, 390);

			await page.setViewport(PHONE);
			await page.goto(`${origin}/this-route-does-not-exist`, {
				waitUntil: "domcontentloaded",
			});
			const missing = await page.evaluate(() => {
				const px = (name) => {
					const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
					const probe = document.createElement("div");
					probe.style.fontSize = raw;
					document.body.append(probe);
					const size = getComputedStyle(probe).fontSize;
					probe.remove();
					return size;
				};
				const title = document.querySelector("main h1");
				const action = [...document.querySelectorAll("main a")].find((node) =>
					node.textContent.includes("Return home")
				);
				const box = action?.getBoundingClientRect();
				return {
					title: title ? getComputedStyle(title).fontSize : "",
					heading32: px("--thorbis-text-heading-32"),
					height: box?.height ?? 0,
				};
			});
			assert.equal(missing.title, missing.heading32);
			assert.ok(missing.height >= 44, `404 action is ${missing.height}px`);
		});
	});
});

async function assertTopicFits(page, origin, width) {
	await page.setViewport({ ...PHONE, width });
	await page.goto(`${origin}/blog/topic/product-engineering`, {
		waitUntil: "domcontentloaded",
	});
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth > window.innerWidth + 1
	);
	assert.equal(overflow, false, `${width}px topic page overflows`);
}

function tokenPxSource() {
	return () => {
		const px = (name) => {
			const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
			const probe = document.createElement("div");
			probe.style.fontSize = raw;
			document.body.append(probe);
			const size = getComputedStyle(probe).fontSize;
			probe.remove();
			return size;
		};
		const current = document.querySelector('main a[aria-current="page"]');
		const count = current?.querySelector("span");
		const box = current?.getBoundingClientRect();
		return {
			currentFont: current ? getComputedStyle(current).fontSize : "",
			copy13: px("--thorbis-text-copy-13"),
			currentHeight: box?.height ?? 0,
			countColor: count ? getComputedStyle(count).color : "",
			labelColor: current ? getComputedStyle(current).color : "",
			blur: document.body.innerHTML.includes("backdrop-blur"),
		};
	};
}
