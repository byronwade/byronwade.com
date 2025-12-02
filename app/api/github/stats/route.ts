import { NextResponse } from "next/server";

interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStats {
	name: string;
	percentage: number;
	color: string;
}

interface GitHubStats {
	totalContributions: number;
	currentStreak: number;
	longestStreak: number;
	contributionDays: ContributionDay[];
	topLanguages: LanguageStats[];
	totalCommits: number;
	totalPRs: number;
	totalRepos: number;
}

// Language colors mapping
const languageColors: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Python: "#3572A5",
	Go: "#00ADD8",
	Rust: "#dea584",
	Java: "#b07219",
	"C++": "#f34b7d",
	C: "#555555",
	Ruby: "#701516",
	PHP: "#4F5D95",
	Swift: "#F05138",
	Kotlin: "#A97BFF",
	Dart: "#00B4AB",
	HTML: "#e34c26",
	CSS: "#563d7c",
	SCSS: "#c6538c",
	Vue: "#41b883",
	Shell: "#89e051",
	Dockerfile: "#384d54",
	MDX: "#fcb32c",
};

export async function GET() {
	try {
		const username = "byronwade";
		const githubToken = process.env.GITHUB_API_TOKEN || process.env.GITHUB_TOKEN;

		// Build headers
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "byronwade.com",
		};

		if (githubToken) {
			headers.Authorization = `Bearer ${githubToken}`;
		}

		// Try GraphQL API first for contribution data (requires token)
		let contributionData = null;
		if (githubToken) {
			try {
				const graphqlResponse = await fetch("https://api.github.com/graphql", {
					method: "POST",
					headers: {
						...headers,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `
							query($username: String!) {
								user(login: $username) {
									contributionsCollection {
										totalCommitContributions
										totalPullRequestContributions
										contributionCalendar {
											totalContributions
											weeks {
												contributionDays {
													date
													contributionCount
													contributionLevel
												}
											}
										}
									}
								}
							}
						`,
						variables: { username },
					}),
					next: { revalidate: 300 },
				});

				if (graphqlResponse.ok) {
					const graphqlData = await graphqlResponse.json();
					if (graphqlData.data?.user?.contributionsCollection) {
						contributionData = graphqlData.data.user.contributionsCollection;
					}
				}
			} catch (e) {
				console.error("GraphQL fetch failed:", e);
			}
		}

		// Fetch user data and repos via REST API
		const [userResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${username}`, {
				headers,
				next: { revalidate: 600 },
			}),
			fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, {
				headers,
				next: { revalidate: 600 },
			}),
		]);

		if (!userResponse.ok || !reposResponse.ok) {
			throw new Error("Failed to fetch GitHub data");
		}

		const user = await userResponse.json();
		const repos = await reposResponse.json();

		// Calculate language stats from repos
		const languageCounts: Record<string, number> = {};
		let totalSize = 0;

		for (const repo of repos) {
			if (repo.language && repo.size > 0) {
				languageCounts[repo.language] = (languageCounts[repo.language] || 0) + repo.size;
				totalSize += repo.size;
			}
		}

		const topLanguages: LanguageStats[] = Object.entries(languageCounts)
			.map(([name, size]) => ({
				name,
				percentage: Math.round((size / totalSize) * 100),
				color: languageColors[name] || "#6e7681",
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 5);

		// Process contribution data
		let contributionDays: ContributionDay[] = [];
		let totalCommits = 0;
		let totalPRs = 0;
		let totalContributions = 0;

		if (contributionData) {
			// Use GraphQL data
			totalCommits = contributionData.totalCommitContributions || 0;
			totalPRs = contributionData.totalPullRequestContributions || 0;
			totalContributions = contributionData.contributionCalendar?.totalContributions || 0;

			// Get last 7 weeks of contributions
			const allDays: ContributionDay[] = [];
			const weeks = contributionData.contributionCalendar?.weeks || [];

			for (const week of weeks) {
				for (const day of week.contributionDays) {
					const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
						NONE: 0,
						FIRST_QUARTILE: 1,
						SECOND_QUARTILE: 2,
						THIRD_QUARTILE: 3,
						FOURTH_QUARTILE: 4,
					};
					allDays.push({
						date: day.date,
						count: day.contributionCount,
						level: levelMap[day.contributionLevel] || 0,
					});
				}
			}

			// Get last 49 days (7 weeks)
			contributionDays = allDays.slice(-49);
		} else {
			// Fallback: generate empty contribution grid
			const now = new Date();
			for (let i = 48; i >= 0; i--) {
				const date = new Date(now);
				date.setDate(date.getDate() - i);
				contributionDays.push({
					date: date.toISOString().split("T")[0],
					count: 0,
					level: 0,
				});
			}
		}

		// Calculate streaks
		let currentStreak = 0;
		let longestStreak = 0;
		let tempStreak = 0;

		for (let i = contributionDays.length - 1; i >= 0; i--) {
			if (contributionDays[i].count > 0) {
				tempStreak++;
				if (i === contributionDays.length - 1 || contributionDays[i + 1]?.count > 0) {
					currentStreak = tempStreak;
				}
			} else {
				longestStreak = Math.max(longestStreak, tempStreak);
				tempStreak = 0;
			}
		}
		longestStreak = Math.max(longestStreak, tempStreak);

		const stats: GitHubStats = {
			totalContributions,
			currentStreak,
			longestStreak,
			contributionDays,
			topLanguages,
			totalCommits,
			totalPRs,
			totalRepos: user.public_repos,
		};

		return NextResponse.json(stats);
	} catch (error) {
		console.error("GitHub stats API error:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
	}
}
