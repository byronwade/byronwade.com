import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const PREVIEW = 'section[aria-label$=" site preview"]';
const RESIZE = `${PREVIEW} button[aria-label="Resize preview width"]`;
const FULLSCREEN = `${PREVIEW} button[aria-label="Enter fullscreen"]`;

const TIMELINE_LIMIT = 40;

/**
 * Runs in the page before any script. A press that never starts resizing has several
 * causes (a missed target, a thrown capture call, a blur or lost capture resetting the
 * cursor), so the page keeps the evidence that tells them apart.
 */
function recordPressTimeline(limit) {
	const timeline = [];
	window.__pressTimeline = timeline;
	const push = (entry) => {
		timeline.push({ t: Math.round(performance.now()), ...entry });
		timeline.splice(0, timeline.length - limit);
	};
	const describe = (node) =>
		node instanceof Element
			? node.closest("button")?.getAttribute("aria-label") || node.tagName.toLowerCase()
			: String(node);
	// Bubble phase on window runs after React, so defaultPrevented shows the handler ran.
	for (const type of ["pointerdown", "pointerup", "pointercancel"]) {
		window.addEventListener(type, (event) =>
			push({
				type,
				target: describe(event.target),
				x: event.clientX,
				y: event.clientY,
				button: event.button,
				handled: event.defaultPrevented,
			})
		);
	}
	for (const type of ["gotpointercapture", "lostpointercapture"]) {
		window.addEventListener(type, (event) => push({ type, target: describe(event.target) }), true);
	}
	window.addEventListener("blur", (event) => {
		if (event.target === window) {
			push({ type: "blur" });
		}
	});
	window.addEventListener("focus", (event) => {
		if (event.target === window) {
			push({ type: "focus" });
		}
	});
	document.addEventListener("visibilitychange", () =>
		push({ type: "visibilitychange", state: document.visibilityState })
	);
	window.addEventListener("error", (event) => push({ type: "error", message: event.message }));
	document.addEventListener("DOMContentLoaded", () => {
		new MutationObserver(() => push({ type: "cursor", value: document.body.style.cursor })).observe(
			document.body,
			{ attributeFilter: ["style"] }
		);
	});
}

/** A press that never starts resizing reports what the page saw instead of only timing out. */
async function waitForResizeCursor(page) {
	try {
		await page.waitForFunction(() => document.body.style.cursor === "ew-resize");
	} catch (error) {
		const seen = await page
			.evaluate((selector) => {
				const timeline = window.__pressTimeline ?? [];
				const press = timeline.findLast((entry) => entry.type === "pointerdown");
				const hit = press && document.elementFromPoint(press.x, press.y);
				return {
					timeline,
					hit: hit ? (hit.closest("button")?.getAttribute("aria-label") ?? hit.tagName) : null,
					handles: [...document.querySelectorAll(selector)].map((handle) =>
						handle.getBoundingClientRect().toJSON()
					),
					hasFocus: document.hasFocus(),
					visibility: document.visibilityState,
					cursor: document.body.style.cursor,
				};
			}, RESIZE)
			.catch((reason) => ({ unavailable: String(reason) }));
		throw new Error(`Resizing never started after the press: ${JSON.stringify(seen)}`, {
			cause: error,
		});
	}
}

/** Successful local captures keep these control checks independent of the paid provider. */
async function withLoadedPreview(context, viewport, verify) {
	await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			page.setDefaultNavigationTimeout(20_000);
			await page.setViewport({
				width: viewport.width,
				height: 844,
				hasTouch: viewport.hasTouch ?? false,
			});
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			await page.evaluateOnNewDocument((theme) => {
				localStorage.setItem("theme", theme);
			}, viewport.theme);
			await page.evaluateOnNewDocument(recordPressTimeline, TIMELINE_LIMIT);
			const requests = [];
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const target = new URL(request.url());
				let response;
				if (target.pathname === "/api/screenshot") {
					requests.push(target.searchParams.get("width"));
					response = request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify({ url: `/api/screenshot/image${target.search}`, mode: "static" }),
					});
				} else if (target.pathname === "/api/screenshot/image") {
					response = request.respond({
						status: 200,
						contentType: "image/svg+xml",
						body: `<svg xmlns="http://www.w3.org/2000/svg" width="${target.searchParams.get("width")}" height="${target.searchParams.get("height")}"><rect width="100%" height="100%" fill="gray"/></svg>`,
					});
				} else {
					response = request.url().startsWith(url)
						? request.continue()
						: request.respond({ status: 204, body: "" });
				}
				response.catch((error) => errors.push(error.message));
			});
			await page.goto(`${url}/projects/thorbis`, { waitUntil: "networkidle0" });
			await waitForCapture(page, PREVIEW, 1920);
			await verify(page, requests);
			assert.deepEqual(errors, [], "No uncaught page errors or failed interceptions");
		})
	);
}

function waitForCapture(page, root, width) {
	return page.waitForFunction(
		(selector, expectedWidth) => {
			const preview = document.querySelector(selector);
			const image = preview?.querySelector("img");
			return (
				image?.complete &&
				image.naturalWidth === expectedWidth &&
				preview.querySelector("[aria-busy]").getAttribute("aria-busy") === "false"
			);
		},
		{},
		root,
		width
	);
}

function frameWidth(page) {
	return page.$eval(`${PREVIEW} [aria-busy]`, (frame) => frame.getBoundingClientRect().width);
}

function waitForWidth(page, width) {
	return page.waitForFunction(
		(selector, expected) =>
			Math.abs(document.querySelector(selector).getBoundingClientRect().width - expected) <= 1,
		{},
		`${PREVIEW} [aria-busy]`,
		width
	);
}

async function assertReadablePreviewChrome(page, root) {
	const clippedText = await page.$eval(`${root} [aria-busy]`, (viewport) => {
		function outsideBar(rect, bounds) {
			return (
				rect.left < Math.max(bounds.left, 0) - 1 ||
				rect.right > Math.min(bounds.right, window.innerWidth) + 1 ||
				rect.top < bounds.top - 1 ||
				rect.bottom > bounds.bottom + 1
			);
		}
		const frame = viewport.parentElement;
		const failures = [];
		for (const bar of [frame.firstElementChild, frame.lastElementChild]) {
			const bounds = bar.getBoundingClientRect();
			failures.push(
				...[...bar.querySelectorAll("button, a")]
					.filter((control) => control.checkVisibility())
					.filter((control) => outsideBar(control.getBoundingClientRect(), bounds))
					.map((control) => ({ control: control.getAttribute("aria-label") }))
			);
			const walker = document.createTreeWalker(bar, NodeFilter.SHOW_TEXT);
			let node = walker.nextNode();
			while (node) {
				if (
					node.textContent.trim() &&
					!node.parentElement.closest(".sr-only") &&
					node.parentElement.checkVisibility()
				) {
					const range = document.createRange();
					range.selectNodeContents(node);
					failures.push(
						...[...range.getClientRects()]
							.filter((rect) => outsideBar(rect, bounds))
							.map((rect) => ({
								text: node.textContent,
								rect: rect.toJSON(),
								bounds: bounds.toJSON(),
							}))
					);
				}
				node = walker.nextNode();
			}
		}
		return failures;
	});
	assert.deepEqual(
		clippedText,
		[],
		"Preview chrome text must fit its bar and the screen without clipping"
	);
}

test("Project preview chrome stays readable with enlarged text", {
	timeout: 180_000,
}, async (context) => {
	await ["light", "dark"]
		.flatMap((theme) => [320, 1280].map((width) => ({ theme, width })))
		.reduce(async (previous, viewport) => {
			await previous;
			await context.test(`${viewport.theme}/${viewport.width}`, async (scenario) => {
				await withLoadedPreview(scenario, viewport, async (page) => {
					await assertReadablePreviewChrome(page, PREVIEW);
					assert.equal(
						await page.$eval(
							`${PREVIEW} [aria-busy] + div`,
							(bar) => bar.getBoundingClientRect().height
						),
						28,
						"Normal text keeps the compact status bar"
					);
					await page.evaluate(() => {
						document.documentElement.style.fontSize = "200%";
					});
					// ResizeObserver must refit this desktop capture before measuring pointer targets.
					await page.waitForFunction(
						(selector) => {
							const preview = document.querySelector(selector);
							const frame = preview.querySelector("[aria-busy]").parentElement.parentElement;
							return (
								Math.abs(
									frame.getBoundingClientRect().width -
										Math.min(preview.getBoundingClientRect().width, 1280)
								) <= 1
							);
						},
						{},
						PREVIEW
					);
					await page.$eval(PREVIEW, (preview) => preview.scrollIntoView());
					if (process.env.PREVIEW_PROOF_DIR) {
						await page.screenshot({
							path: join(
								process.env.PREVIEW_PROOF_DIR,
								`${viewport.theme}-${viewport.width}-inline.png`
							),
						});
					}
					await assertReadablePreviewChrome(page, PREVIEW);
					const handle = await page.$(RESIZE);
					await handle.scrollIntoView();
					const box = await handle.boundingBox();
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down();
					try {
						await waitForResizeCursor(page);
						await page.waitForFunction(
							(selector) => document.querySelector(selector).textContent.includes("Resizing"),
							{},
							PREVIEW
						);
						await assertReadablePreviewChrome(page, PREVIEW);
					} finally {
						await page.mouse.up();
					}
					await page.focus(RESIZE);
					await page.keyboard.press("ArrowLeft");
					await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`);
					await assertReadablePreviewChrome(page, PREVIEW);
					await page.focus(FULLSCREEN);
					await page.keyboard.press("Enter");
					await page.waitForSelector("dialog[open]");
					await waitForCapture(page, "dialog", 1920);
					if (process.env.PREVIEW_PROOF_DIR) {
						await page.screenshot({
							path: join(
								process.env.PREVIEW_PROOF_DIR,
								`${viewport.theme}-${viewport.width}-fullscreen.png`
							),
						});
					}
					await assertReadablePreviewChrome(page, "dialog");
					await page.keyboard.press("Escape");
					await page.waitForSelector("dialog", { hidden: true });
					assert.equal(
						await page.$eval(FULLSCREEN, (trigger) => trigger === document.activeElement),
						true
					);
				});
			});
		}, Promise.resolve());
});

async function pressWithShift(page, key) {
	await page.keyboard.down("Shift");
	try {
		await page.keyboard.press(key);
	} finally {
		await page.keyboard.up("Shift");
	}
}

test("Project preview touch cancellation releases resizing and ignores later touches", {
	timeout: 120_000,
}, async (context) => {
	await withLoadedPreview(context, { theme: "dark", width: 390, hasTouch: true }, async (page) => {
		const handle = await page.$(`${RESIZE}:last-child`);
		await handle.scrollIntoView();
		const box = await handle.boundingBox();
		const client = await page.createCDPSession();
		const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
		await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
		await waitForResizeCursor(page);
		await client.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [{ ...point, x: point.x - 20 }],
		});
		await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`);
		await client.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
		await page.waitForFunction(() => document.body.style.cursor !== "ew-resize");
		const cancelledWidth = await frameWidth(page);
		assert.equal(await page.evaluate(() => document.body.style.userSelect), "");
		await client.send("Input.dispatchTouchEvent", {
			type: "touchStart",
			touchPoints: [{ x: 190, y: 700 }],
		});
		await client.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [{ x: 250, y: 700 }],
		});
		await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
		assert.equal(
			await frameWidth(page),
			cancelledWidth,
			"A later page gesture cannot resize the preview"
		);
	});
});

test("Project preview window blur ends a mouse drag", { timeout: 120_000 }, async (context) => {
	await withLoadedPreview(context, { theme: "light", width: 1280 }, async (page) => {
		const handle = await page.$(`${RESIZE}:last-child`);
		await handle.scrollIntoView();
		const box = await handle.boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await waitForResizeCursor(page);
		// OS/window deactivation has no CDP input primitive; dispatch only that lifecycle boundary.
		await page.evaluate(() => window.dispatchEvent(new Event("blur")));
		await page.waitForFunction(() => document.body.style.cursor !== "ew-resize");
		await page.mouse.up();
		assert.equal(await page.evaluate(() => document.body.style.userSelect), "");
	});
});

test("Project preview touch resize keeps its owning finger until that finger releases", {
	timeout: 120_000,
}, async (context) => {
	await withLoadedPreview(context, { theme: "dark", width: 1280, hasTouch: true }, async (page) => {
		const handle = await page.$(`${RESIZE}:last-child`);
		await handle.scrollIntoView();
		const box = await handle.boundingBox();
		const client = await page.createCDPSession();
		const centre = await page.$eval(PREVIEW, (preview) => {
			const rect = preview.getBoundingClientRect();
			return rect.left + rect.width / 2;
		});
		let primary = { id: 11, x: box.x + box.width / 2, y: box.y + box.height / 2 };
		const other = { id: 22, x: centre - 400, y: primary.y };
		await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [primary] });
		primary = { ...primary, x: centre + 250 };
		await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [primary] });
		await waitForWidth(page, 498);
		await client.send("Input.dispatchTouchEvent", {
			type: "touchStart",
			touchPoints: [primary, other],
		});
		await client.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [primary, { ...other, x: centre - 450 }],
		});
		await waitForWidth(page, 498);
		// CDP lists the contacts being released, rather than the contacts remaining.
		await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [other] });
		assert.equal(
			await page.evaluate(() => document.body.style.cursor),
			"ew-resize",
			"Releasing a different finger does not end the owning gesture"
		);
		primary = { ...primary, x: centre + 200 };
		await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [primary] });
		await waitForWidth(page, 398);
		await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
		await page.waitForFunction(() => document.body.style.cursor === "");
		assert.equal(await page.evaluate(() => document.body.style.userSelect), "");
	});
});

test("Project preview minimum width preserves its aspect ratio on a narrow screen", {
	timeout: 120_000,
}, async (context) => {
	await withLoadedPreview(context, { theme: "light", width: 320 }, async (page) => {
		const initial = await page.$eval(`${PREVIEW} [aria-busy]`, (frame) => ({
			width: frame.getBoundingClientRect().width,
			height: frame.getBoundingClientRect().height,
		}));
		await page.focus(RESIZE);
		await page.keyboard.press("ArrowLeft");
		await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`);
		const resized = await page.$eval(`${PREVIEW} [aria-busy]`, (frame) => ({
			width: frame.getBoundingClientRect().width,
			height: frame.getBoundingClientRect().height,
		}));
		assert.deepEqual(
			resized,
			initial,
			"A minimum larger than the container cannot stretch the image"
		);
		assert.equal(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
			true,
			"The minimum cannot cause sideways page scrolling"
		);
	});
});

test("Project preview mouse capture bounds both handles and restores page styles", {
	timeout: 180_000,
}, async (context) => {
	await ["light", "dark"].reduce(async (previous, theme) => {
		await previous;
		await context.test(theme, async (scenario) => {
			await withLoadedPreview(scenario, { theme, width: 1280 }, async (page, requests) => {
				const initial = await frameWidth(page);
				await page.evaluate(() => {
					document.body.style.cursor = "crosshair";
					document.body.style.userSelect = "text";
				});
				await ["first", "last"].reduce(async (prior, side) => {
					await prior;
					const handle = await page.$(`${RESIZE}:${side}-of-type`);
					await handle.scrollIntoView();
					let box = await handle.boundingBox();
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down({ button: "right" });
					assert.equal(await page.evaluate(() => document.body.style.cursor), "crosshair");
					await page.mouse.up({ button: "right" });
					await page.mouse.down();
					await waitForResizeCursor(page);
					const container = await page.$eval(PREVIEW, (preview) => {
						const rect = preview.getBoundingClientRect();
						return { centre: rect.left + rect.width / 2, left: rect.left, right: rect.right };
					});
					const y = box.y + box.height / 2;
					await page.mouse.move(container.centre, y);
					await waitForWidth(page, 318);
					await page.mouse.move(side === "first" ? container.left - 10 : container.right + 10, y);
					await waitForWidth(page, initial);
					await page.mouse.up();
					await page.waitForFunction(() => document.body.style.cursor === "crosshair");
					assert.equal(await page.evaluate(() => document.body.style.userSelect), "text");
					await page.mouse.move(container.centre, y);
					assert.equal(await frameWidth(page), initial, "Released movement cannot resize");
					box = await handle.boundingBox();
					await handle.evaluate((node) => {
						node.addEventListener(
							"pointerdown",
							(event) => {
								node.dataset.pointerId = String(event.pointerId);
							},
							{ once: true }
						);
					});
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down();
					await waitForResizeCursor(page);
					await page.mouse.move(container.centre + 250, y);
					await waitForWidth(page, 498);
					await handle.evaluate((node) =>
						node.releasePointerCapture(Number(node.dataset.pointerId))
					);
					await page.mouse.move(container.centre + 240, y);
					await page.waitForFunction(() => document.body.style.cursor === "crosshair");
					await page.mouse.up();
					await waitForWidth(page, 498);
					await page.focus(RESIZE);
					await page.keyboard.press("Home");
					await waitForWidth(page, initial);
				}, Promise.resolve());
				assert.deepEqual(requests, ["1920"], "Display resizing reuses the existing capture");
				const handle = await page.$(`${RESIZE}:last-child`);
				await handle.scrollIntoView();
				const box = await handle.boundingBox();
				await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
				await page.mouse.down();
				await waitForResizeCursor(page);
				await page.focus(RESIZE);
				await page.keyboard.press("Home");
				await page.waitForFunction(() => document.body.style.cursor === "crosshair");
				await page.mouse.up();
				await waitForWidth(page, initial);
				await page.mouse.down();
				await waitForResizeCursor(page);
				await page.focus('[data-site-header] a[href="/projects"]');
				await page.keyboard.press("Enter");
				await page.waitForFunction(() => location.pathname === "/projects");
				await page.waitForFunction(() => document.body.style.cursor === "crosshair");
				assert.equal(await page.evaluate(() => document.body.style.userSelect), "text");
				await page.mouse.up();
			});
		});
	}, Promise.resolve());
});

test("Project preview fullscreen contains focus and restores it on Escape and button exit", {
	timeout: 180_000,
}, async (context) => {
	await ["light", "dark"]
		.flatMap((theme) => [390, 1280].map((width) => ({ theme, width })))
		.reduce(async (previous, viewport) => {
			await previous;
			await context.test(`${viewport.theme}/${viewport.width}`, async (scenario) => {
				await withLoadedPreview(scenario, viewport, async (page) => {
					const originalOverflow = await page.evaluate(() => document.body.style.overflow);
					await page.focus(FULLSCREEN);
					await page.keyboard.press("Enter");
					await page.waitForSelector("dialog[open]");
					await waitForCapture(page, "dialog", 1920);
					assert.equal(
						await page.$eval("dialog", (dialog) => dialog.matches(":modal")),
						true,
						"The preview uses the native modal top layer"
					);
					assert.equal(
						await page.evaluate(() => document.activeElement.getAttribute("aria-label")),
						"Exit fullscreen",
						"Initial focus offers an immediate way out"
					);
					await page.focus("[data-site-header] a");
					assert.equal(
						await page.$eval("dialog", (dialog) => dialog.contains(document.activeElement)),
						true,
						"Background controls are inert even when asked to take focus"
					);
					await page.keyboard.press("Tab");
					assert.equal(
						await page.$eval("dialog a", (link) => link === document.activeElement),
						true,
						"Tab reaches the site's native link"
					);
					await pressWithShift(page, "Tab");
					assert.equal(
						await page.evaluate(() => document.activeElement.getAttribute("aria-label")),
						"Exit fullscreen",
						"Shift+Tab returns to the exit control"
					);
					await [false, false, false, false, true, true, true, true].reduce(
						async (prior, shift) => {
							await prior;
							if (shift) {
								await pressWithShift(page, "Tab");
							} else {
								await page.keyboard.press("Tab");
							}
							// Native dialogs permit browser chrome in the Tab cycle (W3C H102).
							// Chrome reports body as active there; background controls must never receive focus.
							assert.equal(
								await page.$eval(
									"dialog",
									(dialog) =>
										dialog.contains(document.activeElement) ||
										document.activeElement === document.body
								),
								true,
								"Tab navigation never reaches a background page control"
							);
						},
						Promise.resolve()
					);
					await page.focus('dialog button[aria-label="Exit fullscreen"]');
					await page.keyboard.press("Escape");
					await page.waitForSelector("dialog", { hidden: true });
					assert.equal(
						await page.$eval(FULLSCREEN, (trigger) => trigger === document.activeElement),
						true,
						"Escape returns focus to the inline trigger"
					);
					assert.equal(
						await page.evaluate(() => document.body.style.overflow),
						originalOverflow,
						"Escape restores the page's scroll behavior"
					);
					await page.keyboard.press("Enter");
					await page.waitForSelector("dialog[open]");
					await page.keyboard.press("Space");
					await page.waitForSelector("dialog", { hidden: true });
					assert.equal(
						await page.$eval(FULLSCREEN, (trigger) => trigger === document.activeElement),
						true,
						"The visible exit button also returns focus"
					);
				});
			});
		}, Promise.resolve());
});

test("Project preview fullscreen dismisses only gestures starting and ending on its padding", {
	timeout: 180_000,
}, async (context) => {
	await ["light", "dark"]
		.flatMap((theme) =>
			[390, 1280].flatMap((width) =>
				["mouse", "touch"].map((input) => ({ theme, width, input, hasTouch: input === "touch" }))
			)
		)
		.reduce(async (previous, viewport) => {
			await previous;
			await context.test(
				`${viewport.theme}/${viewport.width}/${viewport.input}`,
				async (scenario) => {
					await withLoadedPreview(scenario, viewport, async (page) => {
						const originalOverflow = await page.evaluate(() => document.body.style.overflow);
						assert.equal(
							await page.evaluate(() => document.documentElement.classList.contains("dark")),
							viewport.theme === "dark"
						);
						await page.focus(FULLSCREEN);
						await page.keyboard.press("Enter");
						await page.waitForSelector("dialog[open]");
						await waitForCapture(page, "dialog", 1920);
						await page.$eval("dialog", (dialog) => {
							dialog.dataset.trustedClicks = "0";
							dialog.addEventListener("click", (event) => {
								if (event.isTrusted) {
									dialog.dataset.trustedClicks = String(Number(dialog.dataset.trustedClicks) + 1);
								}
							});
						});
						const points = await page.$eval(
							"dialog",
							(dialog, input) => {
								const bar = dialog.querySelector("[aria-busy] + div").getBoundingClientRect();
								const bounds = dialog.getBoundingClientRect();
								if (input === "touch") {
									const content = dialog.firstElementChild.getBoundingClientRect();
									// Cross the padding edge within the tap slop, so Chrome keeps
									// implicit capture instead of cancelling for a scroll gesture.
									return {
										inside: { x: content.left + 2, y: content.top + 8 },
										padding: { x: content.left - 2, y: content.top + 8 },
									};
								}
								return {
									inside: { x: bar.left + 4, y: bar.top + bar.height / 2 },
									padding: { x: bounds.left + 2, y: bounds.top + 2 },
								};
							},
							viewport.input
						);
						assert.equal(
							await page.evaluate(
								({ padding }) => document.elementFromPoint(padding.x, padding.y)?.tagName,
								points
							),
							"DIALOG",
							"The dismissal target is the dialog padding"
						);
						const client = await page.createCDPSession();
						await [
							["inside", "inside"],
							["inside", "padding"],
							["padding", "inside"],
						].reduce(async (prior, [start, end], index) => {
							await prior;
							if (viewport.input === "touch") {
								await client.send("Input.dispatchTouchEvent", {
									type: "touchStart",
									touchPoints: [points[start]],
								});
								await client.send("Input.dispatchTouchEvent", {
									type: "touchMove",
									touchPoints: [points[end]],
								});
								await client.send("Input.dispatchTouchEvent", {
									type: "touchEnd",
									touchPoints: [],
								});
							} else {
								await page.mouse.move(points[start].x, points[start].y);
								await page.mouse.down();
								await page.mouse.move(points[end].x, points[end].y);
								await page.mouse.up();
							}
							// Let the discrete input update commit before asserting that nothing closed.
							await page.evaluate(
								() =>
									new Promise((resolve) =>
										requestAnimationFrame(() => requestAnimationFrame(resolve))
									)
							);
							assert.equal(
								await page.evaluate(() => document.querySelector("dialog")?.open ?? false),
								true,
								`${start} → ${end} must keep the preview open`
							);
							assert.equal(
								await page.$eval("dialog", (dialog) => Number(dialog.dataset.trustedClicks)),
								index + 1,
								"The browser must complete a real click, including after touch capture"
							);
						}, Promise.resolve());
						if (viewport.input === "touch") {
							await client.send("Input.dispatchTouchEvent", {
								type: "touchStart",
								touchPoints: [points.padding],
							});
							await client.send("Input.dispatchTouchEvent", {
								type: "touchCancel",
								touchPoints: [],
							});
							assert.equal(await page.$eval("dialog", (dialog) => dialog.open), true);
							await page.touchscreen.tap(points.padding.x, points.padding.y);
						} else {
							await page.mouse.click(points.padding.x, points.padding.y, { button: "right" });
							assert.equal(await page.$eval("dialog", (dialog) => dialog.open), true);
							await page.mouse.click(points.padding.x, points.padding.y);
						}
						await page.waitForSelector("dialog", { hidden: true });
						assert.equal(
							await page.$eval(FULLSCREEN, (trigger) => trigger === document.activeElement),
							true,
							"An intentional padding click closes and returns focus"
						);
						assert.equal(await page.evaluate(() => document.body.style.overflow), originalOverflow);
					});
				}
			);
		}, Promise.resolve());
});

test("Project preview keyboard width, reset and preset controls keep the capture in sync", {
	timeout: 180_000,
}, async (context) => {
	await ["light", "dark"].reduce(async (previous, theme) => {
		await previous;
		await context.test(theme, async (scenario) => {
			await withLoadedPreview(scenario, { theme, width: 1280 }, async (page, requests) => {
				const initial = await frameWidth(page);
				await page.focus(RESIZE);
				await page.keyboard.press("ArrowLeft");
				await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`);
				await waitForWidth(page, initial - 24);
				await pressWithShift(page, "ArrowLeft");
				await waitForWidth(page, initial - 104);
				await page.keyboard.press("ArrowRight");
				await waitForWidth(page, initial - 80);
				await page.keyboard.press("Home");
				await waitForWidth(page, initial);
				await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`, {
					hidden: true,
				});
				await page.keyboard.press("ArrowLeft");
				await page.focus(`${PREVIEW} button[aria-label="Reset preview width"]`);
				await page.keyboard.press("Enter");
				await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`, {
					hidden: true,
				});
				await waitForWidth(page, initial);
				assert.equal(
					await page.$eval(FULLSCREEN, (trigger) => trigger === document.activeElement),
					true,
					"Removing the reset button moves focus to the next toolbar control"
				);
				assert.deepEqual(requests, ["1920"], "Resizing the display never requests another capture");
				await [
					{ label: "Mobile", width: 375 },
					{ label: "Tablet", width: 768 },
					{ label: "Laptop", width: 1440 },
					{ label: "Desktop", width: 1920 },
				].reduce(async (prior, { label, width }) => {
					await prior;
					await page.focus(RESIZE);
					await page.keyboard.press("ArrowLeft");
					await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`);
					const button = `${PREVIEW} button[aria-label^="${label} ("]`;
					await page.focus(button);
					await page.keyboard.press("Enter");
					await waitForCapture(page, PREVIEW, width);
					await page.waitForSelector(`${PREVIEW} button[aria-label="Reset preview width"]`, {
						hidden: true,
					});
					assert.equal(
						await page.$eval(button, (control) => control.getAttribute("aria-pressed")),
						"true"
					);
					assert.equal(
						await page.$$eval(`${PREVIEW} [aria-pressed="true"]`, (controls) => controls.length),
						1
					);
					assert.equal(
						await page.$eval(button, (control) => control === document.activeElement),
						true
					);
				}, Promise.resolve());
				await page.focus(`${PREVIEW} button[aria-label^="Mobile ("]`);
				await page.keyboard.press("Enter");
				await waitForCapture(page, PREVIEW, 375);
				await page.focus(FULLSCREEN);
				await page.keyboard.press("Enter");
				await page.waitForSelector("dialog[open]");
				await waitForCapture(page, "dialog", 1920);
				await page.keyboard.press("Escape");
				await page.waitForSelector("dialog", { hidden: true });
				assert.equal(
					await page.$eval(`${PREVIEW} button[aria-label^="Desktop ("]`, (button) =>
						button.getAttribute("aria-pressed")
					),
					"true",
					"Fullscreen resets a narrow capture to desktop"
				);
				assert.deepEqual(
					requests,
					["1920", "375", "768", "1440"],
					"Returning to desktop reuses its capture URL"
				);
			});
		});
	}, Promise.resolve());
});

test("A stalled project preview offers recovery and keyboard Retry loads the image", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer(async (url) => {
		await withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			// Separate pages prevent a cached capture from bypassing the stalled request.
			await [
				{ width: 390, theme: "light" },
				{ width: 1280, theme: "dark" },
			].reduce(async (previous, { width, theme }) => {
				await previous;
				const page = await browser.newPage();
				page.setDefaultTimeout(10_000);
				await page.setViewport({ width, height: 844 });
				await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
				await page.evaluateOnNewDocument((nextTheme) => {
					localStorage.setItem("theme", nextTheme);
				}, theme);
				let resolutions = 0;
				const interceptionErrors = [];
				const pageErrors = [];
				page.on("pageerror", (error) => pageErrors.push(error.message));
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					let response;
					switch (new URL(request.url()).pathname) {
						case "/api/screenshot":
							resolutions += 1;
							if (resolutions === 1) {
								// Deliberately withhold headers. The application's real ten-second
								// deadline must end the fetch and reveal its existing recovery UI.
								return;
							}
							response = request.respond({
								status: 200,
								contentType: "application/json",
								body: JSON.stringify({
									url: "/api/screenshot/image?fixture=recovered",
									mode: "static",
								}),
							});
							break;
						case "/api/screenshot/image":
							response = request.respond({
								status: 200,
								contentType: "image/svg+xml",
								body: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="gray"/></svg>',
							});
							break;
						default:
							response = request.url().startsWith(url)
								? request.continue()
								: request.respond({ status: 204, body: "" });
					}
					response.catch((error) => interceptionErrors.push(error.message));
				});
				await page.goto(`${url}/projects/thorbis`, { waitUntil: "domcontentloaded" });
				await page.waitForSelector('section[aria-label$=" site preview"] [role="status"]');
				await page.waitForFunction(
					() => {
						const preview = document.querySelector('section[aria-label$=" site preview"]');
						return preview?.innerText.includes("Preview unavailable");
					},
					{ timeout: 20_000 }
				);
				const recovery = await page.$eval('section[aria-label$=" site preview"]', (preview) => {
					const retry = [...preview.querySelectorAll("button")].find(
						(button) => button.textContent.trim() === "Retry"
					);
					retry.focus();
					return {
						busy: preview.querySelector("[aria-busy]").getAttribute("aria-busy"),
						hasSiteLink: [...preview.querySelectorAll("a")].some(
							(link) => link.textContent.trim() === "Open site"
						),
						focused: document.activeElement === retry,
					};
				});
				assert.deepEqual(recovery, { busy: "false", hasSiteLink: true, focused: true });
				await page.keyboard.press("Enter");
				await page.waitForFunction(() => {
					const preview = document.querySelector('section[aria-label$=" site preview"]');
					const image = preview?.querySelector("img");
					return (
						image?.complete &&
						image.naturalWidth > 0 &&
						preview.querySelector("[aria-busy]").getAttribute("aria-busy") === "false"
					);
				});
				assert.equal(resolutions, 2, "Retry starts a fresh resolution after the deadline");
				assert.deepEqual(pageErrors, [], "No uncaught browser errors");
				assert.deepEqual(interceptionErrors, [], "All handled interceptions settle");
				context.diagnostic(JSON.stringify({ width, theme, resolutions, recovered: true }));
				await page.close();
			}, Promise.resolve());
		});
	});
});

test("Project preview recovery actions fit the narrow viewport", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			await page.setViewport({ width: 320, height: 844, isMobile: true, hasTouch: true });
			await page.setRequestInterception(true);
			const interceptionErrors = [];
			page.on("request", (request) => {
				let response;
				if (request.url().startsWith(`${url}/api/screenshot?`)) {
					response = request.respond({ status: 503, contentType: "application/json", body: "{}" });
				} else if (request.url().startsWith(url)) {
					response = request.continue();
				} else {
					response = request.respond({ status: 204, body: "" });
				}
				response.catch((error) => interceptionErrors.push(error.message));
			});
			await page.goto(`${url}/projects/thorbis`, { waitUntil: "networkidle0" });
			await page.waitForFunction(() =>
				document
					.querySelector('section[aria-label$=" site preview"]')
					?.innerText.includes("Preview unavailable")
			);
			// Both sizes share one page, so each measurement must finish before the next resize.
			await ["100%", "200%"].reduce(async (previous, fontSize) => {
				await previous;
				await page.evaluate(async (size) => {
					document.documentElement.style.fontSize = size;
					await new Promise((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(resolve))
					);
				}, fontSize);
				const actions = await page.evaluate(() => {
					const preview = document.querySelector('section[aria-label$=" site preview"]');
					const viewport = preview.querySelector("[aria-busy]").getBoundingClientRect();
					return [...preview.querySelectorAll("button, a")]
						.filter((action) => ["Retry", "Open site"].includes(action.textContent.trim()))
						.map((action) => {
							const rect = action.getBoundingClientRect();
							return {
								label: action.textContent.trim(),
								height: rect.height,
								width: rect.width,
								contained:
									rect.top >= viewport.top &&
									rect.bottom <= viewport.bottom &&
									rect.left >= viewport.left &&
									rect.right <= viewport.right,
							};
						});
				});
				context.diagnostic(JSON.stringify({ fontSize, actions }));
				assert.equal(actions.length, 2, "Both recovery actions are present");
				for (const action of actions) {
					assert.ok(action.height >= 44 && action.width >= 44, `${action.label} is touch-sized`);
					assert.ok(action.contained, `${action.label} is fully visible inside the preview`);
				}
			}, Promise.resolve());
			assert.deepEqual(interceptionErrors, [], "Every intercepted request settled successfully");
		})
	);
});

test("Project preview does not ask script-enabled visitors to enable JavaScript before hydration", {
	timeout: 120_000,
}, async (context) => {
	await withProductionServer((url) =>
		withBrowser(context, { timeout: 30_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(20_000);
			await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
			await page.setRequestInterception(true);
			const interceptionErrors = [];
			let blockedChunks = 0;
			// Scripting stays on, but withheld app chunks hold the page in its pre-hydration state.
			page.on("request", (request) => {
				let response;
				if (
					request.url().startsWith(`${url}/_next/static/`) &&
					request.resourceType() === "script"
				) {
					blockedChunks += 1;
					response = request.respond({
						status: 200,
						contentType: "application/javascript",
						body: "",
					});
				} else if (request.url().startsWith(url)) {
					response = request.continue();
				} else {
					response = request.respond({ status: 204, body: "" });
				}
				response.catch((error) => interceptionErrors.push(error.message));
			});
			await page.goto(`${url}/projects/thorbis`, { waitUntil: "networkidle0" });
			const preview = await page.$eval('section[aria-label$=" site preview"]', (section) => {
				const open = [...section.querySelectorAll("a")].find(
					(link) => link.textContent.trim() === "Open site"
				);
				return {
					text: section.innerText,
					link: open?.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ?? false,
				};
			});
			context.diagnostic(JSON.stringify({ blockedChunks, text: preview.text }));
			assert.ok(blockedChunks > 0, "App chunks were withheld");
			assert.ok(preview.text.includes("Screenshot preview"), "The preview is labelled");
			assert.ok(!preview.text.includes("Enable JavaScript"), "The no-script notice stays hidden");
			assert.ok(preview.link, "The native site link is visible before hydration");
			assert.deepEqual(interceptionErrors, [], "Every intercepted request settled successfully");
		})
	);
});
