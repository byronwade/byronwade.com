import "server-only";

import { isValid, parseISO } from "date-fns";
import * as Figma from "figma-js";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import type { DribbbleShot } from "@/types/dribbble";
import type { FigmaFile } from "@/types/figma";
import type { GitHubRepo } from "@/types/github";

/** Keep the deadline active through JSON body consumption, not only headers. */
const REST_TIMEOUT_MS = 5000;
const FIGMA_PROJECT_ID = /^[1-9]\d*$/;

/** Each SDK request gets a fresh deadline that also cancels stalled body reads. */
function createFigmaClient(accessToken: string, timeoutMs: number) {
	const client = Figma.Client({ personalAccessToken: accessToken });
	client.client.interceptors.request.use((config) => {
		config.signal = AbortSignal.timeout(timeoutMs);
		return config;
	});
	return client;
}

/**
 * Headers for GitHub's REST API.
 *
 * Two things were wrong here. `Authorization: token ${process.env.GITHUB_TOKEN}`
 * was sent unconditionally, so with no token configured the header read
 * `token undefined` and GitHub answered 401. An unauthenticated request would
 * have succeeded, just at a lower rate limit, so a missing token was turning a
 * working call into a failing one. And neither call sent a `User-Agent`, which
 * GitHub's REST API requires and rejects with 403 when absent.
 *
 * Recovered from claude/wonderful-lamport-fq541q before that branch was deleted.
 */
function githubHeaders(): Record<string, string> {
	const token = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"User-Agent": "byronwade.com",
	};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	return headers;
}

// Aggressive caching for Dribbble shots
export const getDribbbleShots = unstable_cache(
	async (): Promise<DribbbleShot[]> => {
		try {
			const response = await fetch("https://api.dribbble.com/v2/user/shots?per_page=20", {
				signal: AbortSignal.timeout(REST_TIMEOUT_MS),
				headers: {
					Authorization: `Bearer ${process.env.DRIBBBLE_TOKEN}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch Dribbble shots");
			}

			const data: unknown = await response.json();
			if (!Array.isArray(data)) {
				throw new Error("Invalid Dribbble shots response");
			}

			// One broken shot must not discard healthy siblings. Preserve original records/order.
			const shots = data.filter(isDribbbleShot);
			if (shots.length !== data.length) {
				console.error("Ignored invalid Dribbble shot records");
			}
			return shots;
		} catch (error) {
			console.error("Error fetching Dribbble shots:", error);
			return [];
		}
	},
	["dribbble-shots"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.DRIBBBLE],
	}
);

function parseFigmaProjectId(value: unknown): string | null {
	if (!isRecord(value)) {
		return null;
	}
	const id = value.id;
	if (isNonNegativeInteger(id) && id > 0) {
		return String(id);
	}
	// Current responses use string IDs; keep large IDs exact rather than coercing to numbers.
	return typeof id === "string" && FIGMA_PROJECT_ID.test(id) ? id : null;
}

function parseFigmaFileSummary(value: unknown): FigmaFile | null {
	if (
		!(
			isRecord(value) &&
			isNonEmptyString(value.key) &&
			isNonEmptyString(value.name) &&
			isApiTimestamp(value.last_modified) &&
			(value.thumbnail_url === undefined || isHttpUrl(value.thumbnail_url))
		)
	) {
		return null;
	}
	return {
		key: value.key,
		name: value.name,
		thumbnail_url: value.thumbnail_url,
		last_modified: value.last_modified,
	};
}

async function getFigmaProjectFiles(
	client: ReturnType<typeof createFigmaClient>,
	projectId: string
): Promise<FigmaFile[]> {
	try {
		const { data }: { data: unknown } = await client.projectFiles(projectId);
		if (!(isRecord(data) && Array.isArray(data.files))) {
			throw new Error("Invalid Figma project files response");
		}
		const files = data.files.map(parseFigmaFileSummary).filter((file) => file !== null);
		if (files.length !== data.files.length) {
			console.warn("Ignoring invalid Figma file metadata");
		}
		return files.slice(0, 12);
	} catch (error) {
		// Keep Axios request configuration (and its authentication headers) out of logs.
		console.error(
			`Failed to fetch files for project ${projectId}:`,
			error instanceof Error ? error.message : "Unknown error"
		);
		return [];
	}
}

export const getFigmaFiles = unstable_cache(
	async (): Promise<FigmaFile[]> => {
		const accessToken = process.env.FIGMA_ACCESS_TOKEN;
		const teamId = process.env.FIGMA_TEAM_ID;

		if (!(accessToken && teamId)) {
			console.warn("Figma credentials not found - skipping Figma files");
			return [];
		}

		const client = createFigmaClient(accessToken, 3000);

		try {
			const { data }: { data: unknown } = await client.teamProjects(teamId);
			if (!(isRecord(data) && Array.isArray(data.projects))) {
				throw new Error("Invalid Figma team projects response");
			}

			const projectIds = data.projects.map(parseFigmaProjectId).filter((id) => id !== null);
			if (projectIds.length !== data.projects.length) {
				console.warn("Ignoring invalid Figma project metadata");
			}
			const projectClient = createFigmaClient(accessToken, 5000);

			const projectPromises = projectIds
				.slice(0, 6)
				.map((id) => getFigmaProjectFiles(projectClient, id));

			// Each project owns its fallback, so one failed request cannot discard siblings.
			const projectResults = await Promise.all(projectPromises);
			return projectResults
				.flat()
				.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())
				.slice(0, 30);
		} catch (error) {
			// Axios errors carry request headers, including the personal access token.
			console.error(
				"Failed to fetch Figma files:",
				error instanceof Error ? error.message : "Unknown error"
			);
			return [];
		}
	},
	["figma-files"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.FIGMA],
	}
);

// Get thumbnail URL from cached file list (much faster than API call)
const getFigmaThumbnail = async (key: string): Promise<string | null> => {
	try {
		const files = await getFigmaFiles();
		const file = files.find((f: FigmaFile) => f.key === key);
		return file?.thumbnail_url || null;
	} catch (error) {
		console.error(
			`Failed to get Figma thumbnail for ${key}:`,
			error instanceof Error ? error.message : "Unknown error"
		);
		return null;
	}
};

// Individual Figma file factory function - optimized for speed
export const getFigmaFile = (key: string) =>
	unstable_cache(
		async () => {
			const accessToken = process.env.FIGMA_ACCESS_TOKEN;

			if (!accessToken) {
				console.warn("Figma access token not found - skipping Figma file");
				return null;
			}

			const client = createFigmaClient(accessToken, 2000);

			try {
				const { data: file } = await client.file(key);

				// Get thumbnail from cached file list (much faster)
				const thumbnailUrl = await getFigmaThumbnail(key);

				// Return file data immediately without fetching additional images
				return {
					...file,
					// Use thumbnail from file list for faster loading
					thumbnailUrl,
					imageUrl: null,
				};
			} catch (error) {
				console.error(
					`Failed to fetch Figma file with key ${key}:`,
					error instanceof Error ? error.message : "Unknown error"
				);
				return null;
			}
		},
		["figma-file", key],
		{
			revalidate: 7200, // 2 hours
			tags: [CACHE_TAGS.FIGMA],
		}
	);

// Validate profile statistics before caching, using the same GitHub field rules as repositories.
export const getGitHubStats = unstable_cache(
	async () => {
		try {
			const response = await fetch("https://api.github.com/users/byronwade", {
				headers: githubHeaders(),
				signal: AbortSignal.timeout(REST_TIMEOUT_MS),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch GitHub stats");
			}

			const data: unknown = await response.json();

			if (
				!(
					isRecord(data) &&
					isNonNegativeInteger(data.public_repos) &&
					isNonNegativeInteger(data.followers) &&
					isNonNegativeInteger(data.following) &&
					isApiTimestamp(data.created_at)
				)
			) {
				throw new Error("Invalid GitHub profile response");
			}

			return {
				publicRepos: data.public_repos,
				followers: data.followers,
				following: data.following,
				createdAt: data.created_at,
			};
		} catch (error) {
			console.error("Error fetching GitHub stats:", error);
			// The API owns the null/degraded fallback; zero counts must be real data.
			throw error;
		}
	},
	["github-stats"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.GITHUB],
	}
);

// Priority projects to show first
const PRIORITY_PROJECTS = [
	"thorbis.com",
	"thorbis-ai",
	"thorbis-mobile",
	"procurement-engine",
	"supplier-network",
	"b2b-analytics",
	"enterprise-integrations",
];

const API_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isApiTimestamp(value: unknown): value is string {
	return (
		typeof value === "string" &&
		API_TIMESTAMP.test(value) &&
		isValid(parseISO(value)) &&
		Number.isFinite(Date.parse(value))
	);
}

function isHttpUrl(value: unknown): value is string {
	return (
		typeof value === "string" &&
		URL.canParse(value) &&
		["https:", "http:"].includes(new URL(value).protocol)
	);
}

function isDribbbleImages(value: unknown): value is DribbbleShot["images"] {
	if (!isRecord(value)) {
		return false;
	}
	return (
		isHttpUrl(value.normal) &&
		isHttpUrl(value.teaser) &&
		(value.hidpi === null || isHttpUrl(value.hidpi)) &&
		["four_x", "two_x", "one_x"].every(
			(field) => value[field] === undefined || value[field] === null || isHttpUrl(value[field])
		)
	);
}

/** Only these validated fields are typed; other provider metadata remains opaque. */
function isDribbbleShot(value: unknown): value is DribbbleShot {
	if (!isRecord(value)) {
		return false;
	}
	return (
		isNonNegativeInteger(value.id) &&
		value.id > 0 &&
		isNonEmptyString(value.title) &&
		isHttpUrl(value.html_url) &&
		isDribbbleImages(value.images) &&
		(value.description === undefined ||
			value.description === null ||
			typeof value.description === "string") &&
		(value.animated === undefined || typeof value.animated === "boolean") &&
		["tags", "colors"].every(
			(field) =>
				value[field] === undefined ||
				(Array.isArray(value[field]) && value[field].every((item) => typeof item === "string"))
		) &&
		["width", "height"].every(
			(field) =>
				value[field] === undefined || (isNonNegativeInteger(value[field]) && value[field] > 0)
		) &&
		["likes_count", "views_count", "comments_count", "buckets_count", "rebounds_count"].every(
			(field) => value[field] === undefined || isNonNegativeInteger(value[field])
		) &&
		["published_at", "updated_at"].every(
			(field) => value[field] === undefined || isApiTimestamp(value[field])
		)
	);
}

/** Validate every field consumed by the API and page before sorting or caching. */
function isGitHubRepository(value: unknown): value is GitHubRepo {
	if (!isRecord(value)) {
		return false;
	}
	return (
		isNonNegativeInteger(value.id) &&
		value.id > 0 &&
		["name", "full_name"].every((field) => isNonEmptyString(value[field])) &&
		["stargazers_count", "forks_count"].every((field) => isNonNegativeInteger(value[field])) &&
		(value.description === null || typeof value.description === "string") &&
		["language", "homepage"].every(
			(field) =>
				value[field] === undefined || value[field] === null || typeof value[field] === "string"
		) &&
		isHttpUrl(value.html_url) &&
		["created_at", "updated_at", "pushed_at"].every(
			(field) => value[field] === undefined || value[field] === null || isApiTimestamp(value[field])
		) &&
		typeof value.fork === "boolean" &&
		(value.archived === undefined || typeof value.archived === "boolean") &&
		(value.topics === undefined ||
			(Array.isArray(value.topics) && value.topics.every((topic) => typeof topic === "string")))
	);
}

// Fetch all GitHub repositories
export const getGitHubRepositories = unstable_cache(
	async (): Promise<GitHubRepo[]> => {
		try {
			const response = await fetch(
				"https://api.github.com/users/byronwade/repos?sort=updated&per_page=100",
				{
					headers: githubHeaders(),
					signal: AbortSignal.timeout(REST_TIMEOUT_MS),
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
			}

			const repos: unknown = await response.json();

			if (!(Array.isArray(repos) && repos.every(isGitHubRepository))) {
				throw new Error("Invalid GitHub repository response");
			}

			// Sort repositories by priority and activity
			return repos
				.filter((repo) => !(repo.fork || repo.archived))
				.sort((a, b) => {
					const aPriority = PRIORITY_PROJECTS.indexOf(a.name);
					const bPriority = PRIORITY_PROJECTS.indexOf(b.name);

					if (aPriority !== -1 && bPriority !== -1) {
						return aPriority - bPriority;
					}
					if (aPriority !== -1) {
						return -1;
					}
					if (bPriority !== -1) {
						return 1;
					}

					if (a.stargazers_count !== b.stargazers_count) {
						return b.stargazers_count - a.stargazers_count;
					}

					return new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime();
				});
		} catch (error) {
			console.error("Error fetching GitHub repositories:", error);
			// The API owns recovery; [] must mean a successful, genuinely empty list.
			throw error;
		}
	},
	["github-repos"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.GITHUB],
	}
);
