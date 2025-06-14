import { DribbbleShot } from "@/types/dribbble";
import { GitHubRepo, GitHubProfile, GitHubRepoStatistics, GitHubRepoTraffic, GitHubWorkflowData, GitHubCommunityHealth } from "@/types/github";
import { FigmaFile, FigmaComprehensiveAnalytics } from "@/types/figma";
import { unstable_cache } from "next/cache";
import * as Figma from "figma-js";

// Export types for use in other files
export type { GitHubRepo } from "@/types/github";

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
	async () => {
		const accessToken = process.env.DRIBBBLE_ACCESS_TOKEN;
		if (!accessToken) {
			console.warn("Dribbble access token not found - skipping Dribbble shots");
			return [];
		}

		try {
			const response = await fetchWithTimeout("https://api.dribbble.com/v2/user/shots?per_page=100", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				timeout: 5000, // Increased timeout for more data
			});

			if (!response.ok) {
				console.error(`Dribbble API error: ${response.status} ${response.statusText}`);
				return [];
			}

			const shots: DribbbleShot[] = await response.json();
			return shots; // Return all available shots
		} catch (error) {
			console.error("Failed to fetch Dribbble shots:", error);
			return [];
		}
	},
	["dribbble-shots"],
	{
		revalidate: 3600, // 1 hour
		tags: ["dribbble"],
	}
);

// Single shot factory function
export const getDribbbleShot = (id: string) =>
	unstable_cache(
		async () => {
			const accessToken = process.env.DRIBBBLE_ACCESS_TOKEN;
			if (!accessToken) {
				throw new Error("Dribbble access token not found.");
			}

			try {
				const response = await fetchWithTimeout(`https://api.dribbble.com/v2/shots/${id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					timeout: 3000,
				});

				if (!response.ok) {
					if (response.status === 404) {
						return null;
					}
					throw new Error(`Dribbble API error: ${response.status} ${response.statusText}`);
				}

				const shot: DribbbleShot = await response.json();
				return shot;
			} catch (error) {
				console.error(`Failed to fetch Dribbble shot with id ${id}:`, error);
				throw error;
			}
		},
		["dribbble-shot", id],
		{
			revalidate: 7200, // 2 hours
			tags: ["dribbble"],
		}
	);

// FigmaFile interface moved to types/figma.ts

// Aggressive caching for Figma files
export const getFigmaFiles = unstable_cache(
	async (): Promise<FigmaFile[]> => {
		const accessToken = process.env.FIGMA_ACCESS_TOKEN;
		const teamId = process.env.FIGMA_TEAM_ID;

		if (!accessToken || !teamId) {
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

			const { data: projectsResponse } = await Promise.race([client.teamProjects(teamId), timeoutPromise]);

			const projects = projectsResponse.projects;
			const allFiles: FigmaFile[] = [];

			// Process more projects to get all Figma files
			const projectPromises = projects.slice(0, 6).map(async (project) => {
				try {
					const projectTimeoutPromise = new Promise<never>((_, reject) => {
						setTimeout(() => reject(new Error("Project fetch timeout")), 5000);
					});

					const { data: filesResponse } = await Promise.race([client.projectFiles(project.id.toString()), projectTimeoutPromise]);

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

			projectResults.forEach((result) => {
				if (result.status === "fulfilled") {
					allFiles.push(...result.value);
				}
			});

			return allFiles.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime()).slice(0, 30);
		} catch (error) {
			console.error("Failed to fetch Figma files:", error);
			return [];
		}
	},
	["figma-files"],
	{
		revalidate: 3600, // 1 hour
		tags: ["figma"],
	}
);

// Get thumbnail URL from cached file list (much faster than API call)
export const getFigmaThumbnail = async (key: string): Promise<string | null> => {
	try {
		const files = await getFigmaFiles();
		const file = files.find((f) => f.key === key);
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
				throw new Error("Figma access token not found.");
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
			tags: ["figma"],
		}
	);

export interface PortfolioProject {
	id: number;
	slug: string;
	title: string;
	shortDescription: string;
	longDescription: string;
	image: string;
	liveUrl?: string;
	githubUrl?: string;
	caseStudyUrl?: string;
	tags: string[];
	status: "Completed" | "In Progress" | "Concept";
	keyFeatures: string[];
	techStack: { name: string; icon?: string }[];
	gallery: string[];
	problem: string;
	solution: string;
	outcome: string;
}

export const projects: PortfolioProject[] = [
	{
		id: 1,
		slug: "ecommerce-platform",
		title: "E-commerce Platform",
		shortDescription: "A high-performance online store with a custom CMS and real-time inventory, resulting in a 40% increase in conversion rates.",
		longDescription: "This project involved building a full-featured e-commerce platform from the ground up for a client in the fashion industry. The goal was to create a fast, visually appealing, and easy-to-manage online store that could handle high traffic and complex product variations.",
		image: "https://placehold.co/800x600/EEE/31343C",
		liveUrl: "#",
		caseStudyUrl: "/portfolio/ecommerce-platform",
		tags: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL"],
		status: "Completed",
		keyFeatures: ["Custom CMS", "Real-time inventory", "Stripe integration", "Algolia search"],
		techStack: [{ name: "Next.js" }, { name: "TypeScript" }, { name: "GraphQL" }, { name: "PostgreSQL" }, { name: "Stripe" }, { name: "Vercel" }],
		gallery: ["https://placehold.co/1200x800/EEE/31343C", "https://placehold.co/1200x800/31343C/EEE", "https://placehold.co/1200x800/1a1a1a/ffffff"],
		problem: "The client's previous website was slow, difficult to update, and had a high cart abandonment rate. They needed a modern solution that could provide a seamless user experience and streamline their backend operations.",
		solution: "I developed a headless e-commerce solution using Next.js for the frontend and a custom GraphQL API with a PostgreSQL database for the backend. This architecture provided exceptional performance and flexibility. I also integrated Stripe for payments and built a user-friendly CMS for managing products and orders.",
		outcome: "The new platform resulted in a 40% increase in conversion rates, a 60% improvement in page load times, and a significant reduction in administrative overhead for the client. The site now handles thousands of daily visitors with ease.",
	},
	{
		id: 2,
		slug: "saas-dashboard",
		title: "SaaS Dashboard",
		shortDescription: "A complex data visualization dashboard for a B2B SaaS product, providing users with actionable insights and a highly interactive interface.",
		longDescription: "This dashboard allows users to analyze large datasets through a variety of charts, graphs, and tables. The key challenge was to present complex information in an intuitive and accessible way, while ensuring high performance and real-time data updates.",
		image: "https://placehold.co/800x600/31343C/EEE",
		githubUrl: "#",
		caseStudyUrl: "/portfolio/saas-dashboard",
		tags: ["React", "D3.js", "Node.js", "Analytics"],
		status: "Completed",
		keyFeatures: ["Interactive charts", "Real-time data", "Customizable widgets", "Export functionality"],
		techStack: [{ name: "React" }, { name: "D3.js" }, { name: "Node.js" }, { name: "WebSocket" }, { name: "AWS" }],
		gallery: ["https://placehold.co/1200x800/31343C/EEE", "https://placehold.co/1200x800/EEE/31343C", "https://placehold.co/1200x800/1a1a1a/ffffff"],
		problem: "Users were struggling to extract meaningful insights from their data with the existing tools. The interface was clunky and the data was often stale, leading to frustration and low engagement.",
		solution: "I designed and built a new dashboard from scratch using React and D3.js. I implemented a WebSocket connection for real-time data updates and created a library of reusable, interactive chart components. The UI was designed to be clean, modern, and highly customizable.",
		outcome: "User engagement increased by over 50%, and customer satisfaction scores saw a significant boost. The new dashboard is now a key selling point for the SaaS product.",
	},
	// Add more projects here
];

// GitHub Profile Data (interface moved to types/github.ts)

// Fetch GitHub profile data
export const getGitHubProfile = unstable_cache(
	async (): Promise<GitHubProfile | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping profile data");
			return null;
		}

		try {
			const response = await fetchWithTimeout("https://api.github.com/users/byronwade", {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (!response.ok) {
				console.error(`GitHub Profile API error: ${response.status} ${response.statusText}`);
				return null;
			}

			return response.json();
		} catch (error) {
			console.error("Failed to fetch GitHub profile:", error);
			return null;
		}
	},
	["github-profile"],
	{
		revalidate: 7200, // 2 hours
		tags: ["github"],
	}
);

// Fetch GitHub profile README
export const getGitHubProfileReadme = unstable_cache(
	async (): Promise<string | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping profile README");
			return null;
		}

		try {
			const response = await fetchWithTimeout("https://api.github.com/repos/byronwade/byronwade/readme", {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3.raw",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (response.status === 404) {
				console.warn("Profile README not found");
				return null;
			}

			if (!response.ok) {
				console.error(`GitHub README API error: ${response.status} ${response.statusText}`);
				return null;
			}

			return response.text();
		} catch (error) {
			console.error("Failed to fetch GitHub profile README:", error);
			return null;
		}
	},
	["github-profile-readme"],
	{
		revalidate: 7200, // 2 hours
		tags: ["github"],
	}
);

// Fetch GitHub user stats (contribution activity, etc.)
export const getGitHubStats = unstable_cache(
	async (): Promise<any> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping stats");
			return null;
		}

		try {
			// Get events for contribution activity
			const eventsResponse = await fetchWithTimeout("https://api.github.com/users/byronwade/events/public?per_page=100", {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			const events = eventsResponse.ok ? await eventsResponse.json() : [];

			// Calculate some basic stats
			const pushEvents = events.filter((event: any) => event.type === "PushEvent");
			const recentCommits = pushEvents.reduce((total: number, event: any) => {
				return total + (event.payload?.commits?.length || 0);
			}, 0);

			const uniqueRepos = new Set(events.map((event: any) => event.repo?.name)).size;

			return {
				recentCommits,
				uniqueRepos,
				lastActivity: events[0]?.created_at || null,
				totalEvents: events.length,
			};
		} catch (error) {
			console.error("Failed to fetch GitHub stats:", error);
			return null;
		}
	},
	["github-stats"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// GitHub Repository Interface (moved to types/github.ts)

// Fetch all GitHub repositories
export const getGitHubRepositories = unstable_cache(
	async (): Promise<GitHubRepo[]> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping GitHub repos");
			return [];
		}

		try {
			const response = await fetchWithTimeout("https://api.github.com/users/byronwade/repos", {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (!response.ok) {
				console.error(`GitHub API error: ${response.status} ${response.statusText}`);
				return [];
			}

			const repos: GitHubRepo[] = await response.json();

			return repos
				.filter(
					(repo) =>
						repo.name !== "byronwade.com" &&
						!repo.name.startsWith(".") && // Filter out hidden repos
						!repo.name.includes("fork") // Filter out obvious forks
				)
				.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
				.slice(0, 20); // Show more projects
		} catch (error) {
			console.error("Failed to fetch GitHub repos:", error);
			return [];
		}
	},
	["github-repos"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Fetch a specific GitHub repository
export const getRepo = unstable_cache(
	async (repoName: string): Promise<GitHubRepo | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping repo data");
			return null;
		}

		try {
			const response = await fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}`, {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (!response.ok) {
				console.error(`GitHub repo API error: ${response.status} ${response.statusText}`);
				return null;
			}

			return response.json();
		} catch (error) {
			console.error("Failed to fetch GitHub repo:", error);
			return null;
		}
	},
	["github-repo"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Fetch README for a specific repository
export const getReadme = unstable_cache(
	async (repoName: string): Promise<string | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping README");
			return null;
		}

		try {
			const response = await fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/readme`, {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3.raw",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (response.status === 404) {
				console.warn(`README not found for ${repoName}`);
				return null;
			}

			if (!response.ok) {
				console.error(`GitHub README API error: ${response.status} ${response.statusText}`);
				return null;
			}

			return response.text();
		} catch (error) {
			console.error("Failed to fetch GitHub README:", error);
			return null;
		}
	},
	["github-readme"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Fetch languages for a specific repository
export const getLanguages = unstable_cache(
	async (repoName: string): Promise<{ [key: string]: number }> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping languages");
			return {};
		}

		try {
			const response = await fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/languages`, {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (!response.ok) {
				console.error(`GitHub languages API error: ${response.status} ${response.statusText}`);
				return {};
			}

			return response.json();
		} catch (error) {
			console.error("Failed to fetch GitHub languages:", error);
			return {};
		}
	},
	["github-languages"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Enhanced GitHub Analytics Functions

// Fetch repository statistics (commit activity, contributors, etc.)
export const getGitHubRepoStatistics = unstable_cache(
	async (repoName: string): Promise<GitHubRepoStatistics | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping repo statistics");
			return null;
		}

		try {
			const [commitActivityRes, contributorsRes, languagesRes, codeFrequencyRes, participationRes] = await Promise.allSettled([
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/stats/commit_activity`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 5000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/stats/contributors`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 5000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/languages`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/stats/code_frequency`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 5000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/stats/participation`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 5000,
				}),
			]);

			const statistics: GitHubRepoStatistics = {
				repoId: 0, // Will be set by caller
			};

			// Process commit activity
			if (commitActivityRes.status === "fulfilled" && commitActivityRes.value.ok) {
				const commitActivity = await commitActivityRes.value.json();
				if (Array.isArray(commitActivity)) {
					statistics.commit_activity = {
						total: commitActivity.reduce((sum: number, week: any) => sum + week.total, 0),
						week_data: commitActivity,
					};
				} else {
					console.warn("Commit activity is not an array:", commitActivity);
					statistics.commit_activity = {
						total: 0,
						week_data: [],
					};
				}
			}

			// Process contributors
			if (contributorsRes.status === "fulfilled" && contributorsRes.value.ok) {
				statistics.contributors = await contributorsRes.value.json();
			}

			// Process languages
			if (languagesRes.status === "fulfilled" && languagesRes.value.ok) {
				statistics.languages = await languagesRes.value.json();
			}

			// Process code frequency
			if (codeFrequencyRes.status === "fulfilled" && codeFrequencyRes.value.ok) {
				statistics.code_frequency = await codeFrequencyRes.value.json();
			}

			// Process participation
			if (participationRes.status === "fulfilled" && participationRes.value.ok) {
				statistics.participation = await participationRes.value.json();
			}

			return statistics;
		} catch (error) {
			console.error("Failed to fetch GitHub repo statistics:", error);
			return null;
		}
	},
	["github-repo-stats"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Fetch repository traffic data (requires push access)
export const getGitHubRepoTraffic = unstable_cache(
	async (repoName: string): Promise<GitHubRepoTraffic | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping repo traffic");
			return null;
		}

		try {
			const [viewsRes, clonesRes, pathsRes, referrersRes] = await Promise.allSettled([
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/traffic/views`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/traffic/clones`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/traffic/popular/paths`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/traffic/popular/referrers`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
			]);

			const traffic: GitHubRepoTraffic = {
				repoId: 0, // Will be set by caller
			};

			// Process views
			if (viewsRes.status === "fulfilled" && viewsRes.value.ok) {
				traffic.views = await viewsRes.value.json();
			}

			// Process clones
			if (clonesRes.status === "fulfilled" && clonesRes.value.ok) {
				traffic.clones = await clonesRes.value.json();
			}

			// Process popular paths
			if (pathsRes.status === "fulfilled" && pathsRes.value.ok) {
				traffic.popular_paths = await pathsRes.value.json();
			}

			// Process referrers
			if (referrersRes.status === "fulfilled" && referrersRes.value.ok) {
				traffic.referrers = await referrersRes.value.json();
			}

			return traffic;
		} catch (error) {
			console.error("Failed to fetch GitHub repo traffic:", error);
			return null;
		}
	},
	["github-repo-traffic"],
	{
		revalidate: 1800, // 30 minutes (traffic data changes frequently)
		tags: ["github"],
	}
);

// Fetch GitHub Actions workflow data
export const getGitHubWorkflowData = unstable_cache(
	async (repoName: string): Promise<GitHubWorkflowData | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping workflow data");
			return null;
		}

		try {
			const [workflowsRes, runsRes] = await Promise.allSettled([
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/actions/workflows`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/actions/runs?per_page=100`, {
					headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", "User-Agent": "byronwade.com" },
					timeout: 5000,
				}),
			]);

			const workflowData: GitHubWorkflowData = {
				repoId: 0, // Will be set by caller
			};

			// Process workflows
			if (workflowsRes.status === "fulfilled" && workflowsRes.value.ok) {
				const workflowsResponse = await workflowsRes.value.json();
				workflowData.workflows = workflowsResponse.workflows;
			}

			// Process workflow runs
			if (runsRes.status === "fulfilled" && runsRes.value.ok) {
				const runsResponse = await runsRes.value.json();
				const runs = runsResponse.workflow_runs;

				workflowData.recent_runs = runs.slice(0, 10).map((run: any) => ({
					id: run.id,
					name: run.name,
					head_branch: run.head_branch,
					head_sha: run.head_sha,
					status: run.status,
					conclusion: run.conclusion,
					workflow_id: run.workflow_id,
					created_at: run.created_at,
					updated_at: run.updated_at,
					run_duration: run.updated_at && run.created_at ? Math.round((new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000) : undefined,
				}));

				// Calculate summary stats
				const totalRuns = runs.length;
				const successfulRuns = runs.filter((run: any) => run.conclusion === "success").length;
				const failedRuns = runs.filter((run: any) => run.conclusion === "failure").length;
				const cancelledRuns = runs.filter((run: any) => run.conclusion === "cancelled").length;

				workflowData.workflow_runs_summary = {
					total_runs: totalRuns,
					successful_runs: successfulRuns,
					failed_runs: failedRuns,
					cancelled_runs: cancelledRuns,
					success_rate: totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0,
					avg_duration:
						runs
							.filter((run: any) => run.updated_at && run.created_at)
							.reduce((sum: number, run: any) => {
								return sum + (new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000;
							}, 0) / Math.max(1, runs.filter((run: any) => run.updated_at && run.created_at).length),
				};
			}

			return workflowData;
		} catch (error) {
			console.error("Failed to fetch GitHub workflow data:", error);
			return null;
		}
	},
	["github-workflow-data"],
	{
		revalidate: 1800, // 30 minutes
		tags: ["github"],
	}
);

// Fetch community health metrics
export const getGitHubCommunityHealth = unstable_cache(
	async (repoName: string): Promise<GitHubCommunityHealth | null> => {
		const token = process.env.GITHUB_API_TOKEN;

		if (!token) {
			console.warn("GitHub API token not found - skipping community health");
			return null;
		}

		try {
			const response = await fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/community/profile`, {
				headers: {
					Authorization: `token ${token}`,
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "byronwade.com",
				},
				timeout: 3000,
			});

			if (!response.ok) {
				console.error(`GitHub community health API error: ${response.status} ${response.statusText}`);
				return null;
			}

			const healthData = await response.json();
			return {
				repoId: 0, // Will be set by caller
				...healthData,
			};
		} catch (error) {
			console.error("Failed to fetch GitHub community health:", error);
			return null;
		}
	},
	["github-community-health"],
	{
		revalidate: 7200, // 2 hours
		tags: ["github"],
	}
);

// Fetch enhanced Dribbble shot analytics
export const getDribbbleShotAnalytics = unstable_cache(
	async (shotId: string) => {
		// Note: Dribbble API doesn't provide detailed analytics publicly
		// This is a placeholder for future implementation with proper analytics API
		// For now, we'll calculate basic metrics from available data

		const shot = await getDribbbleShot(shotId)();
		if (!shot) return null;

		// Debug logging
		console.log("Dribbble shot data:", {
			id: shot.id,
			views_count: shot.views_count,
			likes_count: shot.likes_count,
			comments_count: shot.comments_count,
		});

		// Calculate basic engagement metrics - handle undefined/null values
		const views = shot.views_count ?? 0;
		const likes = shot.likes_count ?? 0;
		const comments = shot.comments_count ?? 0;

		// Only calculate rates if we have actual view data
		if (views === 0) {
			return {
				shotId: parseInt(shotId),
				engagement_rate: 0,
				views_to_likes_ratio: 0,
				comments_to_views_ratio: 0,
				has_analytics_data: false,
			};
		}

		const engagement_rate = ((likes + comments) / views) * 100;
		const views_to_likes_ratio = likes / views;
		const comments_to_views_ratio = comments / views;

		return {
			shotId: parseInt(shotId),
			engagement_rate: Math.round(engagement_rate * 100) / 100,
			views_to_likes_ratio: Math.round(views_to_likes_ratio * 1000) / 1000,
			comments_to_views_ratio: Math.round(comments_to_views_ratio * 1000) / 1000,
			has_analytics_data: true,
		};
	},
	["dribbble-shot-analytics"],
	{
		revalidate: 3600, // 1 hour
		tags: ["dribbble"],
	}
);

// Enhanced Figma file analytics
export const getFigmaFileAnalytics = unstable_cache(
	async (fileKey: string) => {
		const accessToken = process.env.FIGMA_ACCESS_TOKEN;

		if (!accessToken) {
			console.warn("Figma access token not found - skipping analytics");
			return null;
		}

		const client = Figma.Client({
			personalAccessToken: accessToken,
		});

		try {
			// Get file data
			const { data: file } = await client.file(fileKey);

			// Get version history
			const { data: versions } = await client.fileVersions(fileKey);

			// Calculate basic metrics
			const fileSize = JSON.stringify(file).length; // Approximate file size
			const pageCount = file.document?.children?.length || 0;
			const versionCount = versions.versions?.length || 0;

			// Calculate complexity score based on structure
			let totalNodes = 0;
			let componentCount = 0;

			function countNodes(node: any): void {
				totalNodes++;
				if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
					componentCount++;
				}
				if (node.children) {
					node.children.forEach(countNodes);
				}
			}

			if (file.document?.children) {
				file.document.children.forEach(countNodes);
			}

			const complexity_score = Math.min(100, Math.round((totalNodes / 100) * 50 + componentCount * 5));

			return {
				fileKey,
				file_size: fileSize,
				complexity_score,
				page_count: pageCount,
				version_count: versionCount,
				total_nodes: totalNodes,
				component_count: componentCount,
				last_modified: file.lastModified,
			};
		} catch (error) {
			console.error("Failed to fetch Figma file analytics:", error);
			return null;
		}
	},
	["figma-file-analytics"],
	{
		revalidate: 3600, // 1 hour
		tags: ["figma"],
	}
);
