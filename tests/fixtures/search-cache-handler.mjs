import { isAbsolute, join } from "node:path";
import fileSystemCache from "next/dist/server/lib/incremental-cache/file-system-cache.js";

const { default: FileSystemCache } = fileSystemCache;

// Use Next's real persistence, serialization and invalidation. Only FETCH entries
// move; route artifacts must still resolve against the production build.
export default class SearchCacheHandler extends FileSystemCache {
	constructor(context) {
		super(context);
		const root = process.env.SEARCH_CACHE_FIXTURE_ROOT;
		if (!(root && isAbsolute(root))) {
			throw new Error("Search cache fixture requires an absolute cache root");
		}
		this.fetchCache = new FileSystemCache({ ...context, serverDistDir: join(root, "server") });
	}

	get(key, context) {
		return context.kind === "FETCH" ? this.fetchCache.get(key, context) : super.get(key, context);
	}

	set(key, data, context) {
		return data?.kind === "FETCH"
			? this.fetchCache.set(key, data, context)
			: super.set(key, data, context);
	}
}
