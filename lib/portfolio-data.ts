import "server-only";

import * as Figma from "figma-js";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import type { DribbbleShot } from "@/types/dribbble";
import type { FigmaFile } from "@/types/figma";
import type { GitHubRepo } from "@/types/github";

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

// Utility function to add timeout to fetch requests
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
	const { timeout = 3000, ...fetchOptions } = options; // Reduced to 3s for speed

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...fetchOptions,
			signal: controller.signal,
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
};

// Aggressive caching for Dribbble shots
export const getDribbbleShots = unstable_cache(
	async (): Promise<DribbbleShot[]> => {
		try {
			const response = await fetch("https://api.dribbble.com/v2/user/shots?per_page=20", {
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

		const client = Figma.Client({
			personalAccessToken: accessToken,
		});

		try {
			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => reject(new Error("Figma API timeout")), 3000);
			});

			const { data: projectsResponse } = await Promise.race([
				client.teamProjects(teamId),
				timeoutPromise,
			]);

			const projects = projectsResponse.projects;
			const allFiles: FigmaFile[] = [];

			// Process more projects to get all Figma files
			const projectPromises = projects.slice(0, 6).map(async (project) => {
				try {
					const projectTimeoutPromise = new Promise<never>((_, reject) => {
						setTimeout(() => reject(new Error("Project fetch timeout")), 5000);
					});

					const { data: filesResponse } = await Promise.race([
						client.projectFiles(project.id.toString()),
						projectTimeoutPromise,
					]);

					return filesResponse.files.slice(0, 12).map((file) => ({
						key: file.key,
						name: file.name,
						thumbnail_url: file.thumbnail_url,
						last_modified: file.last_modified,
					}));
				} catch (error) {
					console.error(`Failed to fetch files for project ${project.id}:`, error);
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
			console.error("Failed to fetch Figma files:", error);
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
		console.error(`Failed to get Figma thumbnail for ${key}:`, error);
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

			const client = Figma.Client({
				personalAccessToken: accessToken,
			});

			try {
				// Shorter timeout for faster failure
				const timeoutPromise = new Promise<never>((_, reject) => {
					setTimeout(() => reject(new Error("Figma file fetch timeout")), 2000);
				});

				const { data: file } = await Promise.race([client.file(key), timeoutPromise]);

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
				console.error(`Failed to fetch Figma file with key ${key}:`, error);
				return null;
			}
		},
		["figma-file", key],
		{
			revalidate: 7200, // 2 hours
			tags: [CACHE_TAGS.FIGMA],
		}
	);

// GitHub Profile Data (interface moved to types/github.ts)
export const getGitHubStats = unstable_cache(
	async () => {
		try {
			const response = await fetch("https://api.github.com/users/byronwade", {
				headers: githubHeaders(),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch GitHub stats");
			}

			const data = await response.json();

			return {
				publicRepos: data.public_repos,
				followers: data.followers,
				following: data.following,
				createdAt: data.created_at,
			};
		} catch (error) {
			console.error("Error fetching GitHub stats:", error);
			return {
				publicRepos: 0,
				followers: 0,
				following: 0,
				createdAt: null,
			};
		}
	},
	["github-stats"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.GITHUB],
	}
);

// GitHub Repository Interface (moved to types/github.ts)

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

// Fetch all GitHub repositories
export const getGitHubRepositories = unstable_cache(
	async (): Promise<GitHubRepo[]> => {
		try {
			const response = await fetchWithTimeout(
				"https://api.github.com/users/byronwade/repos?sort=updated&per_page=100",
				{
					headers: githubHeaders(),
					timeout: 5000,
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
			}

			const repos = await response.json();

			if (!Array.isArray(repos)) {
				throw new Error("GitHub repositories response was not an array");
			}

			// Sort repositories by priority and activity
			return repos
				.filter((repo: GitHubRepo) => !(repo.fork || repo.archived))
				.sort((a: GitHubRepo, b: GitHubRepo) => {
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

					return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
				});
		} catch (error) {
			console.error("Error fetching GitHub repositories:", error);
			// Throw so a failed fetch is not cached as an empty profile for the hour.
			throw error;
		}
	},
	["github-repos"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.GITHUB],
	}
);
