import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const NON_NATIVE_ROLE_PATTERN = /role="button"/;
const CONTACT = 'section[aria-label="Contact"]';
const NAME = `${CONTACT} input[name="name"]`;
const CLOSE = `${CONTACT} button[aria-label="Close"]`;
const OPEN = "main button::-p-text(Start a conversation)";

test("the contact form keeps native submit-button semantics", async () => {
	const html = await readFile(
		new URL("../../.next/server/app/contact.html", import.meta.url),
		"utf8"
	);
	const buttons = (html.match(/<button\b[^>]*>/g) ?? []).filter((tag) =>
		tag.includes('type="submit"')
	);
	assert.equal(buttons.length, 1);
	assert.doesNotMatch(buttons[0], NON_NATIVE_ROLE_PATTERN);
});

async function assertFocused(page, selector) {
	await page.waitForFunction(
		(target) => document.querySelector(target) === document.activeElement,
		{},
		selector
	);
}

async function verifyInlineFocus(browser, origin, scenario) {
	const page = await browser.newPage();
	const errors = [];
	const posts = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.setDefaultTimeout(10_000);
	try {
		await page.setViewport({ width: scenario.width, height: 900 });
		await page.setCacheEnabled(false);
		await page.emulateMediaFeatures([
			{
				name: "prefers-reduced-motion",
				value: scenario.reducedMotion ? "reduce" : "no-preference",
			},
		]);
		await page.evaluateOnNewDocument(
			(theme) => localStorage.setItem("theme", theme),
			scenario.theme
		);
		await page.setRequestInterception(true);
		page.on("request", async (request) => {
			if (request.method() === "POST") {
				posts.push(request.url());
			}
			if (new URL(request.url()).origin === origin && request.method() === "GET") {
				await request.continue();
			} else {
				// This focus-only flow must never send a message or call a third party.
				await request.respond({ status: 204, body: "" });
			}
		});
		assert.equal(
			(await page.goto(origin, { waitUntil: "networkidle0", timeout: 20_000 })).status(),
			200
		);
		assert.equal(await page.$(CONTACT), null, "The form stays closed before visitor intent");
		assert.equal(
			await page.evaluate(() => document.activeElement === document.body),
			true,
			"The closed form must not take focus on initial load"
		);
		await page.evaluate((scale) => {
			document.documentElement.style.fontSize = `${scale}%`;
		}, scenario.textScale ?? 100);
		const trigger = await page.waitForSelector(OPEN);
		if (scenario.pointer) {
			await trigger.click();
		} else {
			await trigger.focus();
			await page.keyboard.press("Enter");
		}
		// Waiting for the form alone misses native Input regressions: require actual focus
		// before any test helper can move it, including on the first lazy-loaded opening.
		await assertFocused(page, NAME);
		const field = await page.$eval(NAME, (element) => {
			const box = element.getBoundingClientRect();
			return {
				visible: box.top >= 0 && box.bottom <= innerHeight,
				reachable:
					document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2) === element,
				labelled: [...element.labels].some((label) => label.textContent === "Name"),
				outlined: Number.parseFloat(getComputedStyle(element).outlineWidth) >= 2,
			};
		});
		assert.deepEqual(field, { visible: true, reachable: true, labelled: true, outlined: true });
		assert.equal(
			await page.evaluate(() => document.documentElement.classList.contains("dark")),
			scenario.theme === "dark"
		);
		await page.keyboard.type("Test Visitor");
		await page.keyboard.press("Tab");
		await assertFocused(page, `${CONTACT} input[name="email"]`);
		await page.keyboard.type("visitor@example.com");
		await page.keyboard.press("Tab");
		await assertFocused(page, `${CONTACT} select[name="topic"]`);
		await page.keyboard.press("ArrowUp");
		await page.keyboard.press("Tab");
		await assertFocused(page, `${CONTACT} textarea[name="message"]`);
		await page.keyboard.type("Keep this unsent draft.");
		const draft = await page.$$eval(`${CONTACT} [name]`, (fields) =>
			fields.map((element) => [element.name, element.value])
		);
		assert.deepEqual(Object.fromEntries(draft), {
			name: "Test Visitor",
			email: "visitor@example.com",
			topic: "design-system",
			message: "Keep this unsent draft.",
		});
		await page.keyboard.down("Shift");
		await [`${CONTACT} select[name="topic"]`, `${CONTACT} input[name="email"]`, NAME, CLOSE].reduce(
			async (previous, selector) => {
				await previous;
				await page.keyboard.press("Tab");
				await assertFocused(page, selector);
			},
			Promise.resolve()
		);
		await page.keyboard.up("Shift");
		await page.keyboard.press("Enter");
		await page.waitForSelector(CONTACT, { hidden: true });
		const returnedTrigger = await page.waitForSelector(OPEN);
		await page.waitForFunction(
			() =>
				document.activeElement instanceof HTMLButtonElement &&
				document.activeElement.textContent.includes("Start a conversation")
		);
		assert.equal(
			await returnedTrigger.evaluate((element) => element === document.activeElement),
			true,
			"Closing returns focus to Start a conversation"
		);
		// Reopen through the returned keyboard focus; do not repair it in the test.
		await page.keyboard.press("Enter");
		await assertFocused(page, NAME);
		assert.deepEqual(
			await page.$$eval(`${CONTACT} [name]`, (fields) =>
				fields.map((element) => [element.name, element.value])
			),
			draft,
			"Closing and reopening preserves every unsent field"
		);
		assert.equal(
			await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
			true
		);
		assert.deepEqual(posts, [], "Opening, typing and closing do not submit the form");
		assert.deepEqual(errors, [], "The focus lifecycle has no browser runtime errors");
	} finally {
		await page.close();
	}
}

test("home contact keeps keyboard focus through lazy opening, closing and draft recovery", {
	timeout: 300_000,
}, async (context) => {
	await withProductionServer((origin) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const scenarios = ["light", "dark"].flatMap((theme) =>
				[
					{ width: 1280, pointer: false, reducedMotion: false },
					{ width: 390, pointer: true, reducedMotion: true },
					{ width: 320, pointer: false, reducedMotion: true, textScale: 200 },
				].map((scenario) => ({ ...scenario, theme }))
			);
			// Browser focus and host resources need serial scenarios.
			await scenarios.reduce(async (previous, scenario) => {
				await previous;
				await context.test(
					`${scenario.width}px ${scenario.theme}, ${scenario.textScale ?? 100}% text`,
					{ timeout: 40_000 },
					() => verifyInlineFocus(browser, origin, scenario)
				);
			}, Promise.resolve());
		})
	);
});
