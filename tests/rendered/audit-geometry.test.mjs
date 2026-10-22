import assert from "node:assert/strict";
import { test } from "node:test";
import { readGeometry } from "../../scripts/audit-geometry.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

const FIXTURE = `<!doctype html><html><head><style>
body { margin: 0; font: 16px/20px sans-serif; }
header { margin-bottom: 20px; }
header a { display: inline-flex; min-width: 44px; min-height: 44px; }
main { width: 210px; }
.tiny { display: inline-block; width: 18px; height: 18px; padding: 0; }
.flex { display: flex; }
.hidden { display: none; }
</style></head><body>
<header data-site-header><nav aria-label="Primary"><a href="/">Home</a></nav></header>
<main>
<p>Read <a href="#" aria-label="Sentence">this article</a> for context.</p>
<p>A <em>nested <strong><a href="#" aria-label="Nested sentence">article</a></strong></em> helps.</p>
<p>This <a href="#" aria-label="Wrapped sentence">long article title wraps onto several lines</a> explains it.</p>
<ul><li>Read <a href="#" aria-label="List sentence">this article</a> next.</li></ul>
<p><a href="#" aria-label="Standalone paragraph">Go</a></p>
<ul><li><a href="#" aria-label="Standalone list">Go</a></li></ul>
<p><a href="#" aria-label="Punctuation only">Go</a>.</p>
<p><span class="hidden">Hidden prose</span><a href="#" aria-label="Hidden prose">Go</a></p>
<p><a href="#" aria-label="Sibling link">Go</a><a href="#" aria-label="Other link">Go</a></p>
<div><p>Separate block text</p><a href="#" aria-label="Separate block">Go</a></div>
<div class="flex">Flex text <a href="#" aria-label="Flex link">Go</a></div>
<p>Inline control <button class="tiny" aria-label="Inline button">X</button> stays a control.</p>
<p>Inline role <a href="#" role="button" aria-label="Button role">Go</a> stays a control.</p>
<p>Read <a href="#" aria-label="Icon only"><svg width="16" height="16"></svg></a> next.</p>
<button class="tiny" aria-label="Tiny button">X</button>
<input class="tiny" aria-label="Tiny input">
<div hidden><button class="tiny">Hidden</button></div>
<div inert><button class="tiny">Inert</button></div>
<div aria-hidden="true"><button class="tiny">Aria hidden</button></div>
<a href="#" style="display:inline-flex;min-width:44px;min-height:44px" aria-label="Large link">Go</a>
<a href="#" style="display:inline-flex;width:30px;height:30px" aria-label="Thirty pixel link">Go</a>
</main></body></html>`;

const ALWAYS_SMALL = [
	"Standalone paragraph",
	"Standalone list",
	"Punctuation only",
	"Hidden prose",
	"Sibling link",
	"Other link",
	"Separate block",
	"Flex link",
	"Inline button",
	"Button role",
	"Icon only",
	"Tiny button",
	"Tiny input",
];

test("audit target sizes exempt sentence links while retaining standalone and control failures", {
	timeout: 60_000,
}, async (context) => {
	await withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
		const page = await browser.newPage();
		page.setDefaultTimeout(10_000);
		await [390, 1280].reduce(async (previous, width) => {
			await previous;
			await context.test(`${width}px target classification`, async () => {
				await page.setViewport({ width, height: 900 });
				await page.setContent(FIXTURE);
				const geometry = await readGeometry(page);
				assert.deepEqual(
					geometry.targetFailures.map((target) => target.label).sort(),
					[...ALWAYS_SMALL, ...(width < 640 ? ["Thirty pixel link"] : [])].sort()
				);
				assert.deepEqual(
					geometry.inlineTargetExceptions.map((target) => target.label).sort(),
					["Sentence", "Nested sentence", "Wrapped sentence", "List sentence"].sort()
				);
				assert.ok(geometry.inlineTargetExceptions.every((target) => target.height > 0));
				if (width === 1280) {
					const captureGeometry = await readGeometry(page, 44);
					assert.deepEqual(
						captureGeometry.targetFailures.map((target) => target.label).sort(),
						[...ALWAYS_SMALL, "Thirty pixel link"].sort()
					);
				}
			});
		}, Promise.resolve());
	});
});
