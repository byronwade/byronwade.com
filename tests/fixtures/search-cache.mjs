import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

export async function withSearchCache(verify) {
	const { config } = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
	const root = await mkdtemp(join(process.cwd(), ".next", "cache", "search-session-"));
	try {
		const directory = join(root, "cache", "fetch-cache");
		await mkdir(directory, { recursive: true });
		return await verify({
			directory,
			env: {
				__NEXT_PRIVATE_STANDALONE_CONFIG: JSON.stringify({
					...config,
					cacheHandler: resolve("tests/fixtures/search-cache-handler.mjs"),
				}),
				SEARCH_CACHE_FIXTURE_ROOT: root,
			},
		});
	} finally {
		// The caller awaits its owned server's shutdown before this directory is removed.
		await rm(root, { recursive: true, force: true });
	}
}

async function cacheEntry(directory, file) {
	// Filesystem errors are real failures. Only JSON parsing can observe an unfinished write.
	const source = await readFile(join(directory, file), "utf8");
	try {
		return { file, entry: JSON.parse(source) };
	} catch (error) {
		if (!(error instanceof SyntaxError)) {
			throw error;
		}
		// Keep the filename pending so persistent corruption fails at the observation deadline.
		return { file };
	}
}

async function cachedCorpora(directory, marker) {
	const files = await readdir(directory);
	const records = await Promise.all(files.map((file) => cacheEntry(directory, file)));
	return {
		entries: records.flatMap(({ entry }) =>
			typeof entry?.data?.body === "string" && entry.data.body.includes(marker)
				? [entry.data.body]
				: []
		),
		incomplete: records.filter((record) => !("entry" in record)).map((record) => record.file),
	};
}

// Inspect the real Next Data Cache, with one deadline for the complete observation.
export async function expectCachedCorpora(marker, count, { directory, timeout = 5000 }) {
	const deadline = Date.now() + timeout;
	async function observe() {
		const { entries, incomplete } = await cachedCorpora(directory, marker);
		if ((entries.length !== count || incomplete.length > 0) && Date.now() < deadline) {
			await delay(25);
			return observe();
		}
		assert.deepEqual(incomplete, [], "cache entries still contain incomplete JSON");
		assert.equal(entries.length, count, "computed corpora in the real Next cache");
	}
	await observe();
}
