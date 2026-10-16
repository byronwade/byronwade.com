import assert from "node:assert/strict";
import { test } from "node:test";
import {
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
