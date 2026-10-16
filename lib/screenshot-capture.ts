import "server-only";
import { getProjects } from "@/lib/projects";
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-viewports";

/**
 * Server side of the project preview. Both screenshot routes resolve requests
 * here, so the access key, the provider URL and the quota rules live in one
 * place and never reach the browser.
 */

const PROVIDER_ENDPOINT = "https://api.screenshotone.com/take";
/** Provider render timeout (seconds); the fetch allows a little longer. */
const PROVIDER_TIMEOUT_SECONDS = 45;
const FETCH_TIMEOUT_MS = (PROVIDER_TIMEOUT_SECONDS + 5) * 1000;
/** Provider-side cache: hits do not spend render quota. 14400 is its minimum. */
const PROVIDER_CACHE_TTL_SECONDS = 86_400;

/** Browsers keep a capture for an hour; the CDN serves it for a day, then revalidates in the background. */
export const CAPTURE_CACHE_CONTROL =
	"public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

interface Capture {
	height: number;
	/** The project's canonical URL from content, never the caller's string. */
	target: string;
	width: number;
}

type CaptureResolution =
	| { ok: true; capture: Capture }
	| { ok: false; status: number; error: string };

function normalizedHref(value: string): string | null {
	try {
		return new URL(value).href;
	} catch {
		return null;
	}
}

/**
 * This spends the site's ScreenshotOne quota, so only the exact URLs the site
 * already publishes are captured, at the preview's fixed sizes. The allowlist
 * is derived from project content, so it cannot drift as projects change.
 */
export async function resolveCapture(params: URLSearchParams): Promise<CaptureResolution> {
	const url = params.get("url");
	if (!url) {
		return { ok: false, status: 400, error: "URL parameter is required" };
	}
	const requested = normalizedHref(url);
	if (!requested) {
		return { ok: false, status: 400, error: "Invalid URL" };
	}

	const mode = params.get("mode");
	if (mode !== null && mode !== "static") {
		return { ok: false, status: 400, error: "Unsupported mode" };
	}

	const width = params.get("width") ?? String(SCREENSHOT_VIEWPORTS.desktop.width);
	const height = params.get("height") ?? String(SCREENSHOT_VIEWPORTS.desktop.height);
	const viewport = Object.values(SCREENSHOT_VIEWPORTS).find(
		(size) => String(size.width) === width && String(size.height) === height
	);
	if (!viewport) {
		return { ok: false, status: 400, error: "Unsupported size" };
	}

	const projects = await getProjects();
	const target = projects
		.map((project) => (project.url ? normalizedHref(project.url) : null))
		.find((href) => href === requested && href.startsWith("https://"));
	if (!target) {
		return { ok: false, status: 403, error: "URL is not an allowed target" };
	}

	return { ok: true, capture: { target, width: viewport.width, height: viewport.height } };
}

/** The same-origin image URL the browser loads for a capture. */
export function captureImagePath({ target, width, height }: Capture): string {
	const params = new URLSearchParams({ url: target, width: String(width), height: String(height) });
	return `/api/screenshot/image?${params.toString()}`;
}

export function getAccessKey(): string | null {
	return process.env.SCREENSHOTONE_ACCESS_KEY?.trim() || null;
}

/**
 * Request a JPEG from the provider. The key travels in a header, so it is in
 * no URL, log line or error message this site produces.
 */
export function fetchCapture({ target, width, height }: Capture, accessKey: string) {
	const params = new URLSearchParams({
		url: target,
		format: "jpg",
		image_quality: "90",
		viewport_width: String(width),
		viewport_height: String(height),
		block_ads: "true",
		block_cookie_banners: "true",
		block_banners_by_heuristics: "false",
		block_trackers: "true",
		timeout: String(PROVIDER_TIMEOUT_SECONDS),
		response_type: "by_format",
		cache: "true",
		cache_ttl: String(PROVIDER_CACHE_TTL_SECONDS),
	});
	return fetch(`${PROVIDER_ENDPOINT}?${params.toString()}`, {
		headers: { "X-Access-Key": accessKey },
		cache: "no-store",
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	});
}
