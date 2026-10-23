import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const SERVER_PORTFOLIO_SYMBOLS =
	/\b(?:GITHUB_(?:API_TOKEN|TOKEN)|FIGMA_(?:ACCESS_TOKEN|TEAM_ID)|DRIBBBLE_TOKEN|unstable_cache|CACHE_TAGS|githubHeaders|getFigmaFiles?|getGitHub(?:Stats|Repositories)|getDribbbleShots)\b|figma-js|next\/cache/;
const REACT_SCAN_SYMBOLS = /__REACT_SCAN__|react-scan-toolbar-root|reactScanCleanupListeners/;

test("portfolio API is not prerendered with a potentially unavailable provider response", async () => {
	const manifest = JSON.parse(
		await readFile(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	assert.equal(Object.hasOwn(manifest.routes, "/api/portfolio"), false);
});

test("production client chunks exclude portfolio API, cache code and development diagnostics", async (context) => {
	const chunksDirectory = fileURLToPath(new URL("../../.next/static/chunks/", import.meta.url));
	const files = await readdir(chunksDirectory, { recursive: true });
	const scripts = files.filter((file) => file.endsWith(".js"));
	assert.ok(scripts.length > 0, "Run npm run build before checking client chunks");

	const matches = await Promise.all(
		scripts.map(async (file) => {
			const source = await readFile(join(chunksDirectory, file), "utf8");
			return {
				file,
				containsServerCode: SERVER_PORTFOLIO_SYMBOLS.test(source),
				containsReactScan: REACT_SCAN_SYMBOLS.test(source),
			};
		})
	);
	const contaminated = matches
		.filter((match) => match.containsServerCode)
		.map((match) => match.file);
	assert.deepEqual(contaminated, [], "Server portfolio code found in client chunks");
	assert.deepEqual(
		matches.filter((match) => match.containsReactScan).map((match) => match.file),
		[],
		"Development React Scan code found in production client chunks"
	);
	context.diagnostic(`Scanned ${scripts.length} production client chunks`);
});
