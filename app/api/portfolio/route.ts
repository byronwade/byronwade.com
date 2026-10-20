import { NextResponse } from "next/server";
import {
	getDribbbleShots,
	getFigmaFiles,
	getGitHubRepositories,
	getGitHubStats,
} from "@/lib/portfolio-data";

/**
 * Failed optional-provider requests aren't cached, so an outage is paid on every
 * request. Figma's team and project deadlines can add up to about eight seconds,
 * which is the /portfolio page's own deadline, so cap the wait well below it.
 * The loaders keep their own deadlines and still cancel their requests.
 */
const OPTIONAL_PROVIDER_BUDGET_MS = 6000;

async function withinBudget<T>(load: Promise<T>): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const expired = new Promise<never>((_, reject) => {
		timer = setTimeout(
			() => reject(new Error("Optional portfolio provider exceeded its budget")),
			OPTIONAL_PROVIDER_BUDGET_MS
		);
	});
	try {
		return await Promise.race([load, expired]);
	} finally {
		clearTimeout(timer);
	}
}

export async function GET() {
	try {
		const [reposResult, shotsResult, figmaResult, statsResult] = await Promise.allSettled([
			getGitHubRepositories(),
			withinBudget(getDribbbleShots()),
			withinBudget(getFigmaFiles()),
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

		// Prefer a usable payload over a hard 500 when GitHub is briefly unavailable.
		return NextResponse.json(
			{
				repos: safeRepos,
				shots: Array.isArray(shots) ? shots : [],
				figmaFiles: Array.isArray(figmaFiles) ? figmaFiles : [],
				stats,
				// Kept empty for existing clients. It used to publish fixed claims
				// ("50+ Projects Completed", "100% Client Satisfaction"), counts rounded
				// up with "+" and made-up trends; DESIGN.md §9 allows only real numbers
				// with a source. Real counts are in `repos`, `figmaFiles` and `stats`.
				portfolioStats: [],
				degraded,
				githubFailed,
			},
			{
				status: 200,
				headers: {
					// Let the next request recover any failed provider instead of caching missing data.
					"Cache-Control": degraded
						? "no-store"
						: "public, s-maxage=3600, stale-while-revalidate=86400",
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
				headers: { "Cache-Control": "no-store" },
			}
		);
	}
}
