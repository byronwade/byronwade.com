// Shared client-side screenshot fetching with a module-level cache and in-flight
// dedup, so the projects index hover-peek and the project detail preview reuse
// the same resolved URLs instead of hammering /api/screenshot independently.

const previewCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/**
 * Resolve a static screenshot URL for `href` at the given viewport size.
 * Only successful, non-empty results are cached, so transient failures retry.
 */
export async function fetchScreenshot(
	href: string,
	width: number,
	height: number
): Promise<string> {
	const key = `${href}|${width}x${height}`;
	const cached = previewCache.get(key);
	if (cached) return cached;

	const existing = inflight.get(key);
	if (existing) return existing;

	const promise = (async () => {
		const params = new URLSearchParams({
			mode: "static",
			url: href,
			width: String(width),
			height: String(height),
			format: "jpg",
			quality: "90",
		});
		const resp = await fetch(`/api/screenshot?${params.toString()}`);
		if (!resp.ok) throw new Error(`screenshot request failed (${resp.status})`);
		const data = (await resp.json()) as { url?: unknown };
		if (typeof data?.url !== "string" || data.url.trim() === "") {
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
