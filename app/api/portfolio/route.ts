import { NextResponse } from "next/server";
import {
	getDribbbleShots,
	getFigmaFiles,
	getGitHubRepositories,
	getGitHubStats,
} from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function GET() {
	try {
		const [reposResult, shotsResult, figmaResult, statsResult] = await Promise.allSettled([
			getGitHubRepositories(),
			getDribbbleShots(),
			getFigmaFiles(),
			getGitHubStats(),
		]);

		const repos = reposResult.status === "fulfilled" ? reposResult.value : [];
		const shots = shotsResult.status === "fulfilled" ? shotsResult.value : [];
		const figmaFiles = figmaResult.status === "fulfilled" ? figmaResult.value : [];
		const stats = statsResult.status === "fulfilled" ? statsResult.value : null;

		const githubFailed = reposResult.status === "rejected" || !Array.isArray(repos);
		const degraded =
			githubFailed ||
			shotsResult.status === "rejected" ||
			figmaResult.status === "rejected" ||
			statsResult.status === "rejected";

		const safeRepos = Array.isArray(repos) ? repos : [];
		const repoCount = safeRepos.length;
		const figmaCount = Array.isArray(figmaFiles) ? figmaFiles.length : 0;

		const recentRepos = safeRepos.filter((repo: { updated_at?: string }) => {
			if (!repo.updated_at) return false;
			const updatedDate = new Date(repo.updated_at);
			const threeMonthsAgo = new Date();
			threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
			return updatedDate > threeMonthsAgo;
		}).length;

		const growthPercentage = repoCount > 0 ? Math.round((recentRepos / repoCount) * 100) : 0;

		const portfolioStats = [
			{ number: "50+", label: "Projects Completed", icon: "Award", trend: "+12%" },
			{
				number: `${repoCount}+`,
				label: "GitHub Repositories",
				icon: "Github",
				trend: `+${growthPercentage}%`,
			},
			{ number: `${figmaCount}+`, label: "Design Projects", icon: "Figma", trend: "+15%" },
			{ number: "100%", label: "Client Satisfaction", icon: "Users", trend: "Maintained" },
		];

		// Prefer a usable payload over a hard 500 when GitHub is briefly unavailable.
		return NextResponse.json(
			{
				repos: safeRepos,
				shots: Array.isArray(shots) ? shots : [],
				figmaFiles: Array.isArray(figmaFiles) ? figmaFiles : [],
				stats,
				portfolioStats,
				degraded,
				githubFailed,
			},
			{
				status: 200,
				headers: {
					"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
				},
			}
		);
	} catch (error) {
		console.error("Error fetching portfolio data:", error);
		return NextResponse.json(
			{
				repos: [],
				shots: [],
				figmaFiles: [],
				stats: null,
				portfolioStats: [],
				degraded: true,
				githubFailed: true,
				error: "Failed to fetch portfolio data",
			},
			{
				status: 200,
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			}
		);
	}
}
