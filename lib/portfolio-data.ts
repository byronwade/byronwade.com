import * as Figma from "figma-js";
import { unstable_cache } from "next/cache";
import type { DribbbleShot } from "@/types/dribbble";
import type { FigmaFile } from "@/types/figma";
import type {
	GitHubCommunityHealth,
	GitHubRepo,
	GitHubRepoStatistics,
	GitHubRepoTraffic,
	GitHubWorkflowData,
} from "@/types/github";

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
		tags: ["dribbble"],
	}
);

// Single shot factory function
export const getDribbbleShot = (id: string) =>
	unstable_cache(
		async () => {
			const accessToken = process.env.DRIBBBLE_ACCESS_TOKEN;
			if (!accessToken) {
				console.warn("Dribbble access token not found - skipping Dribbble shot");
				return null;
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
				return null;
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

			projectResults.forEach((result) => {
				if (result.status === "fulfilled") {
					allFiles.push(...result.value);
				}
			});

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
	status: string;
	keyFeatures: string[];
	techStack: { name: string }[];
	gallery: string[];
	problem: string;
	solution: string;
	outcome: string;
}

export const projects: PortfolioProject[] = [
	{
		id: 1,
		slug: "thorbis",
		title: "Thorbis.com",
		shortDescription:
			"The Amazon for businesses - a comprehensive B2B marketplace platform revolutionizing procurement with AI-powered automation and global supplier network.",
		longDescription:
			"Thorbis.com is building the future of B2B commerce. Our platform combines the convenience of Amazon with the complexity and scale of enterprise procurement, powered by AI and machine learning. We're creating a one-stop solution for businesses to source, compare, and purchase everything they need with automated workflows, real-time pricing, and intelligent supplier matching.",
		image: "/images/portfolio/thorbis-preview.jpg",
		liveUrl: "https://thorbis.com",
		caseStudyUrl: "/portfolio/thorbis",
		tags: ["B2B Marketplace", "AI Procurement", "Enterprise Platform", "Funding Round"],
		status: "Funding Round",
		keyFeatures: [
			"AI-Powered Procurement",
			"Global Supplier Network",
			"Automated Workflows",
			"Real-time Pricing",
			"Enterprise Integration",
			"Market Validation",
		],
		techStack: [
			{ name: "Next.js" },
			{ name: "TypeScript" },
			{ name: "AI/ML" },
			{ name: "Cloud Infrastructure" },
			{ name: "Enterprise APIs" },
			{ name: "Blockchain" },
		],
		gallery: [
			"/images/portfolio/thorbis-1.jpg",
			"/images/portfolio/thorbis-2.jpg",
			"/images/portfolio/thorbis-3.jpg",
		],
		problem:
			"B2B procurement is fragmented, inefficient, and lacks transparency. Businesses spend countless hours sourcing suppliers, negotiating prices, and managing complex procurement processes across multiple platforms and vendors.",
		solution:
			"Thorbis.com creates a unified B2B marketplace that combines AI-powered supplier matching, automated procurement workflows, real-time pricing transparency, and enterprise-grade integrations. Our platform eliminates the complexity of traditional B2B commerce.",
		outcome:
			"Thorbis.com is positioned to capture a significant share of the $50B+ B2B e-commerce market. With 10,000+ suppliers ready to onboard and proprietary AI technology, we're seeking $20M in funding to accelerate market expansion and technology development.",
	},
	{
		id: 2,
		slug: "thorbis-ai",
		title: "Thorbis AI Platform",
		shortDescription:
			"Proprietary AI engine powering intelligent procurement, supplier matching, and automated business workflows.",
		longDescription:
			"Our proprietary AI platform is the core differentiator of Thorbis.com. It analyzes millions of data points to provide intelligent supplier recommendations, automated price negotiations, demand forecasting, and predictive analytics for business procurement.",
		image: "/images/portfolio/ai-platform.jpg",
		liveUrl: "#",
		caseStudyUrl: "/portfolio/thorbis-ai",
		tags: ["AI/ML", "Procurement", "Predictive Analytics", "Enterprise"],
		status: "In Development",
		keyFeatures: [
			"Intelligent Supplier Matching",
			"Predictive Analytics",
			"Automated Negotiations",
			"Demand Forecasting",
			"Real-time Optimization",
			"Proprietary Algorithms",
		],
		techStack: [
			{ name: "Machine Learning" },
			{ name: "Python" },
			{ name: "TensorFlow" },
			{ name: "Big Data" },
			{ name: "Cloud Computing" },
			{ name: "APIs" },
		],
		gallery: [
			"/images/portfolio/ai-1.jpg",
			"/images/portfolio/ai-2.jpg",
			"/images/portfolio/ai-3.jpg",
		],
		problem:
			"Traditional procurement relies on manual processes, limited supplier knowledge, and reactive decision-making, leading to inefficiencies and missed opportunities.",
		solution:
			"Our AI platform provides proactive, data-driven procurement solutions that learn from business patterns, predict needs, and automatically optimize purchasing decisions.",
		outcome:
			"The AI platform will deliver 40%+ cost savings and 60%+ time reduction in procurement processes, creating significant competitive advantages for Thorbis.com in the B2B marketplace.",
	},
	{
		id: 3,
		slug: "thorbis-mobile",
		title: "Thorbis Mobile Platform",
		shortDescription:
			"Mobile-first B2B commerce platform enabling on-the-go procurement and supplier management.",
		longDescription:
			"The Thorbis mobile platform brings enterprise-grade B2B commerce to mobile devices. Business owners and procurement managers can source suppliers, place orders, track deliveries, and manage their entire procurement process from anywhere.",
		image: "/images/portfolio/mobile-platform.jpg",
		liveUrl: "#",
		caseStudyUrl: "/portfolio/thorbis-mobile",
		tags: ["Mobile App", "B2B Commerce", "Procurement", "Cross-platform"],
		status: "In Development",
		keyFeatures: [
			"Mobile-First Design",
			"Offline Capabilities",
			"Push Notifications",
			"Barcode Scanning",
			"Real-time Tracking",
			"Mobile Payments",
		],
		techStack: [
			{ name: "React Native" },
			{ name: "TypeScript" },
			{ name: "Mobile APIs" },
			{ name: "Push Notifications" },
			{ name: "Offline Sync" },
			{ name: "Biometrics" },
		],
		gallery: [
			"/images/portfolio/mobile-1.jpg",
			"/images/portfolio/mobile-2.jpg",
			"/images/portfolio/mobile-3.jpg",
		],
		problem:
			"B2B commerce is still primarily desktop-based, limiting business owners' ability to manage procurement while on the go or at job sites.",
		solution:
			"A comprehensive mobile platform that provides full B2B commerce capabilities with offline functionality, real-time notifications, and mobile-optimized workflows.",
		outcome:
			"Mobile platform will drive 70%+ of B2B transactions by 2025, positioning Thorbis.com as the leading mobile-first B2B marketplace.",
	},
];

// GitHub Profile Data (interface moved to types/github.ts)

// Fetch GitHub profile data
export const getGitHubProfile = unstable_cache(
	async () => {
		try {
			const response = await fetch("https://api.github.com/users/byronwade", {
				headers: {
					Authorization: `token ${process.env.GITHUB_TOKEN}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch GitHub profile");
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching GitHub profile:", error);
			return null;
		}
	},
	["github-profile"],
	{
		revalidate: 3600, // 1 hour
		tags: ["github"],
	}
);

// Fetch GitHub statistics
export const getGitHubStats = unstable_cache(
	async () => {
		try {
			const response = await fetch("https://api.github.com/users/byronwade", {
				headers: {
					Authorization: `token ${process.env.GITHUB_TOKEN}`,
				},
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
		tags: ["github"],
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
	async () => {
		const token = process.env.GITHUB_TOKEN || process.env.GITHUB_API_TOKEN;

		try {
			const response = await fetchWithTimeout(
				"https://api.github.com/users/byronwade/repos?sort=updated&per_page=100",
				{
					headers: {
						Accept: "application/vnd.github+json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
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
				.filter((repo: { fork?: boolean; archived?: boolean }) => !repo.fork && !repo.archived)
				.sort(
					(
						a: { name: string; stargazers_count: number; updated_at: string },
						b: { name: string; stargazers_count: number; updated_at: string }
					) => {
						const aPriority = PRIORITY_PROJECTS.indexOf(a.name);
						const bPriority = PRIORITY_PROJECTS.indexOf(b.name);

						if (aPriority !== -1 && bPriority !== -1) {
							return aPriority - bPriority;
						}
						if (aPriority !== -1) return -1;
						if (bPriority !== -1) return 1;

						if (a.stargazers_count !== b.stargazers_count) {
							return b.stargazers_count - a.stargazers_count;
						}

						return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
					}
				);
		} catch (error) {
			console.error("Error fetching GitHub repositories:", error);
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
			const response = await fetchWithTimeout(
				`https://api.github.com/repos/byronwade/${repoName}`,
				{
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}
			);

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
			const response = await fetchWithTimeout(
				`https://api.github.com/repos/byronwade/${repoName}/readme`,
				{
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3.raw",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}
			);

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
			const response = await fetchWithTimeout(
				`https://api.github.com/repos/byronwade/${repoName}/languages`,
				{
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}
			);

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
			const [commitActivityRes, contributorsRes, languagesRes, codeFrequencyRes, participationRes] =
				await Promise.allSettled([
					fetchWithTimeout(
						`https://api.github.com/repos/byronwade/${repoName}/stats/commit_activity`,
						{
							headers: {
								Authorization: `token ${token}`,
								Accept: "application/vnd.github.v3+json",
								"User-Agent": "byronwade.com",
							},
							timeout: 5000,
						}
					),
					fetchWithTimeout(
						`https://api.github.com/repos/byronwade/${repoName}/stats/contributors`,
						{
							headers: {
								Authorization: `token ${token}`,
								Accept: "application/vnd.github.v3+json",
								"User-Agent": "byronwade.com",
							},
							timeout: 5000,
						}
					),
					fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/languages`, {
						headers: {
							Authorization: `token ${token}`,
							Accept: "application/vnd.github.v3+json",
							"User-Agent": "byronwade.com",
						},
						timeout: 3000,
					}),
					fetchWithTimeout(
						`https://api.github.com/repos/byronwade/${repoName}/stats/code_frequency`,
						{
							headers: {
								Authorization: `token ${token}`,
								Accept: "application/vnd.github.v3+json",
								"User-Agent": "byronwade.com",
							},
							timeout: 5000,
						}
					),
					fetchWithTimeout(
						`https://api.github.com/repos/byronwade/${repoName}/stats/participation`,
						{
							headers: {
								Authorization: `token ${token}`,
								Accept: "application/vnd.github.v3+json",
								"User-Agent": "byronwade.com",
							},
							timeout: 5000,
						}
					),
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
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}),
				fetchWithTimeout(`https://api.github.com/repos/byronwade/${repoName}/traffic/clones`, {
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}),
				fetchWithTimeout(
					`https://api.github.com/repos/byronwade/${repoName}/traffic/popular/paths`,
					{
						headers: {
							Authorization: `token ${token}`,
							Accept: "application/vnd.github.v3+json",
							"User-Agent": "byronwade.com",
						},
						timeout: 3000,
					}
				),
				fetchWithTimeout(
					`https://api.github.com/repos/byronwade/${repoName}/traffic/popular/referrers`,
					{
						headers: {
							Authorization: `token ${token}`,
							Accept: "application/vnd.github.v3+json",
							"User-Agent": "byronwade.com",
						},
						timeout: 3000,
					}
				),
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
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}),
				fetchWithTimeout(
					`https://api.github.com/repos/byronwade/${repoName}/actions/runs?per_page=100`,
					{
						headers: {
							Authorization: `token ${token}`,
							Accept: "application/vnd.github.v3+json",
							"User-Agent": "byronwade.com",
						},
						timeout: 5000,
					}
				),
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
					run_duration:
						run.updated_at && run.created_at
							? Math.round(
									(new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000
								)
							: undefined,
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
								return (
									sum +
									(new Date(run.updated_at).getTime() - new Date(run.created_at).getTime()) / 1000
								);
							}, 0) /
						Math.max(1, runs.filter((run: any) => run.updated_at && run.created_at).length),
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
			const response = await fetchWithTimeout(
				`https://api.github.com/repos/byronwade/${repoName}/community/profile`,
				{
					headers: {
						Authorization: `token ${token}`,
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "byronwade.com",
					},
					timeout: 3000,
				}
			);

			if (!response.ok) {
				console.error(
					`GitHub community health API error: ${response.status} ${response.statusText}`
				);
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
				shotId: parseInt(shotId, 10),
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
			shotId: parseInt(shotId, 10),
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

			const complexity_score = Math.min(
				100,
				Math.round((totalNodes / 100) * 50 + componentCount * 5)
			);

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

// Portfolio statistics
export const getPortfolioStats = unstable_cache(
	async () => {
		try {
			const [repos, profile] = await Promise.all([getGitHubRepositories(), getGitHubProfile()]);

			const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
			const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

			return [
				{
					number: repos.length,
					label: "Active Projects",
					icon: "Code",
					trend: "Growing",
				},
				{
					number: totalStars,
					label: "GitHub Stars",
					icon: "Star",
					trend: "Increasing",
				},
				{
					number: totalForks,
					label: "Project Forks",
					icon: "GitFork",
					trend: "Active",
				},
				{
					number: profile?.followers || 0,
					label: "GitHub Followers",
					icon: "Users",
					trend: "Growing",
				},
			];
		} catch (error) {
			console.error("Error calculating portfolio stats:", error);
			return [];
		}
	},
	["portfolio-stats"],
	{
		revalidate: 3600, // 1 hour
		tags: ["portfolio", "github"],
	}
);
