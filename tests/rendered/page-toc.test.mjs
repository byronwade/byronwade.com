import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const POST = "/blog/building-thorbis";
const LIT = 'nav[aria-label="On this page"] a[aria-current="location"]';

test("the docked outline lights nothing over the intro, then the section being read", {
	timeout: 120_000,
}, async (context) => {
	const seen = await withProductionServer((origin) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			await page.setViewport({ width: 1440, height: 900 });
			assert.ok((await page.goto(`${origin}${POST}`, { waitUntil: "load" })).ok());
			const lit = () =>
				page.evaluate(
					(selector) => document.querySelector(selector)?.getAttribute("href") ?? null,
					LIT
				);
			await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
			const atTop = await lit();

			const target = await page.evaluate(() => {
				const heading = document.querySelectorAll("article h2[id]")[1];
				window.scrollTo(0, window.scrollY + heading.getBoundingClientRect().top - 100);
				return heading.id;
			});
			await page.waitForFunction(
				(selector, href) => document.querySelector(selector)?.getAttribute("href") === href,
				{},
				LIT,
				`#${target}`
			);
			return { atTop, target, read: await lit() };
		})
	);

	assert.equal(seen.atTop, null, "no section is lit while the intro is on screen");
	assert.equal(seen.read, `#${seen.target}`, "the section under the reading line is lit");
});
