import { unstable_cache } from "next/cache";

// Cache tags for different data types
export const CACHE_TAGS = {
	DRIBBBLE: "dribbble",
	FIGMA: "figma",
	GITHUB: "github",
	PORTFOLIO: "portfolio",
	ANALYTICS: "analytics",
} as const;

// Cache durations in seconds
export const CACHE_DURATIONS = {
	SHORT: 60, // 1 minute
	MEDIUM: 300, // 5 minutes
	LONG: 3600, // 1 hour
	VERY_LONG: 86400, // 24 hours
} as const;

// Generic cache wrapper with Next.js 15 features
export function createCachedFunction<T extends any[], R>(
	fn: (...args: T) => Promise<R>,
	keyParts: string[],
	options: {
		tags: string[];
		revalidate?: number;
	}
) {
	return unstable_cache(fn, keyParts, {
		tags: options.tags,
		revalidate: options.revalidate || CACHE_DURATIONS.MEDIUM,
	});
}

// Specific cache functions for different data types
export const cachedDribbbleShot = createCachedFunction(
	async (shotId: string) => {
		const response = await fetch(`https://api.dribbble.com/v2/shots/${shotId}?access_token=${process.env.DRIBBBLE_ACCESS_TOKEN}`);
		if (!response.ok) throw new Error("Failed to fetch Dribbble shot");
		return response.json();
	},
	["dribbble-shot"],
	{
		tags: [CACHE_TAGS.DRIBBBLE, CACHE_TAGS.PORTFOLIO],
		revalidate: CACHE_DURATIONS.LONG,
	}
);

export const cachedFigmaFile = createCachedFunction(
	async (fileKey: string) => {
		const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
			headers: {
				"X-Figma-Token": process.env.FIGMA_ACCESS_TOKEN!,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch Figma file");
		return response.json();
	},
	["figma-file"],
	{
		tags: [CACHE_TAGS.FIGMA, CACHE_TAGS.PORTFOLIO],
		revalidate: CACHE_DURATIONS.LONG,
	}
);

export const cachedGitHubRepo = createCachedFunction(
	async (repoOwner: string, repoName: string) => {
		const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
			headers: {
				Authorization: `token ${process.env.GITHUB_TOKEN}`,
				Accept: "application/vnd.github.v3+json",
			},
		});
		if (!response.ok) throw new Error("Failed to fetch GitHub repo");
		return response.json();
	},
	["github-repo"],
	{
		tags: [CACHE_TAGS.GITHUB, CACHE_TAGS.PORTFOLIO],
		revalidate: CACHE_DURATIONS.MEDIUM,
	}
);

// Cache invalidation helpers
export async function revalidatePortfolioCache() {
	const { revalidateTag } = await import("next/cache");
	revalidateTag(CACHE_TAGS.PORTFOLIO);
}

export async function revalidateDribbbleCache() {
	const { revalidateTag } = await import("next/cache");
	revalidateTag(CACHE_TAGS.DRIBBBLE);
}

export async function revalidateFigmaCache() {
	const { revalidateTag } = await import("next/cache");
	revalidateTag(CACHE_TAGS.FIGMA);
}

export async function revalidateGitHubCache() {
	const { revalidateTag } = await import("next/cache");
	revalidateTag(CACHE_TAGS.GITHUB);
}
