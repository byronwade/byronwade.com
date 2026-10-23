import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Production-server environment that sends GitHub repository requests to a loopback
 * provider on `port` instead of api.github.com, without provider credentials.
 */
export async function portfolioProviderEnv(port) {
	const { config } = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
	// Next's standalone loader accepts its built config. Give the real Data Cache
	// a unique namespace so a run neither reads nor replaces normal API data.
	const isolatedConfig = {
		...config,
		experimental: { ...config.experimental, fetchCacheKeyPrefix: randomUUID() },
	};
	return {
		__NEXT_PRIVATE_STANDALONE_CONFIG: JSON.stringify(isolatedConfig),
		PORTFOLIO_AUDIT_PORT: String(port),
		GITHUB_TOKEN: "",
		GITHUB_API_TOKEN: "",
		NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --import=${pathToFileURL(resolve("tests/fixtures/portfolio-browser-preload.mjs")).href}`,
	};
}
