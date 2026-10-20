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
	full_name: "byronwade/example-project",
	html_url: "https://github.com/byronwade/example-project",
	description: null,
	fork: false,
	forks_count: 0,
	stargazers_count: 3,
	updated_at: "2026-10-01T00:00:00Z",
};
const undatedRepository = { ...repository, created_at: null, updated_at: null, pushed_at: null };
const shots = [
	{
		id: 2,
		title: "Synthetic design",
		html_url: "https://dribbble.com/shots/2-example",
		images: {
			normal: "https://image.example/shot.jpg",
			hidpi: null,
			teaser: "https://image.example/teaser.jpg",
		},
	},
];
const stats = { publicRepos: 4, followers: 2, following: 1, createdAt: "2020-01-01T00:00:00Z" };
const profile = {
	public_repos: stats.publicRepos,
	followers: stats.followers,
	following: stats.following,
	created_at: stats.createdAt,
};

function fixture(
	context,
	repositories,
	loadProfile = () => Promise.resolve(Response.json(profile)),
	loadShots = () => Promise.resolve(Response.json(shots))
) {
	const requests = [];
	context.mock.method(console, "error", context.mock.fn());
	context.mock.method(console, "warn", context.mock.fn());
	context.mock.method(globalThis, "fetch", (url) => {
		requests.push(url);
		const { origin, pathname } = new URL(url);
		if (origin === "https://api.github.com") {
			if (pathname === "/users/byronwade/repos") {
				return repositories();
			}
			assert.equal(pathname, "/users/byronwade");
			return loadProfile();
		}
		assert.equal(origin, "https://api.dribbble.com");
		assert.equal(pathname, "/v2/user/shots");
		return loadShots();
	});
	return requests;
}

async function responseBody({
	unavailable = false,
	profileFailed = false,
	expectedShots = shots,
} = {}) {
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
		unavailable || profileFailed
			? "no-store"
			: "public, s-maxage=3600, stale-while-revalidate=86400"
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
	assert.deepEqual(
		body.shots,
		expectedShots,
		"validated optional data survives other provider failures"
	);
	assert.deepEqual(
		body.stats,
		profileFailed ? null : stats,
		"profile failure must not invent counts"
	);
	return body;
}

for (const [name, payload, expectedShots] of [
	["partial shot response", [shots[0], { ...shots[0], id: 3, images: null }], shots],
	["malformed shot response", { message: "unexpected response" }, []],
	["genuinely empty shot response", [], []],
]) {
	test(`portfolio API preserves healthy GitHub data and public fields with a ${name}`, async (context) => {
		fixture(
			context,
			() => Promise.resolve(Response.json([repository])),
			undefined,
			() => Promise.resolve(Response.json(payload))
		);
		const body = await responseBody({ expectedShots });
		assert.deepEqual(body.repos, [repository]);
		assert.equal(body.githubFailed, false);
		assert.equal(
			body.degraded,
			false,
			"the existing optional-provider fallback contract is preserved"
		);
	});
}

for (const [name, repos, expected] of [
	["populated", [repository], [repository]],
	["genuinely empty", [], []],
	["undated", [undatedRepository], [undatedRepository]],
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
	[
		"malformed entry",
		() => Promise.resolve(Response.json([repository, { ...repository, id: 2, name: {} }])),
	],
	[
		"unsafe link",
		() => Promise.resolve(Response.json([{ ...repository, html_url: "javascript:alert(1)" }])),
	],
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

test("portfolio API retries a malformed response without caching it as an empty account", async (context) => {
	let payload = [{ ...repository, pushed_at: "2026-02-30T00:00:00Z" }];
	fixture(context, () => Promise.resolve(Response.json(payload)));
	assert.equal((await responseBody({ unavailable: true })).githubFailed, true);
	payload = [repository];
	const body = await responseBody();
	assert.deepEqual(body.repos, [repository]);
	assert.equal(body.degraded, false);
});

for (const [name, loadProfile] of [
	[
		"HTTP failure",
		() => Promise.resolve(Response.json({ message: "Unavailable" }, { status: 503 })),
	],
	["invalid JSON", () => Promise.resolve(new Response("{", { status: 200 }))],
	["malformed counts", () => Promise.resolve(Response.json({ ...profile, followers: "2" }))],
	["malformed date", () => Promise.resolve(Response.json({ ...profile, created_at: null }))],
	["network failure", () => Promise.reject(new TypeError("Synthetic profile connection failure"))],
	["timeout", () => Promise.reject(new DOMException("Synthetic profile deadline", "TimeoutError"))],
]) {
	test(`portfolio API marks profile ${name} as degraded and retains healthy repositories`, async (context) => {
		fixture(context, () => Promise.resolve(Response.json([repository])), loadProfile);
		const body = await responseBody({ profileFailed: true });
		assert.deepEqual(body.repos, [repository]);
		assert.equal(body.githubFailed, false, "a profile failure does not mean repositories failed");
		assert.equal(body.degraded, true);
	});
}

test("portfolio API distinguishes genuine zero profile counts from an unavailable profile", async (context) => {
	fixture(
		context,
		() => Promise.resolve(Response.json([])),
		() =>
			Promise.resolve(Response.json({ ...profile, public_repos: 0, followers: 0, following: 0 }))
	);
	const response = await GET();
	assert.equal(response.status, 200);
	assert.equal(
		response.headers.get("Cache-Control"),
		"public, s-maxage=3600, stale-while-revalidate=86400"
	);
	const body = await response.json();
	assert.deepEqual(body.stats, {
		publicRepos: 0,
		followers: 0,
		following: 0,
		createdAt: stats.createdAt,
	});
	assert.deepEqual(body.repos, []);
	assert.equal(body.githubFailed, false);
	assert.equal(body.degraded, false);
});

test("portfolio API recovers profile data on the next request without hiding healthy repositories", async (context) => {
	let failed = true;
	fixture(
		context,
		() => Promise.resolve(Response.json([repository])),
		() =>
			failed
				? Promise.resolve(Response.json({ ...profile, following: -1 }))
				: Promise.resolve(Response.json(profile))
	);
	assert.equal((await responseBody({ profileFailed: true })).degraded, true);
	failed = false;
	const body = await responseBody();
	assert.deepEqual(body.repos, [repository]);
	assert.equal(body.degraded, false);
});

test("portfolio API retains healthy optional data when repositories and profile both fail", async (context) => {
	fixture(
		context,
		() => Promise.reject(new TypeError("Synthetic repository failure")),
		() => Promise.reject(new TypeError("Synthetic profile failure"))
	);
	const body = await responseBody({ unavailable: true, profileFailed: true });
	assert.deepEqual(body.repos, []);
	assert.equal(body.degraded, true);
});
