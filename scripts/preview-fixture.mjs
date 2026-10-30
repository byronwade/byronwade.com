import { createRequire } from "node:module";
import { resolve, sep } from "node:path";

// Node 24 can require this typed catalog directly, without the typeless-ESM
// warning that importing a .ts file would repeat in every compilation helper.
const { SCREENSHOT_VIEWPORTS } = createRequire(import.meta.url)("../lib/screenshot-viewports.ts");

// A Node preload, never imported by the application. Next's development workers
// inherit NODE_OPTIONS so real routes and compilation share the CLI's fixture.
const entry = resolve(process.argv[1] || "");
const cli = resolve("node_modules/next/dist/bin/next");
const worker = resolve("node_modules/next/dist/server/lib/start-server.js");
const helper = resolve("node_modules/next/dist/compiled/jest-worker/processChild.js");
const starting = entry === cli && process.argv[2] === "dev";
const inherited =
	(entry === worker ||
		entry === helper ||
		entry.startsWith(`${resolve(".next/dev/build")}${sep}`)) &&
	process.env.NODE_ENV === "development" &&
	process.env.LOCAL_PREVIEW_FIXTURE === "active";
if (process.env.NODE_ENV === "production" || !(starting || inherited)) {
	throw new Error(
		`The local preview fixture only supports next dev, never build or start (${entry})`
	);
}

const option = process.argv.find((argument) => argument.startsWith("--fixture-state="));
const state =
	option?.slice("--fixture-state=".length) ?? (process.env.LOCAL_PREVIEW_STATE || "success");
if (!["success", "error", "retry"].includes(state)) {
	throw new Error("Preview fixture state must be success, error or retry");
}
if (option) {
	process.argv.splice(process.argv.indexOf(option), 1);
}
process.env.NODE_ENV = "development";
process.env.LOCAL_PREVIEW_FIXTURE = "active";
process.env.LOCAL_PREVIEW_STATE = state;
// Replace even an inherited real credential before Next reads .env or renders.
process.env.SCREENSHOTONE_ACCESS_KEY = "local-preview-fixture-not-a-credential";
if (starting) {
	const preload = `--import=${new URL(import.meta.url).href}`;
	process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} ${preload}`.trim();
	console.log(`Local preview fixture: ${state}. Images are labeled fixtures, not site captures.`);
}

const fetch = globalThis.fetch;
const attempted = new Set();
globalThis.fetch = (input, options) => {
	const url = new URL(input instanceof Request ? input.url : input);
	if (url.hostname !== "api.screenshotone.com") {
		return fetch(input, options);
	}
	// Own the whole provider host: a malformed capture must fail locally too.
	const size = Object.values(SCREENSHOT_VIEWPORTS).find(
		(viewport) =>
			String(viewport.width) === url.searchParams.get("viewport_width") &&
			String(viewport.height) === url.searchParams.get("viewport_height")
	);
	if (url.pathname !== "/take" || !size) {
		return Promise.resolve(new Response("Unsupported local capture", { status: 400 }));
	}
	const key = `${url.searchParams.get("url")}:${size.width}`;
	const fail = state === "error" || (state === "retry" && !attempted.has(key));
	attempted.add(key);
	if (fail) {
		return Promise.resolve(new Response("Local capture failure fixture", { status: 502 }));
	}
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 800 450">
<rect width="800" height="450" fill="#e2e8f0"/>
<path d="M0 90H800M0 360H800M80 0V450M720 0V450" stroke="#64748b" stroke-dasharray="8 8"/>
<g fill="#0f172a" font-family="sans-serif" text-anchor="middle">
<text x="400" y="175" font-size="28">Local development fixture</text>
<text x="400" y="230" font-size="40">${size.width} × ${size.height}</text>
<text x="400" y="280" font-size="22">Not a capture of the project site</text>
</g></svg>`;
	return Promise.resolve(
		new Response(svg, {
			headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
		})
	);
};
