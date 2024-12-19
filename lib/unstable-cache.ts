import { unstable_cache as nextCache } from "next/cache";

export const unstable_cache: typeof nextCache = (fn, keys, options) => {
	return nextCache(fn, keys, {
		tags: keys,
		...options,
	});
};
