import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withBrowser } from "../fixtures/browser.mjs";

// components/ui/button.tsx draws native elements without hooks, so a server
// component's Button is plain HTML and a client component ships one small
// function. Base UI's Button and its helpers cost each page that used it about
// 4 KB of gzip. See docs/PERFORMANCE.md.
const APP = new URL("../../.next/server/app/", import.meta.url);
const BASE_UI_BUTTON = /@base-ui[\\/]+react[\\/]+esm[\\/]+button[\\/]/;
const BUTTON_SLOT = /<(a|button)\b[^>]*\bdata-slot="button"[^>]*>/g;
const CONTACT_SUBMIT = /<button type="submit" data-slot="button"/;
const ATTRIBUTE = (name) => new RegExp(`\\s${name}="([^"]*)"`);

function files(suffix) {
	return readdirSync(APP, { recursive: true })
		.filter((file) => file.endsWith(suffix))
		.map((file) => file.replaceAll("\\", "/"));
}

test("no page's client code includes Base UI's Button", () => {
	const manifests = files("page_client-reference-manifest.js");
	assert.ok(manifests.length > 10, "Run npm run build before checking client manifests");
	const including = manifests.filter((file) =>
		BASE_UI_BUTTON.test(readFileSync(new URL(file, APP), "utf8"))
	);
	assert.deepEqual(including, [], "These routes ship Base UI's Button again");
});

test("prerendered Buttons keep native button and link semantics", () => {
	const problems = [];
	const seen = { a: 0, button: 0 };
	for (const file of files(".html")) {
		for (const [tag, name] of readFileSync(new URL(file, APP), "utf8").matchAll(BUTTON_SLOT)) {
			seen[name] += 1;
			const type = tag.match(ATTRIBUTE("type"))?.[1];
			const role = tag.match(ATTRIBUTE("role"))?.[1];
			if (
				name === "a" &&
				(type !== undefined || role !== undefined || !ATTRIBUTE("href").test(tag))
			) {
				problems.push(
					`${file}: a link-button needs href and no type or role: ${tag.slice(0, 120)}`
				);
			}
			if (name === "button" && !["button", "submit"].includes(type)) {
				problems.push(`${file}: a button needs an explicit type: ${tag.slice(0, 120)}`);
			}
		}
	}
	assert.ok(seen.a > 20 && seen.button > 0, `Too few Buttons found: ${JSON.stringify(seen)}`);
	assert.deepEqual(problems, []);
	const contact = readFileSync(new URL("contact.html", APP), "utf8");
	assert.match(contact, CONTACT_SUBMIT, "Contact keeps its submit button");
});

test("the résumé's Download PDF link still runs its own click handler", {
	timeout: 120_000,
}, async (context) => {
	assert.ok(existsSync(new URL("resume.html", APP)), "Run npm run build first");
	const outcome = await withProductionServer((origin) =>
		withBrowser(context, { timeout: 15_000, protocolTimeout: 15_000 }, async (browser) => {
			const page = await browser.newPage();
			page.setDefaultTimeout(10_000);
			await page.setRequestInterception(true);
			let pdfRequests = 0;
			page.on("request", (request) => {
				if (new URL(request.url()).pathname === "/api/resume-pdf") {
					pdfRequests += 1;
					request.respond({ status: 500, contentType: "text/plain", body: "unavailable" });
					return;
				}
				request.continue();
			});
			assert.ok((await page.goto(`${origin}/resume`, { waitUntil: "networkidle0" })).ok());
			const link = await page.waitForSelector('a[href="/api/resume-pdf"][data-slot="button"]');
			await link.click();
			// The handler keeps the visitor here and reports the failure in place.
			await page.waitForFunction(() =>
				[...document.querySelectorAll('[role="status"]')].some((status) =>
					status.textContent.includes("Couldn’t create the PDF")
				)
			);
			return { path: new URL(page.url()).pathname, pdfRequests };
		})
	);
	assert.deepEqual(outcome, { path: "/resume", pdfRequests: 1 });
});
