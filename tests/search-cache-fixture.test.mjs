import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { nodeFs } from "next/dist/server/lib/node-fs-methods.js";
import { expectCachedCorpora } from "./fixtures/search-cache.mjs";
import SearchCacheHandler from "./fixtures/search-cache-handler.mjs";

const MARKER = "controlled-search-corpus";
const BROKEN_ENTRY = /broken-entry/;
const corpus = JSON.stringify({ data: { body: MARKER } });

async function cacheDirectory(context) {
	const directory = await mkdtemp(join(tmpdir(), "search-cache-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	return directory;
}

for (const related of [true, false]) {
	test(`cache observation waits for a partial ${related ? "matching" : "unrelated"} entry`, async (context) => {
		const directory = await cacheDirectory(context);
		await writeFile(join(directory, "complete"), corpus);
		const writing = join(directory, "writing");
		await writeFile(writing, '{"data":');
		let repairStarted = false;
		await Promise.all([
			expectCachedCorpora(MARKER, related ? 2 : 1, { directory }).then(() => {
				assert.equal(repairStarted, true, "an incomplete snapshot cannot satisfy the count");
			}),
			delay(75).then(async () => {
				repairStarted = true;
				await writeFile(writing, related ? corpus : JSON.stringify({ data: { body: "other" } }));
			}),
		]);
	});
}

test("persistent malformed cache entries fail with the file named", async (context) => {
	const directory = await cacheDirectory(context);
	await writeFile(join(directory, "broken-entry"), '{"data":');
	await assert.rejects(expectCachedCorpora(MARKER, 0, { directory, timeout: 50 }), {
		name: "AssertionError",
		message: BROKEN_ENTRY,
	});
});

for (const count of [0, 2]) {
	test(`cache observation keeps exact counts when expecting ${count}`, async (context) => {
		const directory = await cacheDirectory(context);
		await writeFile(join(directory, "complete"), corpus);
		await assert.rejects(expectCachedCorpora(MARKER, count, { directory, timeout: 50 }), {
			name: "AssertionError",
			actual: 1,
			expected: count,
		});
	});
}

test("cache observation propagates directory and file read failures", async (context) => {
	const directory = await cacheDirectory(context);
	await assert.rejects(expectCachedCorpora(MARKER, 0, { directory: join(directory, "missing") }), {
		code: "ENOENT",
	});
	await mkdir(join(directory, "not-a-file"));
	await assert.rejects(expectCachedCorpora(MARKER, 0, { directory }), { code: "EISDIR" });
});

test("search server isolates real FETCH persistence and preserves route artifacts", async (context) => {
	const directory = await cacheDirectory(context);
	const previousRoot = process.env.SEARCH_CACHE_FIXTURE_ROOT;
	context.after(() => {
		if (previousRoot === undefined) {
			delete process.env.SEARCH_CACHE_FIXTURE_ROOT;
		} else {
			process.env.SEARCH_CACHE_FIXTURE_ROOT = previousRoot;
		}
	});
	const root = join(directory, "isolated");
	process.env.SEARCH_CACHE_FIXTURE_ROOT = root;
	const handlerContext = {
		fs: nodeFs,
		flushToDisk: true,
		serverDistDir: join(directory, "build", "server"),
		maxMemoryCacheSize: 0,
		revalidatedTags: [],
	};
	const handler = new SearchCacheHandler(handlerContext);
	const fetchContext = { kind: "FETCH", fetchCache: true, tags: [] };
	const entry = {
		kind: "FETCH",
		data: { body: MARKER, headers: {}, status: 200, url: "http://fixture.invalid" },
		revalidate: false,
	};
	await handler.set("owned-corpus", entry, fetchContext);
	const isolatedCache = join(root, "cache", "fetch-cache");
	const sharedCache = join(directory, "build", "cache", "fetch-cache");
	await mkdir(sharedCache, { recursive: true });
	await writeFile(join(sharedCache, "interrupted-write"), "");
	await writeFile(join(sharedCache, "other-corpus"), corpus);
	await expectCachedCorpora(MARKER, 1, { directory: isolatedCache });
	await assert.rejects(readFile(join(sharedCache, "owned-corpus")), { code: "ENOENT" });
	// A fresh instance and no memory cache prove reads use the isolated on-disk entry.
	const reader = new SearchCacheHandler(handlerContext);
	assert.deepEqual((await reader.get("owned-corpus", fetchContext)).value, { ...entry, tags: [] });

	const route = { kind: "APP_ROUTE", body: Buffer.from("route body"), headers: {}, status: 200 };
	await handler.set("owned-route", route, {});
	assert.equal(
		await readFile(join(handlerContext.serverDistDir, "app", "owned-route.body"), "utf8"),
		"route body"
	);
	assert.deepEqual((await reader.get("owned-route", { kind: "APP_ROUTE" })).value, route);
	await assert.rejects(readFile(join(root, "server", "app", "owned-route.body")), {
		code: "ENOENT",
	});

	await writeFile(join(isolatedCache, "broken-entry"), "");
	await assert.rejects(expectCachedCorpora(MARKER, 1, { directory: isolatedCache, timeout: 50 }), {
		name: "AssertionError",
		message: BROKEN_ENTRY,
	});
});
