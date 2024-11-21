export const toAbsoluteUrl = (base, path) => {
	if (!base || !path) return null;
	try {
		const baseUrl = new URL(base);
		const url = new URL(path, baseUrl);
		return url.toString();
	} catch (e) {
		console.error(e);
		return null;
	}
};

export async function fetchWithErrorHandler(url, options, fallbackValue = null, timeout = 10000) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	options = { ...options, signal: controller.signal };

	try {
		const response = await fetch(url, options);
		clearTimeout(id);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		clearTimeout(id);
		console.error(error);
		return fallbackValue;
	}
}
