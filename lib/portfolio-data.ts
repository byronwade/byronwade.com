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

			const data = await response.json();
			return data;
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
			const { data: projectsResponse } = await client.teamProjects(teamId);

			const projects = projectsResponse.projects;
			const allFiles: FigmaFile[] = [];
			const projectClient = createFigmaClient(accessToken, 5000);

			// Process more projects to get all Figma files
			const projectPromises = projects.slice(0, 6).map(async (project) => {
				try {
					const { data: filesResponse } = await projectClient.projectFiles(project.id.toString());

					return filesResponse.files.slice(0, 12).map((file) => ({
						key: file.key,
						name: file.name,
						thumbnail_url: file.thumbnail_url,
						last_modified: file.last_modified,
					}));
				} catch (error) {
					console.error(
						`Failed to fetch files for project ${project.id}:`,
						error instanceof Error ? error.message : "Unknown error"
					);
					return [];
				}
			});

			const projectResults = await Promise.allSettled(projectPromises);

			for (const result of projectResults) {
				if (result.status === "fulfilled") {
					allFiles.push(...result.value);
				}
			}

			return allFiles
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
					isGitHubCount(data.public_repos) &&
					isGitHubCount(data.followers) &&
					isGitHubCount(data.following) &&
					isGitHubTimestamp(data.created_at)
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

const GITHUB_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGitHubCount(value: unknown): value is number {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isRepositoryName(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isGitHubTimestamp(value: unknown): value is string {
	return (
		typeof value === "string" &&
		GITHUB_TIMESTAMP.test(value) &&
		isValid(parseISO(value)) &&
		Number.isFinite(Date.parse(value))
	);
}

function isRepositoryUrl(value: unknown): value is string {
	return (
		typeof value === "string" &&
		URL.canParse(value) &&
		["https:", "http:"].includes(new URL(value).protocol)
	);
}

/** Validate every field consumed by the API and page before sorting or caching. */
function isGitHubRepository(value: unknown): value is GitHubRepo {
	if (!isRecord(value)) {
		return false;
	}
	return (
		isGitHubCount(value.id) &&
		value.id > 0 &&
		["name", "full_name"].every((field) => isRepositoryName(value[field])) &&
		["stargazers_count", "forks_count"].every((field) => isGitHubCount(value[field])) &&
		(value.description === null || typeof value.description === "string") &&
		["language", "homepage"].every(
			(field) =>
				value[field] === undefined || value[field] === null || typeof value[field] === "string"
		) &&
		isRepositoryUrl(value.html_url) &&
		["created_at", "updated_at", "pushed_at"].every(
			(field) =>
				value[field] === undefined || value[field] === null || isGitHubTimestamp(value[field])
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
