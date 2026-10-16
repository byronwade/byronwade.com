/** Filename shared by the PDF route and the in-page save. */
export const RESUME_PDF_FILENAME = "Byron_Wade_Resume.pdf";

/**
 * A primary click should save the file in the page, so a failed response can be
 * explained there. Modified and non-primary clicks keep the browser's own
 * navigation (new tab, download manager).
 */
export function shouldHandleResumeDownload(event: {
	button: number;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
}): boolean {
	return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/** True only for a successful PDF body. An error page or JSON must not be saved as a PDF. */
export function isResumePdfResponse(status: number, contentType: string | null): boolean {
	if (status < 200 || status >= 300) {
		return false;
	}
	const mediaType = (contentType ?? "").split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "application/pdf";
}
