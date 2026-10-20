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
// Let Node's module-format warning settle before capturing loader diagnostics.
await delay(0);
const file = {
	name: "Fixture design",
	lastModified: "2026-10-19T12:00:00Z",
	document: { id: "0:0", name: "Document", type: "DOCUMENT", children: [] },
	components: {},
	styles: {},
	version: "fixture-version",
};
const summary = {
	key: "fixture-key",
	name: file.name,
	last_modified: file.lastModified,
	thumbnail_url: "https://images.example/fixture.png",
};

/** The real SDK and Axios adapter run against loopback HTTP, never Figma. */
async function fixture(context, { target, mode = "success", projects = [{ id: 1 }] } = {}) {
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
	const stalled = [];
	context.mock.method(console, "error", (...args) => errors.push(args));
	context.mock.method(console, "warn", context.mock.fn());
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
							key: `${path}-${index}`,
							last_modified: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
						})),
					}
				: file;
		// The detail lookup finds this exact thumbnail in the existing list loader.
		if (path === "/projects/1/files" && projects.length === 1) {
			data.files = [summary];
		}
		response.end(JSON.stringify(data));
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
	return { received, errors, stalled };
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

test("Figma detail preserves document, cached-list thumbnail and cache policy", {
	timeout: 5000,
}, async (t) => {
	const { errors } = await fixture(t);
	const load = getFigmaFile(summary.key);
	assert.deepEqual(await load(), { ...file, thumbnailUrl: summary.thumbnail_url, imageUrl: null });
	assert.equal(errors.length, 0);
	assert.deepEqual(load.cachePolicy, {
		keys: ["figma-file", summary.key],
		options: { revalidate: 7200, tags: ["figma"] },
	});
});

const operations = [
	{
		name: "team projects",
		path: "/teams/fixture-team/projects",
		load: getFigmaFiles,
		fallback: [],
		budget: 3000,
	},
	{
		name: "project files",
		path: "/projects/1/files",
		load: getFigmaFiles,
		fallback: [],
		budget: 5000,
	},
	{
		name: "file detail",
		path: `/files/${summary.key}`,
		load: () => getFigmaFile(summary.key)(),
		fallback: null,
		budget: 2000,
	},
];

for (const operation of operations) {
	for (const mode of ["headers", "body", "http-error"]) {
		test(`Figma ${operation.name} cancels or settles ${mode} and retains its fallback`, {
			timeout: 12_000,
		}, async (t) => {
			const { errors, stalled, received } = await fixture(t, { target: operation.path, mode });
			const started = performance.now();
			const result = await operation.load();
			assert.ok(
				performance.now() - started < operation.budget + 2000,
				"the existing per-operation deadline must remain bounded"
			);
			assert.deepEqual(result, operation.fallback);
			assert.ok(received.includes(operation.path));
			assert.equal(errors.length, 1);
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
				errors[0].every((argument) => typeof argument === "string"),
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
		assert.ok(files.every((item) => item.key.startsWith("/projects/1/files-")));
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
	assert.deepEqual(await getFigmaFile(summary.key)(), {
		...file,
		thumbnailUrl: null,
		imageUrl: null,
	});
});
