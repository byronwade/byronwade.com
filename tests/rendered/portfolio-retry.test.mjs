import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { portfolioProviderEnv } from "../fixtures/portfolio-provider.mjs";

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
			{ env: await portfolioProviderEnv(address.port) }
		);
	} finally {
		provider.closeAllConnections();
		await new Promise((resolveClose, reject) =>
			provider.close((error) => (error ? reject(error) : resolveClose()))
		);
	}
});
