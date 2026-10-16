import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import {
	fetchResumePdf,
	isResumePdfResponse,
	RESUME_PDF_FILENAME,
	shouldHandleResumeDownload,
} from "../lib/resume-pdf.ts";

const PRIMARY = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

test("the resume PDF filename has no spaces or quotes", () => {
	assert.equal(RESUME_PDF_FILENAME, "Byron_Wade_Resume.pdf");
	assert.equal(RESUME_PDF_FILENAME.includes('"'), false);
});

test("only a plain primary click is saved in the page", () => {
	assert.equal(shouldHandleResumeDownload(PRIMARY), true);
	assert.equal(shouldHandleResumeDownload({ ...PRIMARY, metaKey: true }), false);
	assert.equal(shouldHandleResumeDownload({ ...PRIMARY, ctrlKey: true }), false);
	assert.equal(shouldHandleResumeDownload({ ...PRIMARY, shiftKey: true }), false);
	assert.equal(shouldHandleResumeDownload({ ...PRIMARY, altKey: true }), false);
	assert.equal(shouldHandleResumeDownload({ ...PRIMARY, button: 1 }), false);
});

test("only a successful PDF response may be saved", () => {
	assert.equal(isResumePdfResponse(200, "application/pdf"), true);
	assert.equal(isResumePdfResponse(200, "application/pdf; charset=binary"), true);
	assert.equal(isResumePdfResponse(200, "Application/PDF"), true);
	assert.equal(isResumePdfResponse(500, "application/json"), false);
	assert.equal(isResumePdfResponse(200, "text/html"), false);
	assert.equal(isResumePdfResponse(200, "application/pdf-not"), false);
	assert.equal(isResumePdfResponse(200, null), false);
	assert.equal(isResumePdfResponse(302, "application/pdf"), false);
});

// A real local server, so the abort signal reaches the socket and the body stream.
const PDF_BYTES = "%PDF-1.7\nsynthetic resume fixture\n%%EOF";
let routeHandler = (_request, response) => response.end();
const server = createServer((request, response) => routeHandler(request, response));
const realFetch = globalThis.fetch;

before(async () => {
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const base = `http://127.0.0.1:${server.address().port}`;
	globalThis.fetch = (input, init) => realFetch(new URL(input, base), init);
});

after(() => {
	globalThis.fetch = realFetch;
	server.closeAllConnections();
	server.close();
});

test("a successful PDF response is returned for saving", async () => {
	routeHandler = (request, response) => {
		assert.equal(request.url, "/api/resume-pdf");
		response.writeHead(200, { "Content-Type": "application/pdf" });
		response.end(PDF_BYTES);
	};
	const pdf = await fetchResumePdf({ timeoutMs: 1000 });
	assert.ok(pdf);
	assert.equal(await pdf.text(), PDF_BYTES);
});

test("a failed create is not returned as a PDF", async () => {
	routeHandler = (_request, response) => {
		response.writeHead(500, { "Content-Type": "application/json" });
		response.end(JSON.stringify({ error: "Failed to generate PDF" }));
	};
	assert.equal(await fetchResumePdf({ timeoutMs: 1000 }), null);
});

test("a dropped connection ends as a failure", async () => {
	routeHandler = (request) => request.socket.destroy();
	assert.equal(await fetchResumePdf({ timeoutMs: 1000 }), null);
});

test("a route that never answers gives up after the timeout", { timeout: 5000 }, async () => {
	routeHandler = () => undefined;
	const started = performance.now();
	assert.equal(await fetchResumePdf({ timeoutMs: 80 }), null);
	assert.ok(performance.now() - started < 2000);
});

test("a PDF body that stalls mid-stream gives up after the timeout", {
	timeout: 5000,
}, async () => {
	routeHandler = (_request, response) => {
		response.writeHead(200, { "Content-Type": "application/pdf" });
		response.write("%PDF-1.7\n");
	};
	const started = performance.now();
	assert.equal(await fetchResumePdf({ timeoutMs: 80 }), null);
	assert.ok(performance.now() - started < 2000);
});

// The caller's signal (the page unmounting) must end the request on its own,
// long before the 10s timeout used here could.
test("leaving the page cancels a request that has not answered", { timeout: 5000 }, async () => {
	routeHandler = () => undefined;
	const controller = new AbortController();
	setTimeout(() => controller.abort(), 50);
	const started = performance.now();
	assert.equal(await fetchResumePdf({ timeoutMs: 10_000, signal: controller.signal }), null);
	assert.ok(performance.now() - started < 2000);
});

test("leaving the page cancels a PDF body that is still arriving", { timeout: 5000 }, async () => {
	routeHandler = (_request, response) => {
		response.writeHead(200, { "Content-Type": "application/pdf" });
		response.write("%PDF-1.7\n");
	};
	const controller = new AbortController();
	setTimeout(() => controller.abort(), 50);
	const started = performance.now();
	assert.equal(await fetchResumePdf({ timeoutMs: 10_000, signal: controller.signal }), null);
	assert.ok(performance.now() - started < 2000);
});

test("an already cancelled download never reaches the route", async () => {
	let requests = 0;
	routeHandler = (_request, response) => {
		requests += 1;
		response.writeHead(200, { "Content-Type": "application/pdf" });
		response.end(PDF_BYTES);
	};
	const controller = new AbortController();
	controller.abort();
	assert.equal(await fetchResumePdf({ timeoutMs: 1000, signal: controller.signal }), null);
	assert.equal(requests, 0);
});
