import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { expectCachedCorpora } from "./fixtures/search-cache.mjs";

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
