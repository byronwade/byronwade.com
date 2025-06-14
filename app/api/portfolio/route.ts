import { NextResponse } from "next/server";
import { getDribbbleShots, getFigmaFiles, getGitHubRepositories, getGitHubStats } from "@/lib/portfolio-data";

export async function GET() {
	try {
		// Run all API calls in parallel with aggressive caching
		const [reposResult, shotsResult, figmaResult, statsResult] = await Promise.allSettled([getGitHubRepositories(), getDribbbleShots(), getFigmaFiles(), getGitHubStats()]);

		const repos = reposResult.status === "fulfilled" ? reposResult.value : [];
		const shots = shotsResult.status === "fulfilled" ? shotsResult.value : [];
		const figmaFiles = figmaResult.status === "fulfilled" ? figmaResult.value : [];
		const stats = statsResult.status === "fulfilled" ? statsResult.value : null;

		// Calculate portfolio stats
		const repoCount = repos.length;
		const figmaCount = figmaFiles.length;

		// Calculate growth trend for repositories (simplified calculation)
		const recentRepos = repos.filter((repo) => {
			const updatedDate = new Date(repo.updated_at);
			const threeMonthsAgo = new Date();
			threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
			return updatedDate > threeMonthsAgo;
		}).length;

		const growthPercentage = repoCount > 0 ? Math.round((recentRepos / repoCount) * 100) : 0;

		const portfolioStats = [
			{ number: "50+", label: "Projects Completed", icon: "Award", trend: "+12%" },
			{ number: `${repoCount}+`, label: "GitHub Repositories", icon: "Github", trend: `+${growthPercentage}%` },
			{ number: `${figmaCount}+`, label: "Design Projects", icon: "Figma", trend: "+15%" },
			{ number: "100%", label: "Client Satisfaction", icon: "Users", trend: "Maintained" },
		];

		return NextResponse.json({
			repos,
			shots,
			figmaFiles,
			stats,
			portfolioStats,
		});
	} catch (error) {
		console.error("Error fetching portfolio data:", error);
		return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
	}
}
