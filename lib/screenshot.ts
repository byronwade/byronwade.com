// Client-side screenshot resolution with a module-level cache and in-flight
// dedup, so switching preview sizes back and forth, or remounting the preview,
// reuses resolved URLs instead of asking /api/screenshot again.

const previewCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();
// Resolution only reads local project metadata; the slower provider capture
// happens in the separate image request. A stalled resolution must offer retry.
const RESOLUTION_TIMEOUT_MS = 10_000;

/**
 * Resolve the same-origin screenshot URL for `href` at the given viewport size.
 * Only successful, non-empty results are cached, so transient failures retry.
 */
export async function fetchScreenshot(
	href: string,
	width: number,
	height: number
): Promise<string> {
	const key = `${href}|${width}x${height}`;
	const cached = previewCache.get(key);
	if (cached) {
		return cached;
	}

	const existing = inflight.get(key);
	if (existing) {
		return existing;
	}

	const promise = (async () => {
		const params = new URLSearchParams({
			url: href,
			width: String(width),
			height: String(height),
		});
		const resp = await fetch(`/api/screenshot?${params.toString()}`, {
			signal: AbortSignal.timeout(RESOLUTION_TIMEOUT_MS),
		});
		if (!resp.ok) {
			throw new Error(`screenshot request failed (${resp.status})`);
		}
		const data: unknown = await resp.json();
		if (
			typeof data !== "object" ||
			data === null ||
			!("url" in data) ||
			typeof data.url !== "string" ||
			data.url.trim() === ""
		) {
			throw new Error("screenshot response missing url");
		}
		previewCache.set(key, data.url);
		return data.url;
	})();

	inflight.set(key, promise);
	try {
		return await promise;
	} finally {
		inflight.delete(key);
	}
}
