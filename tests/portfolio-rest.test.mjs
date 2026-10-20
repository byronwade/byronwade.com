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
	html_url: "https://github.com/byronwade/site",
	description: null,
	homepage: null,
	language: null,
	fork: false,
	forks_count: 0,
	stargazers_count: 2,
	created_at: "2026-01-01T12:00:00Z",
	updated_at: "2026-10-19T12:00:00Z",
};
const shot = {
	id: 1,
	title: "A design",
	html_url: "https://dribbble.com/shots/1-example",
	images: {
		normal: "https://image.example/shot.jpg",
		hidpi: null,
		teaser: "https://image.example/teaser.jpg",
	},
};
const profile = {
	public_repos: 12,
	followers: 3,
	following: 4,
	created_at: "2020-01-01T00:00:00Z",
};
const integrations = [
	{
		name: "GitHub repositories",
		load: getGitHubRepositories,
		payload: [repository],
		expected: [repository],
		fallback: [],
		rejects: true,
		key: "github-repos",
		tag: "github",
	},
	{
		name: "GitHub profile",
		load: getGitHubStats,
		payload: profile,
		expected: { publicRepos: 12, followers: 3, following: 4, createdAt: profile.created_at },
		rejects: true,
		key: "github-stats",
		tag: "github",
	},
	{
		name: "Dribbble shots",
		load: getDribbbleShots,
		payload: [shot],
		expected: [shot],
		rejects: true,
		key: "dribbble-shots",
		tag: "dribbble",
	},
];
const DRIBBBLE_TOKEN = "synthetic-dribbble-token";

/** Real local fetches exercise native aborts during headers and streamed JSON. */
async function fixture(context, integration, mode, { dribbbleToken = DRIBBBLE_TOKEN } = {}) {
	const requests = [];
	const errors = [];
	const received = [];
	const fetch = globalThis.fetch;
	const previousToken = process.env.DRIBBBLE_TOKEN;
	if (dribbbleToken === null) {
		delete process.env.DRIBBBLE_TOKEN;
	} else {
		process.env.DRIBBBLE_TOKEN = dribbbleToken;
	}
	context.after(() => {
		if (previousToken === undefined) {
			delete process.env.DRIBBBLE_TOKEN;
		} else {
			process.env.DRIBBBLE_TOKEN = previousToken;
		}
	});
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

// Capture both outcomes immediately so a rejected request never goes unhandled.
async function loadOutcome(integration) {
	try {
		return { value: await integration.load() };
	} catch (error) {
		return { error };
	}
}

function assertFailure(integration, result) {
	if (integration.rejects) {
		assert.ok(result.error instanceof Error, `the API must receive the ${integration.name} failure`);
	} else {
		assert.deepEqual(result, { value: integration.fallback });
	}
}

const invalidShotFields = [
	["id", [undefined, null, "1", 0, -1, 0.5, Number.MAX_SAFE_INTEGER + 1]],
	["title", [undefined, null, 42, {}, [], "", "   "]],
	["html_url", [undefined, null, {}, "", "/shot", "javascript:alert(1)", "data:text/html,test"]],
	["images", [undefined, null, "image", [], {}, { ...shot.images, normal: null }]],
	["description", [42, {}, [], false]],
	["animated", [null, "false", 0, {}]],
	["tags", [null, "design", {}, ["valid", 42]]],
	["colors", [null, "blue", {}, ["valid", 42]]],
	...["width", "height"].map((field) => [field, [null, "400", 0, -1, 0.5]]),
	...["likes_count", "views_count", "comments_count", "buckets_count", "rebounds_count"].map(
		(field) => [field, [null, "0", -1, 0.5, Number.MAX_SAFE_INTEGER + 1]]
	),
	...["published_at", "updated_at"].map((field) => [
		field,
		[null, 42, {}, "", "2026", "2026-01-01", "2026-02-30T12:00:00Z", "2026-01-01T00:00:00"],
	]),
];

for (const [field, values] of invalidShotFields) {
	for (const [index, value] of values.entries()) {
		test(`Dribbble validation omits malformed ${field} variant ${index + 1} and keeps siblings`, {
			timeout: 5000,
		}, async (context) => {
			const next = { ...shot, id: 3 };
			await fixture(
				context,
				{ payload: [shot, { ...shot, id: 2, [field]: value }, next] },
				"success"
			);
			assert.deepEqual(await getDribbbleShots(), [shot, next]);
		});
	}
}

for (const field of ["normal", "teaser", "hidpi", "four_x", "two_x", "one_x"]) {
	const values = [42, {}, [], "", "/image", "javascript:alert(1)", "data:image/png;base64,test"];
	if (["normal", "teaser", "hidpi"].includes(field)) {
		values.push(undefined);
	}
	if (["normal", "teaser"].includes(field)) {
		values.push(null);
	}
	for (const [index, value] of values.entries()) {
		test(`Dribbble validation omits malformed images.${field} variant ${index + 1}`, {
			timeout: 5000,
		}, async (context) => {
			await fixture(
				context,
				{ payload: [{ ...shot, images: { ...shot.images, [field]: value } }, shot] },
				"success"
			);
			assert.deepEqual(await getDribbbleShots(), [shot]);
		});
	}
}

for (const [index, payload] of [
	null,
	42,
	"shots",
	{},
	{ shots: [shot] },
	[null, {}, 42, []],
].entries()) {
	test(`Dribbble validation rejects malformed response ${index + 1} instead of caching no shots`, {
		timeout: 5000,
	}, async (context) => {
		await fixture(context, { payload }, "success");
		await assert.rejects(getDribbbleShots(), /Invalid Dribbble shots response/);
	});
}

for (const [label, dribbbleToken] of [
	["unset", null],
	["blank", ""],
	["whitespace", "  "],
]) {
	test(`Dribbble with an ${label} token is a healthy empty list with no request`, {
		timeout: 5000,
	}, async (context) => {
		const { requests, errors } = await fixture(context, { payload: [shot] }, "success", {
			dribbbleToken,
		});
		assert.deepEqual(await getDribbbleShots(), []);
		assert.equal(requests.length, 0, "an unconfigured provider must not send `Bearer undefined`");
		assert.equal(errors.length, 0);
	});
}

test("Dribbble sends the configured token without surrounding whitespace", {
	timeout: 5000,
}, async (context) => {
	const { requests } = await fixture(context, { payload: [shot] }, "success", {
		dribbbleToken: ` ${DRIBBBLE_TOKEN}\n`,
	});
	assert.deepEqual(await getDribbbleShots(), [shot]);
	assert.equal(requests[0].options.headers.Authorization, `Bearer ${DRIBBBLE_TOKEN}`);
});

test("Dribbble validation preserves optional metadata, extra fields, zeros and nullable image variants", {
	timeout: 5000,
}, async (context) => {
	const full = {
		...shot,
		description: null,
		animated: false,
		tags: ["design"],
		colors: [],
		width: 400,
		height: 300,
		likes_count: 0,
		views_count: Number.MAX_SAFE_INTEGER,
		comments_count: 0,
		buckets_count: 0,
		rebounds_count: 0,
		published_at: "2020-02-29T12:00:00-04:00",
		updated_at: "2026-10-19T12:00:00.123Z",
		images: { ...shot.images, four_x: null, two_x: "http://image.example/2x.jpg", one_x: null },
		projects: [{ id: 3, name: "Extra provider metadata" }],
		user: null,
	};
	const payload = [
		full,
		shot,
		{
			...full,
			description: "<p>Literal provider text</p>",
			images: { ...full.images, hidpi: "https://image.example/hd.jpg" },
		},
	];
	const { errors } = await fixture(context, { payload }, "success");
	assert.deepEqual(await getDribbbleShots(), payload);
	assert.equal(errors.length, 0);
});

test("Dribbble validation preserves a genuinely empty response without diagnostics", {
	timeout: 5000,
}, async (context) => {
	const { errors } = await fixture(context, { payload: [] }, "success");
	assert.deepEqual(await getDribbbleShots(), []);
	assert.equal(errors.length, 0);
});

test("Dribbble validation rejects all-invalid shots as a failure without logging payloads", {
	timeout: 5000,
}, async (context) => {
	const payload = [{ ...shot, title: { untrusted: "synthetic-private-provider-value" } }];
	const { errors } = await fixture(context, { payload }, "success");
	await assert.rejects(getDribbbleShots(), /Invalid Dribbble shots response/);
	assert.equal(errors.length, 1);
	assert.ok(!JSON.stringify(errors).includes("synthetic-private-provider-value"));
});

const INVALID_REPOSITORY_RESPONSE = /Invalid GitHub repository response/;
const INVALID_PROFILE_RESPONSE = /Invalid GitHub profile response/;
const invalidProfileFields = [
	...["public_repos", "followers", "following"].map((field) => [
		field,
		[undefined, null, "0", -1, 0.5, Number.MAX_SAFE_INTEGER + 1, {}, [], false],
	]),
	[
		"created_at",
		[
			undefined,
			null,
			42,
			{},
			[],
			"",
			"not a date",
			"2020",
			"2020-01-01",
			"2026-02-30T12:00:00Z",
			"2020-01-01T00:00:00",
		],
	],
];

for (const [field, invalidValues] of invalidProfileFields) {
	for (const [index, value] of invalidValues.entries()) {
		test(`profile validation rejects malformed ${field} variant ${index + 1}`, {
			timeout: 5000,
		}, async (context) => {
			await fixture(context, { payload: { ...profile, [field]: value } }, "success");
			await assert.rejects(getGitHubStats(), INVALID_PROFILE_RESPONSE);
		});
	}
}

for (const [index, payload] of [null, 42, "profile", [], {}, [profile]].entries()) {
	test(`profile validation rejects malformed response ${index + 1}`, {
		timeout: 5000,
	}, async (context) => {
		await fixture(context, { payload }, "success");
		await assert.rejects(getGitHubStats(), INVALID_PROFILE_RESPONSE);
	});
}

test("profile validation preserves genuine zero counts, timestamps and the public fields", {
	timeout: 5000,
}, async (context) => {
	const payload = {
		public_repos: 0,
		followers: 0,
		following: Number.MAX_SAFE_INTEGER,
		created_at: "2020-02-29T12:00:00-04:00",
		extra_api_field: { ignored: true },
	};
	const { errors } = await fixture(context, { payload }, "success");
	assert.deepEqual(await getGitHubStats(), {
		publicRepos: 0,
		followers: 0,
		following: Number.MAX_SAFE_INTEGER,
		createdAt: payload.created_at,
	});
	assert.equal(errors.length, 0);
});

const invalidRepositoryFields = [
	["id", [undefined, null, "1", 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]],
	["name", [undefined, null, {}, [], 42, "", "   "]],
	["full_name", [undefined, null, {}, 42, "", "   "]],
	[
		"html_url",
		[undefined, null, {}, "", "/repository", "javascript:alert(1)", "data:text/html,test"],
	],
	["description", [undefined, {}, [], 42, false]],
	["language", [{}, [], 42, false]],
	["homepage", [{}, [], 42]],
	["stargazers_count", [undefined, null, "2", -1, 0.5, Number.MAX_SAFE_INTEGER + 1]],
	["forks_count", [undefined, null, "0", -1, 0.5]],
	["created_at", [{}, 42, "", "not a date", "2026", "2026-01-01", "2026-02-30T12:00:00Z"]],
	["updated_at", [{}, 42, "", "not a date", "2026", "2026-01-01", "2026-02-30T12:00:00Z"]],
	["pushed_at", [{}, [], 42, "", "not a date", "2026", "2026-01-01", "2026-02-30T12:00:00Z"]],
	["fork", [undefined, null, "false", 0, {}]],
	["archived", [null, "false", 0, {}]],
	["topics", [null, "typescript", {}, ["valid", 42]]],
];

for (const [field, invalidValues] of invalidRepositoryFields) {
	for (const [index, value] of invalidValues.entries()) {
		test(`repository validation rejects malformed ${field} variant ${index + 1}`, {
			timeout: 5000,
		}, async (context) => {
			const payload = [{ ...repository, [field]: value }];
			await fixture(context, { payload }, "success");
			await assert.rejects(getGitHubRepositories(), INVALID_REPOSITORY_RESPONSE);
		});
	}
}

for (const [index, entry] of [null, 42, "repository", [], {}].entries()) {
	test(`repository validation rejects malformed list entry ${index + 1}`, {
		timeout: 5000,
	}, async (context) => {
		// Reject the entire payload rather than misrepresenting a partial list as complete.
		await fixture(context, { payload: [repository, entry] }, "success");
		await assert.rejects(getGitHubRepositories(), INVALID_REPOSITORY_RESPONSE);
	});
}

test("repository validation preserves nullable and optional fields and additional API fields", {
	timeout: 5000,
}, async (context) => {
	const payload = [
		{
			...repository,
			pushed_at: null,
			homepage: "",
			topics: [],
			fork: false,
			archived: false,
			additional_api_field: { untouched: true },
		},
		{
			...repository,
			id: 2,
			created_at: null,
			updated_at: null,
			homepage: "example.com",
			description: "A repository",
			language: "TypeScript",
			pushed_at: "2026-10-19T10:00:00-04:00",
		},
		{
			id: 3,
			name: "metadata-free",
			full_name: "byronwade/metadata-free",
			html_url: "https://github.com/byronwade/metadata-free",
			description: null,
			fork: false,
			forks_count: 0,
			stargazers_count: 0,
		},
	];
	const { errors } = await fixture(context, { payload }, "success");
	assert.deepEqual(await getGitHubRepositories(), payload);
	assert.equal(errors.length, 0);
});

test("repository validation retains priority, stars, activity and fork/archive filtering", {
	timeout: 5000,
}, async (context) => {
	const payload = [
		{ ...repository, id: 2, name: "older", stargazers_count: 20, fork: false, archived: false },
		{
			...repository,
			id: 3,
			name: "recent",
			stargazers_count: 20,
			updated_at: "2026-10-20T00:00:00Z",
		},
		{ ...repository, id: 4, name: "fork", fork: true },
		{ ...repository, id: 5, name: "archived", archived: true },
		{ ...repository, id: 6, name: "thorbis-ai", stargazers_count: 0 },
		{ ...repository, id: 7, name: "thorbis.com", stargazers_count: 0 },
		{
			...repository,
			id: 8,
			name: "http-homepage",
			homepage: "http://example.com",
			topics: ["web"],
		},
	];
	await fixture(context, { payload }, "success");
	assert.deepEqual(
		(await getGitHubRepositories()).map((repo) => repo.id),
		[7, 6, 3, 2, 8]
	);
});

test("repository validation accepts a genuinely empty account", {
	timeout: 5000,
}, async (context) => {
	const { errors } = await fixture(context, { payload: [] }, "success");
	assert.deepEqual(await getGitHubRepositories(), []);
	assert.equal(errors.length, 0);
});

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
		test(`${integration.name} aborts stalled ${mode} and preserves its failure outcome`, {
			timeout: 10_000,
		}, async (context) => {
			const { requests, errors, server, received } = await fixture(context, integration, mode);
			const loading = loadOutcome(integration);
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
			assert.notEqual(result, "still waiting", "the loader must settle when its deadline expires");
			assertFailure(integration, result);
			assert.equal(requests[0].options.signal.aborted, true);
			assert.deepEqual(received, [mode], "the local server reached the stalled phase");
			assert.equal(errors.length, 1);
		});
	}

	for (const mode of ["http-error", "invalid-json"]) {
		test(`${integration.name} preserves its ${mode} failure outcome`, {
			timeout: 5000,
		}, async (context) => {
			const { errors } = await fixture(context, integration, mode);
			assertFailure(integration, await loadOutcome(integration));
			assert.equal(errors.length, 1);
		});
	}
}
