import http from "node:http";
import https from "node:https";
import { syncBuiltinESMExports } from "node:module";

// Loaded only by the local browser audit child, never by application imports.
// Forward every Figma API request to the owned fixture, so its synthetic token
// cannot reach a provider. Other hosts retain their normal transport.
const port = Number(process.env.FIGMA_AUDIT_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
	throw new Error("Figma browser fixture requires an owned loopback port");
}
const request = https.request;
https.request = function fixtureRequest(options, ...args) {
	if (options?.hostname === "api.figma.com") {
		return http.request(
			{ ...options, protocol: "http:", hostname: "127.0.0.1", port, agent: undefined },
			...args
		);
	}
	return request.call(this, options, ...args);
};
syncBuiltinESMExports();
