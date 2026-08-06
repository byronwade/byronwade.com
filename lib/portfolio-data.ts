import * as Figma from "figma-js";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import type { DribbbleShot } from "@/types/dribbble";
import type { FigmaFile } from "@/types/figma";
import type { GitHubRepo } from "@/types/github";

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

interface PortfolioProject {
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
				.filter((repo: GitHubRepo) => !repo.fork && !repo.archived)
				.sort((a: GitHubRepo, b: GitHubRepo) => {
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
				});
		} catch (error) {
			console.error("Error fetching GitHub repositories:", error);
			return [];
		}
	},
	["github-repos"],
	{
		revalidate: 3600, // 1 hour
		tags: [CACHE_TAGS.GITHUB],
	}
);
