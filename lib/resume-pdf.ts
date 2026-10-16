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

// The route's own worst case is about 50s (browser launch, a 30s page load and a
// 10s email wait). Keep this above those bounds; trimming it would cut off real PDFs.
const RESUME_PDF_TIMEOUT_MS = 60_000;

/**
 * The PDF body, or null when the route fails, the network fails, or no complete
 * PDF arrives in time. The timeout covers the body too, so a stalled stream ends.
 */
export async function fetchResumePdf(timeoutMs = RESUME_PDF_TIMEOUT_MS): Promise<Blob | null> {
	try {
		const response = await fetch("/api/resume-pdf", { signal: AbortSignal.timeout(timeoutMs) });
		if (!isResumePdfResponse(response.status, response.headers.get("content-type"))) {
			return null;
		}
		return await response.blob();
	} catch {
		return null;
	}
}
