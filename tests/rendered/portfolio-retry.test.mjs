import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { withProductionServer } from "../../scripts/production-session.mjs";

const FAILURE = /Couldn(?:'|&#x27;|’)t load repositories/;
const RECOVERED = /href="https:\/\/github.com\/fixture\/audit-recovery"/;

test("portfolio retry renders provider recovery without caching failure HTML", {
	timeout: 150_000,
}, async () => {
	let failed = true;
	let requests = 0;
	const provider = createServer((_request, response) => {
		requests += 1;
		response.writeHead(failed ? 503 : 200, { "Content-Type": "application/json" });
		response.end(
			JSON.stringify(
				failed
					? { message: "Fixture unavailable" }
					: [
							{
								id: 1,
								name: "audit-recovery",
								full_name: "fixture/audit-recovery",
								html_url: "https://github.com/fixture/audit-recovery",
								description: null,
								forks_count: 0,
								stargazers_count: 1,
								pushed_at: "2026-10-19T00:00:00Z",
								updated_at: "2026-10-19T00:00:00Z",
								fork: false,
								archived: false,
							},
						]
			)
		);
	});
	provider.listen(0, "127.0.0.1");
	await once(provider, "listening");
	try {
		const address = provider.address();
		assert.ok(address && typeof address === "object");
		const { config } = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
		// Next's standalone loader accepts its built config. Give the real Data Cache
		// a unique namespace so this test neither reads nor replaces normal API data.
		const isolatedConfig = {
			...config,
			experimental: { ...config.experimental, fetchCacheKeyPrefix: randomUUID() },
		};
		await withProductionServer(
			async (url) => {
				const load = async () => {
					const response = await fetch(`${url}/portfolio`, { signal: AbortSignal.timeout(15_000) });
					assert.equal(response.status, 200);
					return response.text();
				};
				const unavailable = await load();
				assert.equal(requests, 1, "initial failure must reach the provider");
				assert.match(unavailable, FAILURE);
				failed = false;
				const recovered = await load();
				assert.equal(requests, 2, "retry must call the recovered provider");
				assert.doesNotMatch(recovered, FAILURE);
				assert.match(recovered, RECOVERED);
				assert.match(await load(), RECOVERED);
				assert.equal(requests, 2, "successful data must remain cached");
			},
			{
				env: {
					__NEXT_PRIVATE_STANDALONE_CONFIG: JSON.stringify(isolatedConfig),
					PORTFOLIO_AUDIT_PORT: String(address.port),
					GITHUB_TOKEN: "",
					GITHUB_API_TOKEN: "",
					NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --import=${pathToFileURL(resolve("tests/fixtures/portfolio-browser-preload.mjs")).href}`,
				},
			}
		);
	} finally {
		provider.closeAllConnections();
		await new Promise((resolveClose, reject) =>
			provider.close((error) => (error ? reject(error) : resolveClose()))
		);
	}
});
