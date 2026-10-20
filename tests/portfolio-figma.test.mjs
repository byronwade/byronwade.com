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
		if (specifier === "next/server") {
			return nextResolve("next/server.js", context);
		}
		if (specifier === "next/cache" || specifier === "figma-js") {
			return { url: `fixture:${specifier}`, shortCircuit: true };
		}
		if (specifier === "fixture:actual-figma") {
			return nextResolve("figma-js", { ...context, parentURL: import.meta.url });
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url === "fixture:next/cache") {
			return {
				format: "module",
				shortCircuit: true,
				source: `export function unstable_cache(fn, keys, options) {
  return Object.assign(fn, { cachePolicy: { keys, options } });
}`,
			};
		}
		if (url === "fixture:figma-js") {
			return {
				format: "module",
				shortCircuit: true,
				source: `import { Client as actualClient } from "fixture:actual-figma";
export const fixture = { baseURL: "", requests: [] };
export function Client(options) {
  const sdk = actualClient(options);
  if (!fixture.baseURL) throw new Error("Figma fixtures require a local server");
  sdk.client.defaults.baseURL = fixture.baseURL;
  sdk.client.defaults.proxy = false;
  sdk.client.interceptors.request.use(config => {
    fixture.requests.push(config);
    return config;
  });
  return sdk;
}`,
			};
		}
		return nextLoad(url, context);
	},
});

const { fixture: sdk } = await import("figma-js");
const { getFigmaFiles, getFigmaFile } = await import("../lib/portfolio-data.ts");
const { GET } = await import("../app/api/portfolio/route.ts");
// Let Node's module-format warning settle before capturing loader diagnostics.
await delay(0);
const button = { key: "component-key", name: "Button", description: "Primary action" };
const file = {
	name: "Fixture design",
	lastModified: "2026-10-19T12:00:00Z",
	document: {
		id: "0:0",
		name: "Document",
		type: "DOCUMENT",
		children: [
			{
				id: "0:1",
				name: "Cover",
				type: "CANVAS",
				children: [{ id: "1:1", name: "Frame", type: "FRAME", children: [] }],
			},
			{ id: "0:2", name: "Screens", type: "CANVAS", children: [] },
		],
	},
	components: { "1:2": button },
	styles: { "S:1": { key: "style-key", name: "Brand", styleType: "FILL" } },
	version: "fixture-version",
};
const summary = {
	key: "fixture-key",
	name: file.name,
	last_modified: file.lastModified,
	thumbnail_url: "https://images.example/fixture.png",
};
/** Only what the detail page renders; the document tree itself is never cached. */
const detail = {
	name: file.name,
	lastModified: file.lastModified,
	version: file.version,
	pageCount: 2,
	components: [{ id: "1:2", name: button.name, description: button.description }],
	styleCount: 1,
};

const INVALID_TEAM_RESPONSE = /Invalid Figma team projects response/;
const EVERY_PROJECT_FAILED = /Every Figma project request failed/;

/** Finish a fixture response, optionally after a delay inside the client's deadline. */
function finish(response, body, delayMs) {
	if (delayMs === undefined) {
		response.end(body);
	} else {
		setTimeout(() => response.end(body), delayMs);
	}
}

/** The real SDK and Axios adapter run against loopback HTTP, never Figma. */
async function fixture(
	context,
	{ target, mode = "success", projects = [{ id: 1 }], responses = {}, delays = {} } = {}
) {
	const previousToken = process.env.FIGMA_ACCESS_TOKEN;
	const previousTeam = process.env.FIGMA_TEAM_ID;
	process.env.FIGMA_ACCESS_TOKEN = "synthetic-test-token";
	process.env.FIGMA_TEAM_ID = "fixture-team";
	context.after(() => {
		for (const [name, value] of [
			["FIGMA_ACCESS_TOKEN", previousToken],
			["FIGMA_TEAM_ID", previousTeam],
		]) {
			if (value === undefined) {
				delete process.env[name];
			} else {
				process.env[name] = value;
			}
		}
	});
	const received = [];
	const errors = [];
	const warnings = [];
	const stalled = [];
	context.mock.method(console, "error", (...args) => errors.push(args));
	context.mock.method(console, "warn", (...args) => warnings.push(args));
	const server = createServer((request, response) => {
		const path = request.url.split("?")[0];
		received.push(path);
		const selected = path === target;
		if (selected && (mode === "headers" || mode === "body")) {
			const connection = { closed: false };
			stalled.push(connection);
			response.on("close", () => {
				connection.closed = true;
			});
			if (mode === "body") {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.write("{");
			}
			return;
		}
		response.writeHead(selected && mode === "http-error" ? 503 : 200, {
			"Content-Type": "application/json",
		});
		const data = path.startsWith("/teams/")
			? { projects }
			: path.startsWith("/projects/")
				? {
						files: Array.from({ length: 14 }, (_, index) => ({
							...summary,
							key: `project-${path.split("/")[2]}-file-${index}`,
							last_modified: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
						})),
					}
				: file;
		// The detail lookup finds this exact thumbnail in the existing list loader.
		if (path === "/projects/1/files" && projects.length === 1) {
			data.files = [summary];
		}
		const body = JSON.stringify(Object.hasOwn(responses, path) ? responses[path] : data);
		finish(response, body, delays[path]);
	});
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	assert.ok(address && typeof address === "object");
	sdk.baseURL = `http://127.0.0.1:${address.port}/`;
	sdk.requests = [];
	context.after(async () => {
		server.closeAllConnections();
		await new Promise((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		);
		sdk.baseURL = "";
	});
	return { received, errors, warnings, stalled };
}

test("Figma list preserves field mapping, ordering, caps and cache policy", {
	timeout: 5000,
}, async (t) => {
	const { received, errors } = await fixture(t, {
		projects: Array.from({ length: 8 }, (_, index) => ({ id: index + 1 })),
	});
	const files = await getFigmaFiles();
	assert.equal(files.length, 30);
	assert.equal(received.length, 7, "only the first six projects are loaded");
	assert.ok(files.every((item) => Number(item.key.split("-").at(-1)) < 12));
	assert.ok(
		files.every(
			(item, index) => index === 0 || files[index - 1].last_modified >= item.last_modified
		)
	);
	assert.equal(files[0].name, summary.name);
	assert.equal(files[0].thumbnail_url, summary.thumbnail_url);
	assert.equal(
		errors.length,
		0,
		JSON.stringify(
			errors.map((args) => args.map((value) => (value instanceof Error ? value.message : value)))
		)
	);
	assert.deepEqual(getFigmaFiles.cachePolicy, {
		keys: ["figma-files"],
		options: { revalidate: 3600, tags: ["figma"] },
	});
	assert.equal(
		new Set(sdk.requests.map((request) => request.signal)).size,
		7,
		"each SDK request needs its own deadline, including parallel projects"
	);
});

test("Figma detail projects the document, cached-list thumbnail and cache policy", {
	timeout: 5000,
}, async (t) => {
	const { errors, warnings } = await fixture(t);
	const load = getFigmaFile(summary.key);
	assert.deepEqual(await load(), { ...detail, thumbnailUrl: summary.thumbnail_url });
	assert.equal(errors.length, 0);
	assert.equal(warnings.length, 0);
	assert.deepEqual(load.cachePolicy, {
		keys: ["figma-file", summary.key],
		options: { revalidate: 7200, tags: ["figma"] },
	});
});

// The list rejects so the API can report an outage; the detail page keeps its null fallback.
const operations = [
	{
		name: "team projects",
		path: "/teams/fixture-team/projects",
		load: getFigmaFiles,
		rejects: true,
		logs: 1,
		budget: 3000,
	},
	{
		name: "project files",
		path: "/projects/1/files",
		load: getFigmaFiles,
		rejects: true,
		// The project failure, then the list-level "every project failed" outcome.
		logs: 2,
		budget: 5000,
	},
	{
		name: "file detail",
		path: `/files/${summary.key}`,
		load: () => getFigmaFile(summary.key)(),
		fallback: null,
		logs: 1,
		budget: 2000,
	},
];

async function settle(load) {
	try {
		return { value: await load() };
	} catch (error) {
		return { error };
	}
}

for (const operation of operations) {
	for (const mode of ["headers", "body", "http-error"]) {
		test(`Figma ${operation.name} cancels or settles ${mode} with its failure outcome`, {
			timeout: 12_000,
		}, async (t) => {
			const { errors, stalled, received } = await fixture(t, { target: operation.path, mode });
			const started = performance.now();
			const result = await settle(operation.load);
			assert.ok(
				performance.now() - started < operation.budget + 2000,
				"the existing per-operation deadline must remain bounded"
			);
			if (operation.rejects) {
				assert.ok(result.error instanceof Error, "an outage must not resolve as an empty list");
			} else {
				assert.deepEqual(result, { value: operation.fallback });
			}
			assert.ok(received.includes(operation.path));
			assert.equal(errors.length, operation.logs);
			if (mode !== "http-error") {
				assert.ok(
					performance.now() - started >= operation.budget - 100,
					"a timeout must preserve the existing request budget"
				);
				await delay(100);
				assert.equal(stalled.length, 1);
				assert.equal(
					stalled[0].closed,
					true,
					"returning a fallback must also close the network request"
				);
				const request = sdk.requests.find((item) => item.url === operation.path.slice(1));
				assert.ok(request.signal instanceof AbortSignal);
				assert.equal(request.signal.aborted, true);
			}
			assert.ok(
				errors.every((args) => args.every((argument) => typeof argument === "string")),
				"SDK error logs must not serialize Axios request configuration or access tokens"
			);
			assert.ok(!JSON.stringify(errors).includes("synthetic-test-token"));
		});
	}
}

for (const mode of ["headers", "body", "http-error"]) {
	test(`Figma retains healthy sibling files after one project's ${mode} failure`, {
		timeout: 12_000,
	}, async (t) => {
		const { errors, stalled } = await fixture(t, {
			target: "/projects/2/files",
			mode,
			projects: [{ id: 1 }, { id: 2 }],
		});
		const files = await getFigmaFiles();
		assert.equal(files.length, 12);
		assert.ok(files.every((item) => item.key.startsWith("project-1-file-")));
		assert.equal(errors.length, 1);
		if (mode !== "http-error") {
			await delay(100);
			assert.equal(stalled[0].closed, true);
		}
	});
}

for (const missing of ["FIGMA_ACCESS_TOKEN", "FIGMA_TEAM_ID"]) {
	test(`Figma list makes no request without ${missing}`, async (t) => {
		const { received } = await fixture(t);
		delete process.env[missing];
		assert.deepEqual(await getFigmaFiles(), []);
		assert.deepEqual(received, []);
	});
}

test("Figma detail makes no request without an access token", async (t) => {
	const { received } = await fixture(t);
	delete process.env.FIGMA_ACCESS_TOKEN;
	assert.equal(await getFigmaFile(summary.key)(), null);
	assert.deepEqual(received, []);
});

test("Figma detail survives an unavailable thumbnail list", { timeout: 5000 }, async (t) => {
	await fixture(t, { target: "/teams/fixture-team/projects", mode: "http-error" });
	assert.deepEqual(await getFigmaFile(summary.key)(), { ...detail, thumbnailUrl: null });
});

// The SDK concatenates the key into "files/<key>", so anything beyond one plain path
// segment would let a visitor steer an authenticated request to another endpoint.
const unsafeFileKeys = [
	"../me",
	"..",
	"%2e%2e",
	"abc/nodes",
	"abc?depth=1",
	"abc#fragment",
	"a%2Fb",
	"",
	" ",
	"fixture key",
	"fixture-key\n",
	"fixture-key\r",
	"fixture-key\t",
	"fixture-key\u2028",
	"fixture-key\u2029",
	"a".repeat(129),
];

for (const key of unsafeFileKeys) {
	test(`Figma detail rejects unsafe file key ${JSON.stringify(key.slice(0, 16))} without a request`, async (t) => {
		const { received, errors } = await fixture(t);
		assert.equal(await getFigmaFile(key)(), null);
		assert.deepEqual(received, []);
		assert.deepEqual(sdk.requests, []);
		assert.equal(errors.length, 0);
	});
}

test("Figma detail accepts the longest plain file key", async (t) => {
	const key = "A_b-9".repeat(25).padEnd(128, "z");
	const { received } = await fixture(t);
	assert.deepEqual(await getFigmaFile(key)(), { ...detail, thumbnailUrl: null });
	assert.ok(received.includes(`/files/${key}`));
});

test("Figma list accepts the shortest and longest plain file keys unchanged", async (t) => {
	const files = ["a", "A_b-9".repeat(25).padEnd(128, "z")].map((key) => ({ ...summary, key }));
	const { errors, warnings } = await fixture(t, {
		responses: { "/projects/1/files": { files } },
	});
	assert.deepEqual(await getFigmaFiles(), files);
	assert.equal(errors.length, 0);
	assert.equal(warnings.length, 0);
});

const invalidEnvelopes = [
	null,
	[],
	"invalid",
	{},
	{ projects: null, files: null },
	{ projects: {}, files: {} },
];

for (const [index, payload] of invalidEnvelopes.entries()) {
	test(`Figma rejects malformed team envelope ${index} without requesting projects`, async (t) => {
		const { received, errors } = await fixture(t, {
			responses: { "/teams/fixture-team/projects": payload },
		});
		await assert.rejects(getFigmaFiles(), INVALID_TEAM_RESPONSE);
		assert.deepEqual(received, ["/teams/fixture-team/projects"]);
		assert.equal(errors.length, 1);
		assert.ok(errors[0].every((argument) => typeof argument === "string"));
	});

	test(`Figma rejects malformed project envelope ${index} and retains healthy projects`, async (t) => {
		const { errors } = await fixture(t, {
			projects: [{ id: 1 }, { id: 2 }],
			responses: { "/projects/2/files": payload },
		});
		const files = await getFigmaFiles();
		assert.equal(files.length, 12);
		assert.ok(files.every((item) => item.key.startsWith("project-1-file-")));
		assert.equal(errors.length, 1);
	});
}

const invalidProjects = [
	null,
	[],
	"invalid",
	{},
	{ id: null },
	{ id: {} },
	{ id: true },
	{ id: 0 },
	{ id: -1 },
	{ id: 1.5 },
	{ id: Number.MAX_SAFE_INTEGER + 1 },
	{ id: "" },
	{ id: " " },
	{ id: "0" },
	{ id: "../files" },
	{ id: "1?token=synthetic-test-token" },
];

for (const [index, project] of invalidProjects.entries()) {
	test(`Figma rejects all-invalid team project metadata ${index} without requesting files`, async (t) => {
		const { received, errors, warnings } = await fixture(t, { projects: [project] });
		await assert.rejects(getFigmaFiles(), INVALID_TEAM_RESPONSE);
		assert.deepEqual(received, ["/teams/fixture-team/projects"]);
		assert.equal(errors.length, 1);
		assert.equal(warnings.length, 0);
		assert.ok(errors[0].every((argument) => typeof argument === "string"));
		assert.ok(!JSON.stringify(errors).includes("synthetic-test-token"));
	});
}

test("Figma skips malformed project IDs before applying the six-request cap", async (t) => {
	const { received, warnings, errors } = await fixture(t, {
		projects: [
			...invalidProjects,
			{ id: "12345678901234567890" },
			{ id: 1 },
			{ id: 2 },
			{ id: 3 },
			{ id: 4 },
			{ id: 5 },
			{ id: 6 },
		],
	});
	assert.equal((await getFigmaFiles()).length, 30);
	assert.deepEqual(
		received.filter((path) => path.startsWith("/projects/")).sort((a, b) => a.localeCompare(b)),
		[
			"/projects/1/files",
			"/projects/12345678901234567890/files",
			"/projects/2/files",
			"/projects/3/files",
			"/projects/4/files",
			"/projects/5/files",
		]
	);
	assert.equal(warnings.length, 1);
	assert.equal(errors.length, 0);
	assert.ok(!JSON.stringify(warnings).includes("synthetic-test-token"));
});

const invalidFiles = [
	["null", null],
	["array", []],
	["primitive", "invalid"],
	...unsafeFileKeys.map((key, index) => [`unsafe-key-${index}`, { ...summary, key }]),
	...["key", "name", "last_modified"].flatMap((field) =>
		[undefined, null, {}, [], 5, true, "", " "].map((value, index) => [
			`${field}-${index}`,
			{ ...summary, [field]: value },
		])
	),
	...[
		"2026-02-30T12:00:00Z",
		"2026-10-19",
		"2026-10-19T12:00:00",
		"yesterday",
		"2026-10-19T25:00:00Z",
	].map((value) => [`timestamp-${value}`, { ...summary, last_modified: value }]),
	...[
		null,
		{},
		[],
		42,
		true,
		"",
		"relative.png",
		"javascript:alert(1)",
		"data:image/png;base64,AA",
	].map((value, index) => [`thumbnail-${index}`, { ...summary, thumbnail_url: value }]),
];

for (const [label, invalid] of invalidFiles) {
	test(`Figma excludes invalid file ${label} without discarding healthy files in that project`, async (t) => {
		const { errors, warnings } = await fixture(t, {
			responses: { "/projects/1/files": { files: [invalid, summary] } },
		});
		assert.deepEqual(await getFigmaFiles(), [summary]);
		assert.equal(errors.length, 0);
		assert.equal(warnings.length, 1);
		assert.ok(warnings[0].every((argument) => typeof argument === "string"));
	});
}

test("Figma file validation precedes the twelve-file cap and preserves ordering and field projection", async (t) => {
	const healthy = Array.from({ length: 14 }, (_, index) => ({
		...summary,
		key: `valid-${index}`,
		last_modified: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
		unexpected: { secret: "synthetic-test-token" },
	}));
	await fixture(t, {
		responses: { "/projects/1/files": { files: [null, ...healthy] } },
	});
	const files = await getFigmaFiles();
	assert.equal(files.length, 12);
	assert.deepEqual(
		files.map((item) => item.key),
		Array.from({ length: 12 }, (_, index) => `valid-${11 - index}`)
	);
	assert.ok(files.every((item) => !Object.hasOwn(item, "unexpected")));
});

test("Figma preserves a valid file without its optional thumbnail", async (t) => {
	const withoutThumbnail = {
		key: summary.key,
		name: summary.name,
		last_modified: summary.last_modified,
	};
	const { warnings, errors } = await fixture(t, {
		responses: { "/projects/1/files": { files: [withoutThumbnail] } },
	});
	assert.deepEqual(JSON.parse(JSON.stringify(await getFigmaFiles())), [withoutThumbnail]);
	assert.deepEqual(await getFigmaFile(summary.key)(), { ...detail, thumbnailUrl: null });
	assert.equal(warnings.length, 0);
	assert.equal(errors.length, 0);
});

test("Figma accepts complete timestamps with offsets and fractional seconds", async (t) => {
	const files = [
		{ ...summary, key: "older", last_modified: "2026-10-19T12:00:00.123+01:00" },
		{ ...summary, key: "newer", last_modified: "2026-10-19T11:30:00Z" },
	];
	const { errors, warnings } = await fixture(t, {
		responses: { "/projects/1/files": { files } },
	});
	assert.deepEqual(await getFigmaFiles(), [files[1], files[0]]);
	assert.equal(errors.length, 0);
	assert.equal(warnings.length, 0);
});

test("Figma rejects a project whose every file fails validation instead of caching no files", async (t) => {
	const { warnings, errors } = await fixture(t, {
		responses: { "/projects/1/files": { files: invalidFiles.map(([, value]) => value) } },
	});
	await assert.rejects(getFigmaFiles(), EVERY_PROJECT_FAILED);
	assert.equal(warnings.length, 0);
	assert.equal(errors.length, 2);
	assert.ok(errors.every((args) => args.every((argument) => typeof argument === "string")));
});

test("Figma keeps healthy projects when another project's files all fail validation", async (t) => {
	const { errors } = await fixture(t, {
		projects: [{ id: 1 }, { id: 2 }],
		responses: { "/projects/2/files": { files: [null, { ...summary, name: {} }] } },
	});
	const files = await getFigmaFiles();
	assert.equal(files.length, 12);
	assert.ok(files.every((item) => item.key.startsWith("project-1-file-")));
	assert.equal(errors.length, 1);
});

test("Figma rejects when every project request fails", { timeout: 5000 }, async (t) => {
	const { errors } = await fixture(t, {
		projects: [{ id: 1 }, { id: 2 }],
		responses: { "/projects/1/files": null, "/projects/2/files": { files: null } },
	});
	await assert.rejects(getFigmaFiles(), EVERY_PROJECT_FAILED);
	assert.equal(errors.length, 3);
});

for (const [name, value] of [
	["FIGMA_ACCESS_TOKEN", ""],
	["FIGMA_TEAM_ID", "  "],
]) {
	test(`Figma list treats a blank ${name} as unconfigured and makes no request`, async (t) => {
		const { received, errors } = await fixture(t);
		process.env[name] = value;
		assert.deepEqual(await getFigmaFiles(), []);
		assert.deepEqual(received, []);
		assert.equal(errors.length, 0);
	});
}

for (const projects of [[], [{ id: 1 }]]) {
	test(`Figma preserves a genuinely empty ${projects.length ? "project" : "team"} list`, async (t) => {
		const { errors, warnings } = await fixture(t, {
			projects,
			responses: { "/projects/1/files": { files: [] } },
		});
		assert.deepEqual(await getFigmaFiles(), []);
		assert.equal(errors.length, 0);
		assert.equal(warnings.length, 0);
	});
}

for (const [label, payload, expected, degraded, projects = [{ id: 1 }]] of [
	["mixed metadata", { files: [null, { ...summary, name: {} }, summary] }, [summary], false],
	["malformed envelope", null, [], true],
	["all-invalid file keys", { files: [{ ...summary, key: "../me" }] }, [], true],
	["all-invalid team projects", { files: [] }, [], true, invalidProjects],
]) {
	test(`Figma ${label} preserves the portfolio API shape and healthy provider data`, async (t) => {
		await fixture(t, { projects, responses: { "/projects/1/files": payload } });
		t.mock.method(globalThis, "fetch", (url) => {
			const { origin, pathname } = new URL(url);
			if (origin === "https://api.dribbble.com") {
				return Promise.resolve(Response.json([]));
			}
			assert.equal(origin, "https://api.github.com");
			return Promise.resolve(
				Response.json(
					pathname.endsWith("/repos")
						? []
						: {
								public_repos: 4,
								followers: 2,
								following: 1,
								created_at: "2020-01-01T00:00:00Z",
							}
				)
			);
		});
		const response = await GET();
		assert.equal(response.status, 200);
		const body = await response.json();
		assert.deepEqual(
			Object.keys(body).sort((a, b) => a.localeCompare(b)),
			["degraded", "figmaFiles", "githubFailed", "portfolioStats", "repos", "shots", "stats"]
		);
		assert.deepEqual(body.figmaFiles, expected);
		assert.deepEqual(body.stats, {
			publicRepos: 4,
			followers: 2,
			following: 1,
			createdAt: "2020-01-01T00:00:00Z",
		});
		assert.deepEqual(body.repos, []);
		assert.deepEqual(body.shots, []);
		assert.equal(body.githubFailed, false);
		assert.equal(body.degraded, degraded, "a Figma outage is degraded; filtered records are not");
		assert.equal(
			response.headers.get("Cache-Control"),
			degraded ? "no-store" : "public, s-maxage=3600, stale-while-revalidate=86400"
		);
	});
}

test("portfolio API stops waiting on a slow Figma list before the page's deadline", {
	timeout: 15_000,
}, async (t) => {
	// A team listing that answers just inside its own deadline, then a stalled project:
	// the loaders alone would hold the response for about eight seconds.
	await fixture(t, {
		target: "/projects/1/files",
		mode: "headers",
		delays: { "/teams/fixture-team/projects": 2500 },
	});
	t.mock.method(globalThis, "fetch", (url) => {
		const { pathname } = new URL(url);
		return Promise.resolve(
			Response.json(
				pathname.endsWith("/repos")
					? []
					: { public_repos: 4, followers: 2, following: 1, created_at: "2020-01-01T00:00:00Z" }
			)
		);
	});
	const started = performance.now();
	const response = await GET();
	const elapsed = performance.now() - started;
	const body = await response.json();
	assert.ok(elapsed < 7000, `the API answered after ${Math.round(elapsed)} ms`);
	assert.ok(
		elapsed >= 5900,
		"the optional-provider budget, not an earlier failure, ended the wait"
	);
	assert.deepEqual(body.figmaFiles, []);
	assert.equal(body.githubFailed, false);
	assert.equal(body.degraded, true);
	assert.equal(response.headers.get("Cache-Control"), "no-store");
	// The loader still cancels its own stalled request at the five-second project deadline.
	await delay(2000);
});

const detailPath = `/files/${summary.key}`;

// Each of these used to reach the page: strings gave false counts through `.length` and
// `Object.keys`, a numeric name crashed `.charAt`, and a bad date rendered "Invalid Date".
const invalidDetails = [
	["null", null],
	["array", []],
	["primitive", "invalid"],
	...[undefined, null, {}, [], 5, "", " "].map((value, index) => [
		`name-${index}`,
		{ ...file, name: value },
	]),
	...[undefined, null, 5, "2026-02-30T12:00:00Z", "2026-10-19", "yesterday"].map((value, index) => [
		`lastModified-${index}`,
		{ ...file, lastModified: value },
	]),
	...[
		undefined,
		null,
		"document",
		[],
		{ ...file.document, children: "abcdef" },
		{ ...file.document, children: {} },
		{ ...file.document, children: undefined },
	].map((value, index) => [`document-${index}`, { ...file, document: value }]),
	...["components", "styles"].flatMap((field) =>
		[null, "abcdef", [], 5, true].map((value, index) => [
			`${field}-${index}`,
			{ ...file, [field]: value },
		])
	),
];

for (const [label, payload] of invalidDetails) {
	test(`Figma detail rejects malformed ${label} payload instead of rendering it`, async (t) => {
		const { errors, warnings, received } = await fixture(t, {
			responses: { [detailPath]: payload },
		});
		assert.equal(await getFigmaFile(summary.key)(), null);
		assert.ok(received.includes(detailPath));
		assert.equal(errors.length, 1);
		assert.equal(warnings.length, 0);
		assert.ok(errors[0].every((argument) => typeof argument === "string"));
		assert.ok(!JSON.stringify(errors).includes("synthetic-test-token"));
	});
}

const unnamed = { key: "unnamed-key" };
const partialDetails = [
	[
		"component entries",
		{
			...file,
			components: {
				"9:1": null,
				"9:2": "Button",
				"9:3": [],
				"9:4": { ...button, name: 5 },
				"9:5": { ...button, name: {} },
				"9:6": { ...button, description: {} },
				"1:2": button,
			},
		},
		{ components: detail.components },
	],
	[
		"style entries",
		{ ...file, styles: { "S:2": null, "S:3": "Brand", "S:4": 5, "S:5": [], ...file.styles } },
		{ styleCount: 1 },
	],
	[
		"page entries",
		{
			...file,
			document: {
				...file.document,
				children: [null, "Cover", 5, {}, { type: "FRAME" }, ...file.document.children],
			},
		},
		{ pageCount: 2 },
	],
	...[5, {}, [], ""].map((value, index) => [
		`version-${index}`,
		{ ...file, version: value },
		{ version: undefined },
	]),
];

for (const [label, payload, expected] of partialDetails) {
	test(`Figma detail omits malformed ${label} and keeps the healthy file`, async (t) => {
		const { errors, warnings } = await fixture(t, { responses: { [detailPath]: payload } });
		assert.deepEqual(await getFigmaFile(summary.key)(), {
			...detail,
			...expected,
			thumbnailUrl: summary.thumbnail_url,
		});
		assert.equal(errors.length, 0);
		assert.equal(warnings.length, 1);
		assert.ok(warnings[0].every((argument) => typeof argument === "string"));
	});
}

test("Figma detail keeps genuinely absent optional metadata without warnings", async (t) => {
	const { components, styles, version, ...required } = file;
	const { errors, warnings } = await fixture(t, {
		responses: {
			[detailPath]: {
				...required,
				document: { ...file.document, children: [] },
				components: { "1:3": unnamed },
			},
		},
	});
	assert.deepEqual(await getFigmaFile(summary.key)(), {
		...detail,
		version: undefined,
		pageCount: 0,
		components: [{ id: "1:3", name: undefined, description: undefined }],
		styleCount: 0,
		thumbnailUrl: summary.thumbnail_url,
	});
	assert.equal(errors.length, 0);
	assert.equal(warnings.length, 0);
});
