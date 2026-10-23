import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { assertThorbisHome, readThorbisHome } from "../../scripts/thorbis-home-contract.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const SPECIMEN = 'main [data-slot="sheet"] h2';
const PRIMARY = 'nav[aria-label="Primary"] a[href="/projects"]';
const MISSING_NAVIGATION = /offered navigation/;
const WRONG_SPECIMEN_TYPE = /specimen title role/;
const MISSING_SPECIMEN = /Missing Thorbis home role/;
const WRONG_NAVIGATION_TYPE = /visible navigation role/;

test("Thorbis home audit measures current type roles and the offered navigation", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer((url) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(20_000);
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			const cases = [1440, 768, 390, 320].flatMap((width) =>
				["light", "dark"].map((theme) => ({ width, theme }))
			);
			// One tab owns viewport, theme and focus; these probes must stay serial.
			await cases.reduce(async (previous, { width, theme }) => {
				await previous;
				await context.test(`${width}px ${theme}`, async () => {
					await page.setViewport({ width, height: 1000 });
					await page.evaluateOnNewDocument((value) => localStorage.setItem("theme", value), theme);
					await page.goto(url, { waitUntil: "networkidle2" });
					await page.evaluate(() => document.fonts.ready);
					const geometry = await readThorbisHome(page);
					assertThorbisHome(geometry);
					assert.equal(geometry.navigation.primaryVisible, width >= 768);
					assert.equal(
						await page.evaluate(() => document.documentElement.classList.contains("dark")),
						theme === "dark"
					);
				});
			}, Promise.resolve());
			await context.test(
				"hidden desktop typography cannot stand in for mobile navigation",
				async () => {
					await page.$eval(PRIMARY, (link) => {
						link.style.fontSize = "29px";
					});
					assertThorbisHome(await readThorbisHome(page));
					await page.$eval("[data-site-menu]", (menu) => {
						menu.style.display = "none";
					});
					const geometryWithoutNavigation = await readThorbisHome(page);
					assert.throws(() => assertThorbisHome(geometryWithoutNavigation), MISSING_NAVIGATION);
				}
			);
			await page.setViewport({ width: 1440, height: 1000 });
			await page.reload({ waitUntil: "networkidle2" });
			await context.test("a wrong specimen role fails the audit", async () => {
				await page.$eval(SPECIMEN, (heading) => {
					heading.style.fontSize = "18px";
				});
				const geometry = await readThorbisHome(page);
				assert.throws(() => assertThorbisHome(geometry), WRONG_SPECIMEN_TYPE);
				await page.$eval(SPECIMEN, (heading) => heading.removeAttribute("style"));
			});
			await context.test("a missing specimen fails with its current selector", async () => {
				await page.$eval(SPECIMEN, (heading) => heading.remove());
				await assert.rejects(readThorbisHome(page), MISSING_SPECIMEN);
			});
			await page.reload({ waitUntil: "networkidle2" });
			await context.test("navigation type and motion drift still fail", async () => {
				await page.$eval(PRIMARY, (link) => {
					link.style.fontSize = "18px";
				});
				const wrongType = await readThorbisHome(page);
				assert.throws(() => assertThorbisHome(wrongType), WRONG_NAVIGATION_TYPE);
				await page.$eval(PRIMARY, (link) => {
					link.style.removeProperty("font-size");
					link.style.transitionDuration = "900ms";
				});
				const wrongMotion = await readThorbisHome(page);
				assert.throws(() => assertThorbisHome(wrongMotion));
			});
			assert.deepEqual(errors, []);
		})
	);
});
