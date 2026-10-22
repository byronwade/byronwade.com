import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";
import { withResendFixture } from "../fixtures/resend-browser.mjs";

const STATUS = 'form p[aria-live="polite"]';
const IDEMPOTENCY_KEY = /^contact\/[a-f0-9-]{36}$/;
const scenarios = [
	{ route: "/contact", width: 390, theme: "light", stage: "headers", edit: false },
	{ route: "/contact", width: 1280, theme: "dark", stage: "body", edit: true },
	{ route: "/", width: 390, theme: "dark", stage: "body", edit: false },
	{ route: "/", width: 1280, theme: "light", stage: "headers", edit: true },
];

async function fillDraft(page) {
	await page.waitForSelector('form input[name="name"]', { visible: true });
	await page.type('input[name="name"]', "Test Visitor");
	await page.type('input[name="email"]', "visitor@example.com");
	await page.type('textarea[name="message"]', "Original draft.");
}

async function submitWithKeyboard(page) {
	await page.focus('button[type="submit"]');
	await page.keyboard.press("Enter");
}

async function submitForRecovery(page, origin, scenario, delivery, before) {
	if (scenario.stage !== "acknowledgement") {
		await submitWithKeyboard(page);
		await page.waitForSelector('form[aria-busy="true"]');
		if (scenario.edit) {
			await page.type('textarea[name="message"]', " Edited while sending.");
		}
		return;
	}
	const session = await page.createCDPSession();
	let deadline;
	try {
		// Pause the real action response, after the server has contacted the fixture.
		await session.send("Fetch.enable", {
			patterns: [{ urlPattern: origin + scenario.route, requestStage: "Response" }],
		});
		const paused = new Promise((resolve, reject) => {
			session.once("Fetch.requestPaused", resolve);
			deadline = setTimeout(() => reject(new Error("Action response did not pause")), 15_000);
		});
		const [response] = await Promise.all([paused, submitWithKeyboard(page)]);
		assert.equal(response.request.method, "POST");
		assert.ok(
			Object.keys(response.request.headers).some((name) => name.toLowerCase() === "next-action"),
			"The interrupted response belongs to a real Server Action"
		);
		assert.equal(response.responseStatusCode, 200);
		assert.equal(delivery.keys.length, before + 1, "The provider accepted the first request");
		assert.equal(await page.$eval("form", (form) => form.getAttribute("aria-busy")), "true");
		assert.equal(await page.$eval('button[type="submit"]', (button) => button.disabled), true);
		assert.equal(await page.$eval(STATUS, (status) => status.textContent), "Sending your message…");
		assert.equal(await page.$('[data-sonner-toast][data-type="success"]'), null);
		if (scenario.edit) {
			await page.type('textarea[name="message"]', " Edited while sending.");
		}
		await session.send("Fetch.failRequest", {
			requestId: response.requestId,
			errorReason: "ConnectionClosed",
		});
		await session.send("Fetch.disable");
	} finally {
		clearTimeout(deadline);
		session.off("Fetch.requestPaused");
		await session.detach();
	}
}

async function verifyRecovery(page, scenario) {
	await page.waitForFunction(
		(selector) => document.querySelector(selector)?.textContent.includes("Couldn't confirm"),
		{},
		STATUS
	);
	assert.equal(await page.$eval("form", (form) => form.getAttribute("aria-busy")), "false");
	assert.equal(await page.$eval('button[type="submit"]', (button) => button.disabled), false);
	assert.equal(
		await page.$eval('textarea[name="message"]', (field) => field.value),
		scenario.edit ? "Original draft. Edited while sending." : "Original draft."
	);
	assert.equal(await page.$eval('input[name="name"]', (field) => field.value), "Test Visitor");
	assert.equal(
		await page.$eval('input[name="email"]', (field) => field.value),
		"visitor@example.com"
	);
	assert.equal(await page.$eval(STATUS, (status) => status.getAttribute("role")), "status");
	assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
	assert.equal(
		await page.evaluate(() => document.documentElement.classList.contains("dark")),
		scenario.theme === "dark"
	);
	if (process.env.CONTACT_PROOF_DIR) {
		await page.screenshot({
			path: join(
				process.env.CONTACT_PROOF_DIR,
				`${scenario.width}-${scenario.theme}-${scenario.stage}.png`
			),
			fullPage: true,
		});
	}
}

async function verifyScenario(browser, origin, scenario, delivery) {
	delivery.stage = scenario.stage;
	const before = delivery.keys.length;
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.setDefaultTimeout(15_000);
	try {
		await page.setCacheEnabled(false);
		await page.setViewport({ width: scenario.width, height: 1000 });
		await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
		await page.evaluateOnNewDocument(
			(theme) => localStorage.setItem("theme", theme),
			scenario.theme
		);
		const response = await page.goto(origin + scenario.route, {
			waitUntil: "networkidle0",
			timeout: 20_000,
		});
		assert.ok(response.ok());
		if (scenario.route === "/") {
			await page.locator("button::-p-text(Start a conversation)").click();
		}
		await fillDraft(page);
		await page.evaluate((selector) => {
			window.contactAcknowledged = false;
			new MutationObserver(() => {
				if (
					document.querySelector(selector)?.textContent.includes("Sent.") ||
					document.querySelector('[data-sonner-toast][data-type="success"]')
				) {
					window.contactAcknowledged = true;
				}
			}).observe(document.body, { childList: true, characterData: true, subtree: true });
		}, STATUS);
		await submitForRecovery(page, origin, scenario, delivery, before);
		await verifyRecovery(page, scenario);
		assert.equal(delivery.keys.length, before + 1, "No automatic retry after an uncertain send");
		assert.equal(await page.evaluate(() => window.contactAcknowledged), false);
		const reveal = await page.waitForSelector("main button::-p-text(Click to reveal email)");
		await reveal.focus();
		await page.keyboard.press("Enter");
		await page.waitForSelector('main a[href^="mailto:"]');
		assert.equal(
			await page.$eval(
				'main a[href^="mailto:"]',
				(link) => link.getAttribute("href").slice(7) === link.textContent.trim()
			),
			true,
			"The direct email fallback still reveals through the keyboard"
		);
		delivery.stage = undefined;
		await submitWithKeyboard(page);
		await page.waitForFunction(
			(selector) => document.querySelector(selector)?.textContent.includes("Sent."),
			{},
			STATUS
		);
		assert.equal(delivery.keys.length, before + 2, "Only the explicit retry sends again");
		const [original, retry] = delivery.keys.slice(before);
		assert.match(original, IDEMPOTENCY_KEY);
		assert.equal(original === retry, !scenario.edit, "Only unchanged drafts reuse a key");
		assert.equal(await page.$eval('textarea[name="message"]', (field) => field.value), "");
		await page.waitForSelector('[data-sonner-toast][data-type="success"]');
		assert.equal(await page.evaluate(() => window.contactAcknowledged), true);
		await fillDraft(page);
		await submitWithKeyboard(page);
		await page.waitForFunction(
			(selector) => document.querySelector(selector)?.textContent.includes("Sent."),
			{},
			STATUS
		);
		assert.equal(delivery.keys.length, before + 3);
		assert.notEqual(delivery.keys.at(-1), retry, "A confirmed send ends the retry identity");
		assert.deepEqual(errors, []);
	} finally {
		await page.close();
	}
}

async function verifyContactRecovery(context, cases) {
	const delivery = { stage: undefined, keys: [] };
	await withResendFixture(
		(env) =>
			withProductionServer(
				(origin) =>
					withBrowser(context, { timeout: 30_000 }, (browser) =>
						// Each scenario owns the fixture state; browser work stays serial.
						cases.reduce(
							(pending, scenario) =>
								pending.then(() =>
									context.test(
										`${scenario.route} ${scenario.width} ${scenario.theme} ${scenario.stage}`,
										{ timeout: 25_000 },
										() => verifyScenario(browser, origin, scenario, delivery)
									)
								),
							Promise.resolve()
						)
					),
				{ env }
			),
		{
			handleEmail(request, response) {
				delivery.keys.push(request.headers["idempotency-key"]);
				if (delivery.stage === "headers") {
					return;
				}
				response.writeHead(200, { "Content-Type": "application/json" });
				if (delivery.stage === "body") {
					response.write('{"id":');
				} else {
					response.end(JSON.stringify({ id: "local-browser-fixture" }));
				}
			},
		}
	);
}

test(
	"both contact forms recover from stalled delivery without losing the draft",
	{
		timeout: 120_000,
	},
	(context) => verifyContactRecovery(context, scenarios)
);

test(
	"both contact forms recover from lost action acknowledgements without claiming success",
	{
		timeout: 90_000,
	},
	(context) =>
		verifyContactRecovery(
			context,
			scenarios.map((scenario) => ({ ...scenario, stage: "acknowledgement" }))
		)
);
