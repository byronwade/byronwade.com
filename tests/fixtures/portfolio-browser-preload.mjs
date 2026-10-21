// Test child only: keep the real Next caches while replacing the provider's transport.
const port = Number(process.env.PORTFOLIO_AUDIT_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
	throw new Error("Portfolio fixture requires an owned loopback port");
}
const fetch = globalThis.fetch;
globalThis.fetch = (input, options) => {
	const url = new URL(input instanceof Request ? input.url : input);
	if (url.hostname === "api.github.com" && url.pathname === "/users/byronwade/repos") {
		// Forward no authorization headers, even if the parent has provider credentials.
		return fetch(`http://127.0.0.1:${port}/repositories`, { signal: options?.signal });
	}
	return fetch(input, options);
};
