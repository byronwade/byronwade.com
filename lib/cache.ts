/**
 * Cache tags for every externally-sourced dataset.
 *
 * This is the single source of truth: `lib/portfolio-data.ts` tags its
 * `unstable_cache` entries with these values, and `/api/cache/revalidate`
 * validates incoming tags against them. Adding a tag here is what makes it
 * revalidatable: a raw string literal anywhere else silently drifts out of
 * reach of the endpoint.
 */
export const CACHE_TAGS = {
	DRIBBBLE: "dribbble",
	FIGMA: "figma",
	GITHUB: "github",
	PORTFOLIO: "portfolio",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
