import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// Use the real route/response implementation without launching Linux Chromium.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "next/server") {
			return nextResolve("next/server.js", context);
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { GET } = await import("../app/api/resume-pdf/route.ts");
const { RESUME_PDF_FILENAME } = await import("../lib/resume-pdf.ts");
const PDF_BYTES = new TextEncoder().encode("%PDF-1.7\nsynthetic resume fixture\n%%EOF");

function stubBrowser(t, status = 200) {
	const page = {
		goto: t.mock.fn(() =>
			Promise.resolve(status === null ? null : { ok: () => status >= 200 && status < 300 })
		),
		waitForSelector: t.mock.fn(() => Promise.resolve({})),
		pdf: t.mock.fn(() => Promise.resolve(PDF_BYTES)),
	};
	const browser = {
		newPage: t.mock.fn(() => Promise.resolve(page)),
		close: t.mock.fn(() => Promise.resolve()),
	};
	t.mock.method(chromium, "executablePath", () => Promise.resolve("synthetic-chromium"));
	t.mock.method(puppeteer, "launch", () => Promise.resolve(browser));
	t.mock.method(console, "error", t.mock.fn());
	t.mock.method(console, "warn", t.mock.fn());
	return { page, browser };
}

async function assertFailure(response) {
	assert.equal(response.status, 500);
	assert.deepEqual(await response.json(), { error: "Failed to generate PDF" });
	assert.equal(response.headers.get("cache-control"), "no-store");
	assert.equal(response.headers.get("cdn-cache-control"), null);
	assert.equal(response.headers.get("content-disposition"), null);
}

test("a successful resume load returns the PDF and closes the browser", async (t) => {
	const { browser } = stubBrowser(t);
	const response = await GET();
	assert.equal(response.status, 200);
	assert.equal(response.headers.get("content-type"), "application/pdf");
	assert.equal(
		response.headers.get("content-disposition"),
		`attachment; filename="${RESUME_PDF_FILENAME}"`
	);
	// Browsers keep a download for an hour. The CDN (each deployment starts empty)
	// serves it for a day, then refreshes in the background, keeping the last good
	// copy when a print fails.
	assert.equal(response.headers.get("cache-control"), "public, max-age=3600");
	assert.equal(
		response.headers.get("cdn-cache-control"),
		"public, max-age=86400, stale-while-revalidate=31536000, stale-if-error=31536000"
	);
	assert.deepEqual(new Uint8Array(await response.arrayBuffer()), PDF_BYTES);
	assert.equal(browser.close.mock.callCount(), 1);
});

for (const status of [404, 429, 500, 503, null]) {
	test(`a failed resume load (${status}) is never printed or cached as a PDF`, async (t) => {
		const { page, browser } = stubBrowser(t, status);
		await assertFailure(await GET());
		assert.equal(page.pdf.mock.callCount(), 0);
		assert.equal(page.waitForSelector.mock.callCount(), 0);
		assert.equal(browser.close.mock.callCount(), 1);
	});
}

test("navigation failure is retryable and still closes the browser", async (t) => {
	const { page, browser } = stubBrowser(t);
	t.mock.method(page, "goto", () => Promise.reject(new Error("synthetic navigation timeout")));
	await assertFailure(await GET());
	assert.equal(page.pdf.mock.callCount(), 0);
	assert.equal(browser.close.mock.callCount(), 1);
});

test("printing failure is retryable and still closes the browser", async (t) => {
	const { page, browser } = stubBrowser(t);
	t.mock.method(page, "pdf", () => Promise.reject(new Error("synthetic print failure")));
	await assertFailure(await GET());
	assert.equal(browser.close.mock.callCount(), 1);
});

test("missing email hydration still prints the server-rendered resume, uncached", async (t) => {
	const { page, browser } = stubBrowser(t);
	t.mock.method(page, "waitForSelector", () =>
		Promise.reject(new Error("synthetic hydration timeout"))
	);
	const response = await GET();
	assert.equal(response.status, 200);
	assert.equal(response.headers.get("content-type"), "application/pdf");
	// A resume without its email line must not be stored for later visitors.
	assert.equal(response.headers.get("cache-control"), "no-store");
	assert.equal(response.headers.get("cdn-cache-control"), null);
	assert.deepEqual(new Uint8Array(await response.arrayBuffer()), PDF_BYTES);
	assert.equal(browser.close.mock.callCount(), 1);
});
