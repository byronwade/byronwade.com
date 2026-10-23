import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const cases = [
	{ route: "/blog/scaling-plumbing-business", width: 390, theme: "light", kind: "link" },
	{ route: "/blog/scaling-plumbing-business", width: 1280, theme: "dark", kind: "link" },
	{ route: "/", width: 390, theme: "dark", kind: "email" },
	{ route: "/", width: 1280, theme: "light", kind: "email" },
	{
		route: "/blog/scaling-plumbing-business",
		width: 320,
		theme: "dark",
		kind: "link",
		textScale: 200,
	},
	{ route: "/", width: 320, theme: "light", kind: "email", textScale: 200 },
];

async function keyboardCopy(page, button) {
	await page.focus(button);
	await page.keyboard.press("Enter");
}

async function verifyCopy(browser, origin, scenario) {
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.setDefaultTimeout(10_000);
	try {
		await page.setCacheEnabled(false);
		await page.setViewport({ width: scenario.width, height: 900 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument((theme) => {
			localStorage.setItem("theme", theme);
			const fixture = { mode: "denied", writes: [], resolve: null };
			window.clipboardFixture = fixture;
			Object.defineProperty(navigator, "clipboard", {
				configurable: true,
				get: () =>
					fixture.mode === "missing"
						? undefined
						: {
								writeText: (value) => {
									fixture.writes.push(value);
									if (fixture.mode === "denied") {
										return Promise.reject(new DOMException("Fixture denial", "NotAllowedError"));
									}
									return new Promise((resolve) => {
										fixture.resolve = resolve;
									});
								},
							},
			});
		}, scenario.theme);
		await page.setRequestInterception(true);
		page.on("request", (request) => {
			if (request.url().startsWith(origin)) {
				request.continue();
			} else {
				request.respond({ status: 204, body: "" });
			}
		});
		assert.equal(
			(await page.goto(origin + scenario.route, { waitUntil: "networkidle0" })).status(),
			200
		);
		await page.evaluate((scale) => {
			document.documentElement.style.fontSize = `${scale}%`;
		}, scenario.textScale ?? 100);
		if (scenario.kind === "email") {
			await page.click("button::-p-text(Start a conversation)");
			await page.waitForSelector('textarea[name="message"]', { visible: true });
			await page.type('textarea[name="message"]', "Keep this unsent draft.");
		}
		const button =
			scenario.kind === "link"
				? 'button[aria-label="Copy link"]'
				: 'section[aria-label="Contact"] button:has(span.grid)';
		await page.waitForSelector(button, { visible: true });
		const originalDimensions = await page.$eval(button, (element) => ({
			width: element.getBoundingClientRect().width,
			height: element.getBoundingClientRect().height,
		}));
		await keyboardCopy(page, button);
		await page.waitForFunction(() =>
			[...document.querySelectorAll('[role="status"]')].some((status) =>
				status.textContent.includes("Couldn’t copy")
			)
		);
		const failure = await page.evaluate(() => {
			const status = [...document.querySelectorAll('[role="status"]')].find((element) =>
				element.textContent.includes("Couldn’t copy")
			);
			return {
				text: status.textContent,
				visible:
					status.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
					!status.classList.contains("sr-only"),
			};
		});
		assert.equal(failure.visible, true, "Copy denial has visible, announced recovery feedback");
		assert.ok(failure.text.includes(scenario.kind === "link" ? "browser" : "Reveal"));
		assert.equal(await page.$eval(button, (element) => element === document.activeElement), true);
		assert.ok(
			await page.$eval(
				button,
				(element) => Number.parseFloat(getComputedStyle(element).outlineWidth) >= 2
			),
			"Keyboard focus stays visible after copy failure"
		);
		assert.equal(await page.$eval(button, (element) => element.disabled), false);
		if (process.env.CLIPBOARD_PROOF_DIR) {
			await page.screenshot({
				path: join(
					process.env.CLIPBOARD_PROOF_DIR,
					`${scenario.kind}-${scenario.width}-${scenario.theme}-failure.png`
				),
				fullPage: false,
			});
		}

		// An absent API (e.g. an unsupported browser) has the same honest recovery.
		await page.evaluate(() => {
			window.clipboardFixture.mode = "missing";
		});
		await keyboardCopy(page, button);
		await page.waitForFunction(
			(selector) =>
				!document.querySelector(selector).disabled &&
				[...document.querySelectorAll('[role="status"]')].some((status) =>
					status.textContent.includes("Couldn’t copy")
				),
			{},
			button
		);

		await page.evaluate(() => {
			window.clipboardFixture.mode = "pending";
		});
		await keyboardCopy(page, button);
		await page.waitForFunction(
			(selector) => document.querySelector(selector).getAttribute("aria-busy") === "true",
			{},
			button
		);
		assert.equal(
			await page.$eval(button, (element) => element.getAttribute("aria-disabled")),
			"true"
		);
		assert.equal(await page.$eval(button, (element) => element === document.activeElement), true);
		await page.keyboard.press("Enter");
		assert.equal(
			await page.evaluate(() => window.clipboardFixture.writes.length),
			2,
			"Repeated activation does not duplicate a pending write"
		);
		assert.equal(
			await page.evaluate(() =>
				[...document.querySelectorAll('[role="status"]')].some((status) =>
					status.textContent.toLowerCase().includes("copied")
				)
			),
			false,
			"No copy confirmation before the write resolves"
		);
		await page.evaluate(() => window.clipboardFixture.resolve());
		await page.waitForFunction(() =>
			[...document.querySelectorAll('[role="status"]')].some((status) =>
				status.textContent.toLowerCase().includes("copied")
			)
		);
		assert.equal(
			await page.$eval(button, (element) => element.getAttribute("aria-label")),
			`Copy ${scenario.kind}`
		);
		const dimensions = await page.$eval(button, (element) => ({
			width: element.getBoundingClientRect().width,
			height: element.getBoundingClientRect().height,
		}));
		assert.ok(dimensions.height >= 44 && dimensions.width >= 44);
		assert.deepEqual(dimensions, originalDimensions, "Confirmation does not resize the control");
		if (process.env.CLIPBOARD_PROOF_DIR) {
			await page.screenshot({
				path: join(
					process.env.CLIPBOARD_PROOF_DIR,
					`${scenario.kind}-${scenario.width}-${scenario.theme}-success.png`
				),
				fullPage: false,
			});
		}
		const writes = await page.evaluate(() => window.clipboardFixture.writes);
		assert.equal(writes.length, 2, "Only the explicit denied and retry attempts reach the API");
		if (scenario.kind === "link") {
			assert.equal(writes[1], await page.$eval('link[rel="canonical"]', (element) => element.href));
		} else {
			await page.click('section[aria-label="Contact"] button::-p-text(Click to reveal email)');
			const revealed = await page.$eval(
				'section[aria-label="Contact"] a[href^="mailto:"]',
				(element) => element.getAttribute("href").slice(7)
			);
			assert.equal(writes[1], revealed);
			assert.equal(
				await page.$eval(
					'section[aria-label="Contact"] a[href^="mailto:"]',
					(element) => element.scrollWidth <= element.clientWidth
				),
				true,
				"The manual-copy email fits inside its link"
			);
			assert.equal(
				await page.$eval('textarea[name="message"]', (field) => field.value),
				"Keep this unsent draft."
			);
			const factRows = await page.$eval(
				"main dl",
				(list) =>
					new Set([...list.children].map((item) => Math.round(item.getBoundingClientRect().top)))
						.size
			);
			assert.equal(
				factRows,
				scenario.textScale === 200 ? 3 : 1,
				"Home facts reflow for enlarged text and keep one row at ordinary sizes"
			);
			assert.equal(
				await page.$eval(
					'section[aria-label="Contact"] button[type="submit"]',
					(element) => element.scrollWidth <= element.clientWidth
				),
				true,
				"The send label fits at enlarged text sizes"
			);
			if (process.env.CLIPBOARD_PROOF_DIR) {
				await page.screenshot({
					path: join(
						process.env.CLIPBOARD_PROOF_DIR,
						`email-${scenario.width}-${scenario.theme}-manual.png`
					),
					fullPage: false,
				});
			}
		}
		await page.waitForFunction(() =>
			[...document.querySelectorAll('[role="status"]')].every(
				(status) => !status.textContent.toLowerCase().includes("copied")
			)
		);
		const overflow = await page.evaluate(() => ({
			width: innerWidth,
			scrollWidth: document.documentElement.scrollWidth,
			scrollX,
			offenders: [...document.querySelectorAll("body *")]
				.filter(
					(element) =>
						element.getBoundingClientRect().right + scrollX > innerWidth + 1 ||
						element.scrollWidth > element.clientWidth + 1
				)
				.slice(0, 12)
				.map((element) => ({
					tag: element.tagName,
					className: element.getAttribute("class"),
					right: element.getBoundingClientRect().right,
					scrollWidth: element.scrollWidth,
					clientWidth: element.clientWidth,
				})),
		}));
		assert.ok(overflow.scrollWidth <= overflow.width, JSON.stringify(overflow));
		assert.equal(
			await page.evaluate(() => document.documentElement.classList.contains("dark")),
			scenario.theme === "dark"
		);
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

test("copy controls explain failures and confirm only completed writes", {
	timeout: 180_000,
}, async (context) => {
	await withProductionServer((origin) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			await cases.reduce(async (previous, scenario) => {
				await previous;
				await context.test(
					`${scenario.kind} ${scenario.width}px ${scenario.theme}`,
					{ timeout: 35_000 },
					() => verifyCopy(browser, origin, scenario)
				);
			}, Promise.resolve());
		})
	);
});
