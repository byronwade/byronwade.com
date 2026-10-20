import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "server-only") {
			return nextResolve(new URL("./fixtures/server-only.mjs", import.meta.url).href, context);
		}
		if (specifier === "next/server") {
			return nextResolve("next/server.js", context);
		}
		if (specifier === "next/cache" || specifier === "figma-js") {
			return { url: `fixture:outcomes/${specifier}`, shortCircuit: true };
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url === "fixture:outcomes/next/cache") {
			return {
				format: "module",
				shortCircuit: true,
				source: "export function unstable_cache(fn) { return fn; }",
			};
		}
		if (url === "fixture:outcomes/figma-js") {
			return {
				format: "module",
				shortCircuit: true,
				source: `export function Client() { return {
  client: { interceptors: { request: { use: () => undefined } } },
  teamProjects: async () => ({ data: { projects: [] } })
}; }`,
			};
		}
		return nextLoad(url, context);
	},
});

const { GET } = await import("../app/api/portfolio/route.ts");
const repository = {
	id: 1,
	name: "example-project",
	stargazers_count: 3,
	updated_at: "2026-10-01T00:00:00Z",
};
const shots = [{ id: 2, title: "Synthetic design" }];
const stats = { publicRepos: 4, followers: 2, following: 1, createdAt: "2020-01-01" };

function fixture(context, repositories) {
	const requests = [];
	context.mock.method(console, "error", context.mock.fn());
	context.mock.method(console, "warn", context.mock.fn());
	context.mock.method(globalThis, "fetch", (url) => {
		requests.push(url);
		if (url.includes("/repos?")) {
			return repositories();
		}
		return Promise.resolve(
			Response.json(
				url.includes("dribbble.com")
					? shots
					: { public_repos: 4, followers: 2, following: 1, created_at: "2020-01-01" }
			)
		);
	});
	return requests;
}

async function responseBody({ unavailable = false } = {}) {
	const response = await GET();
	assert.equal(response.status, 200);
	const body = await response.json();
	assert.equal(
		body.githubFailed,
		unavailable,
		"GitHub request failure must remain distinguishable"
	);
	assert.equal(
		response.headers.get("Cache-Control"),
		unavailable ? "no-store" : "public, s-maxage=3600, stale-while-revalidate=86400"
	);
	assert.deepEqual(Object.keys(body).sort(), [
		"degraded",
		"figmaFiles",
		"githubFailed",
		"portfolioStats",
		"repos",
		"shots",
		"stats",
	]);
	assert.deepEqual(body.shots, shots, "healthy optional data survives a GitHub failure");
	assert.deepEqual(body.stats, stats, "healthy profile data survives a repository failure");
	return body;
}

for (const [name, repos, expected] of [
	["populated", [repository], [repository]],
	["genuinely empty", [], []],
	[
		"only forks and archived projects",
		[
			{ ...repository, fork: true },
			{ ...repository, archived: true },
		],
		[],
	],
]) {
	test(`portfolio API keeps a successful ${name} account distinct from failure`, async (context) => {
		fixture(context, () => Promise.resolve(Response.json(repos)));
		const body = await responseBody();
		assert.deepEqual(body.repos, expected);
		assert.equal(body.githubFailed, false);
		assert.equal(body.degraded, false);
	});
}

for (const [name, repositories] of [
	[
		"HTTP failure",
		() => Promise.resolve(Response.json({ message: "Unavailable" }, { status: 503 })),
	],
	["invalid JSON", () => Promise.resolve(new Response("{", { status: 200 }))],
	["non-array JSON", () => Promise.resolve(Response.json({ message: "Unexpected payload" }))],
	["network failure", () => Promise.reject(new TypeError("Synthetic connection failure"))],
	["timeout", () => Promise.reject(new DOMException("Synthetic deadline", "TimeoutError"))],
]) {
	test(`portfolio API marks a repository ${name} as unavailable and retains healthy data`, async (context) => {
		const requests = fixture(context, repositories);
		const body = await responseBody({ unavailable: true });
		assert.deepEqual(body.repos, []);
		assert.equal(body.githubFailed, true);
		assert.equal(body.degraded, true);
		assert.equal(requests.length, 3);
	});
}

test("portfolio API recovers on the next successful request after repository failure", async (context) => {
	let failed = true;
	fixture(context, () =>
		failed
			? Promise.reject(new TypeError("Synthetic transient failure"))
			: Promise.resolve(Response.json([repository]))
	);
	assert.equal((await responseBody({ unavailable: true })).githubFailed, true);
	failed = false;
	const body = await responseBody();
	assert.deepEqual(body.repos, [repository]);
	assert.equal(body.githubFailed, false);
	assert.equal(body.degraded, false);
});
