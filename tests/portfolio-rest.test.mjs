import assert from "node:assert/strict";
import { createServer } from "node:http";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "server-only") {
			return nextResolve(new URL("./fixtures/server-only.mjs", import.meta.url).href, context);
		}
		if (specifier === "next/cache") {
			return { url: "fixture:portfolio-cache", shortCircuit: true };
		}
		if (specifier === "figma-js") {
			return { url: "fixture:unused-figma", shortCircuit: true };
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url === "fixture:unused-figma") {
			return {
				format: "module",
				shortCircuit: true,
				source: 'export function Client() { throw new Error("REST tests must not call Figma"); }',
			};
		}
		if (url === "fixture:portfolio-cache") {
			return {
				format: "module",
				shortCircuit: true,
				source: `export function unstable_cache(fn, keys, options) {
  return Object.assign(fn, { cachePolicy: { keys, options } });
}`,
			};
		}
		return nextLoad(url, context);
	},
});
const { getDribbbleShots, getGitHubRepositories, getGitHubStats } = await import(
	"../lib/portfolio-data.ts"
);

const repository = {
	id: 1,
	name: "site",
	full_name: "byronwade/site",
	stargazers_count: 2,
	updated_at: "2026-10-19T12:00:00Z",
};
const shot = { id: 1, title: "A design", images: { normal: "https://image.example/shot.jpg" } };
const profile = { public_repos: 12, followers: 3, following: 4, created_at: "2020-01-01" };
const integrations = [
	{
		name: "GitHub repositories",
		load: getGitHubRepositories,
		payload: [repository],
		expected: [repository],
		fallback: [],
		key: "github-repos",
		tag: "github",
	},
	{
		name: "GitHub profile",
		load: getGitHubStats,
		payload: profile,
		expected: { publicRepos: 12, followers: 3, following: 4, createdAt: "2020-01-01" },
		fallback: { publicRepos: 0, followers: 0, following: 0, createdAt: null },
		key: "github-stats",
		tag: "github",
	},
	{
		name: "Dribbble shots",
		load: getDribbbleShots,
		payload: [shot],
		expected: [shot],
		fallback: [],
		key: "dribbble-shots",
		tag: "dribbble",
	},
];

/** Real local fetches exercise native aborts during headers and streamed JSON. */
async function fixture(context, integration, mode) {
	const requests = [];
	const errors = [];
	const received = [];
	const fetch = globalThis.fetch;
	const server = createServer((_request, response) => {
		received.push(mode);
		if (mode === "headers") {
			return;
		}
		response.writeHead(mode === "http-error" ? 503 : 200, { "Content-Type": "application/json" });
		if (mode === "body") {
			response.write("[");
			return;
		}
		response.end(mode === "invalid-json" ? "{" : JSON.stringify(integration.payload));
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	assert.ok(address && typeof address === "object");
	context.after(async () => {
		server.closeAllConnections();
		await new Promise((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		);
	});
	context.mock.method(console, "error", (...args) => errors.push(args));
	context.mock.method(globalThis, "fetch", (url, options) => {
		requests.push({ url, options });
		return fetch(`http://127.0.0.1:${address.port}/`, options);
	});
	return { requests, errors, server, received };
}

for (const integration of integrations) {
	test(`${integration.name} retains its successful output and cache policy`, {
		timeout: 5000,
	}, async (context) => {
		const { requests, errors } = await fixture(context, integration, "success");
		assert.deepEqual(await integration.load(), integration.expected);
		assert.equal(requests.length, 1);
		assert.ok(requests[0].options.signal instanceof AbortSignal);
		assert.equal(errors.length, 0);
		assert.deepEqual(integration.load.cachePolicy, {
			keys: [integration.key],
			options: { revalidate: 3600, tags: [integration.tag] },
		});
	});

	for (const mode of ["headers", "body"]) {
		test(`${integration.name} aborts stalled ${mode} and returns its fallback`, {
			timeout: 10_000,
		}, async (context) => {
			const { requests, errors, server, received } = await fixture(context, integration, mode);
			const loading = integration.load();
			const guard = new AbortController();
			let result;
			try {
				result = await Promise.race([
					loading,
					delay(6500, "still waiting", { signal: guard.signal }),
				]);
			} finally {
				guard.abort();
				// Settle the original loader even on a failing pre-fix regression.
				server.closeAllConnections();
				await loading;
			}
			assert.notEqual(
				result,
				"still waiting",
				"the loader must fall back when its deadline expires"
			);
			assert.deepEqual(result, integration.fallback);
			assert.equal(requests[0].options.signal.aborted, true);
			assert.deepEqual(received, [mode], "the local server reached the stalled phase");
			assert.equal(errors.length, 1);
		});
	}

	for (const mode of ["http-error", "invalid-json"]) {
		test(`${integration.name} preserves its ${mode} fallback`, {
			timeout: 5000,
		}, async (context) => {
			const { errors } = await fixture(context, integration, mode);
			assert.deepEqual(await integration.load(), integration.fallback);
			assert.equal(errors.length, 1);
		});
	}
}
