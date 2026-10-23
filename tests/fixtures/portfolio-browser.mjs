import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { EventEmitter, once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { CACHE_TAGS } from "../../lib/cache.ts";

/** Replace only GitHub's transport; exercise the real production page and Data Cache. */
export async function withPortfolioFixture(verify) {
	let reply = { status: 503, body: { message: "Fixture unavailable" } };
	let requests = 0;
	const events = new EventEmitter();
	const provider = createServer((_request, response) => {
		requests += 1;
		events.emit("request");
		if (reply.hold) {
			return;
		}
		response.writeHead(reply.status, { "Content-Type": "application/json" });
		response.end(JSON.stringify(reply.body));
	});
	provider.listen(0, "127.0.0.1");
	await once(provider, "listening");
	try {
		const address = provider.address();
		assert.ok(address && typeof address === "object");
		const { config } = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
		const isolatedConfig = {
			...config,
			experimental: { ...config.experimental, fetchCacheKeyPrefix: randomUUID() },
		};
		const secret = randomUUID();
		return await verify({
			env: {
				__NEXT_PRIVATE_STANDALONE_CONFIG: JSON.stringify(isolatedConfig),
				PORTFOLIO_AUDIT_PORT: String(address.port),
				GITHUB_TOKEN: "",
				GITHUB_API_TOKEN: "",
				REVALIDATION_SECRET: secret,
				SCREENSHOTONE_ACCESS_KEY: "",
				RESEND_API_KEY: "",
				NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --import=${pathToFileURL(resolve("tests/fixtures/portfolio-browser-preload.mjs")).href}`,
			},
			get requests() {
				return requests;
			},
			setResponse(value) {
				reply = value;
			},
			waitForRequest() {
				return once(events, "request", { signal: AbortSignal.timeout(10_000) });
			},
			async invalidate(url) {
				// This secret exists only in the owned child. Never target a hosted server.
				assert.equal(new URL(url).hostname, "127.0.0.1");
				const response = await fetch(`${url}/api/cache/revalidate`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tag: CACHE_TAGS.GITHUB, secret }),
					signal: AbortSignal.timeout(10_000),
				});
				assert.equal(response.status, 200, "fixture cache invalidation succeeds");
				assert.equal((await response.json()).success, true);
			},
		});
	} finally {
		provider.closeAllConnections();
		await new Promise((resolveClose, reject) =>
			provider.close((error) => (error ? reject(error) : resolveClose()))
		);
	}
}
