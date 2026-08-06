import { NextResponse } from "next/server";

interface ContributionDay {
	count: number;
	date: string;
	level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStats {
	color: string;
	name: string;
	percentage: number;
}

/** The `contributionsCollection` slice of the GitHub GraphQL response. */
interface ContributionsCollection {
	contributionCalendar?: {
		totalContributions?: number;
		weeks?: Array<{
			contributionDays: Array<{
				date: string;
				contributionCount: number;
				contributionLevel: string;
			}>;
		}>;
	};
	totalCommitContributions?: number;
	totalPullRequestContributions?: number;
}

interface GitHubStats {
	contributionDays: ContributionDay[];
	currentStreak: number;
	longestStreak: number;
	topLanguages: LanguageStats[];
	totalCommits: number;
	totalContributions: number;
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

const USERNAME = "byronwade";
const CONTRIBUTION_DAYS_SHOWN = 49;
const FALLBACK_COLOR = "#6e7681";

/** GitHub's contribution levels, mapped to the grid intensities the UI renders. */
const CONTRIBUTION_LEVELS: Record<string, 0 | 1 | 2 | 3 | 4> = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4,
};

const CONTRIBUTIONS_QUERY = `
	query($username: String!) {
		user(login: $username) {
			contributionsCollection {
				totalCommitContributions
				totalPullRequestContributions
				contributionCalendar {
					totalContributions
					weeks { contributionDays { date contributionCount contributionLevel } }
				}
			}
		}
	}
`;

function buildHeaders(token: string | undefined): HeadersInit {
	const headers: HeadersInit = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "byronwade.com",
	};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	return headers;
}

/** Contribution totals live only in the GraphQL API, which requires a token. */
async function fetchContributions(
	token: string | undefined,
	headers: HeadersInit
): Promise<ContributionsCollection | null> {
	if (!token) {
		return null;
	}
	try {
		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { username: USERNAME } }),
			next: { revalidate: 300 },
		});
		if (!response.ok) {
			return null;
		}
		const payload = await response.json();
		return payload.data?.user?.contributionsCollection ?? null;
	} catch (error) {
		console.error("GraphQL fetch failed:", error);
		return null;
	}
}

interface Repo {
	language?: string | null;
	size?: number;
}

function summarizeLanguages(repos: Repo[]): LanguageStats[] {
	const sizeByLanguage: Record<string, number> = {};
	let totalSize = 0;

	for (const repo of repos) {
		if (repo.language && repo.size && repo.size > 0) {
			sizeByLanguage[repo.language] = (sizeByLanguage[repo.language] ?? 0) + repo.size;
			totalSize += repo.size;
		}
	}
	if (totalSize === 0) {
		return [];
	}

	return Object.entries(sizeByLanguage)
		.map(([name, size]) => ({
			name,
			percentage: Math.round((size / totalSize) * 100),
			color: languageColors[name] ?? FALLBACK_COLOR,
		}))
		.sort((a, b) => b.percentage - a.percentage)
		.slice(0, 5);
}

/** The most recent seven weeks, or an empty grid when contributions are unavailable. */
function toContributionDays(contributions: ContributionsCollection | null): ContributionDay[] {
	if (!contributions) {
		const today = new Date();
		return Array.from({ length: CONTRIBUTION_DAYS_SHOWN }, (_, index) => {
			const date = new Date(today);
			date.setDate(date.getDate() - (CONTRIBUTION_DAYS_SHOWN - 1 - index));
			return { date: date.toISOString().slice(0, 10), count: 0, level: 0 as const };
		});
	}

	const days = (contributions.contributionCalendar?.weeks ?? []).flatMap((week) =>
		week.contributionDays.map((day) => ({
			date: day.date,
			count: day.contributionCount,
			level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
		}))
	);
	return days.slice(-CONTRIBUTION_DAYS_SHOWN);
}

/**
 * Walks backwards from today. The current streak only counts while the run is
 * still unbroken at the most recent day; the longest is the best run seen.
 */
function calculateStreaks(days: ContributionDay[]): { current: number; longest: number } {
	let current = 0;
	let longest = 0;
	let run = 0;

	for (let i = days.length - 1; i >= 0; i--) {
		if ((days[i]?.count ?? 0) > 0) {
			run++;
			if (i === days.length - 1 || (days[i + 1]?.count ?? 0) > 0) {
				current = run;
			}
		} else {
			longest = Math.max(longest, run);
			run = 0;
		}
	}
	return { current, longest: Math.max(longest, run) };
}

export async function GET() {
	try {
		const token = process.env.GITHUB_API_TOKEN || process.env.GITHUB_TOKEN;
		const headers = buildHeaders(token);

		const contributions = await fetchContributions(token, headers);

		const [userResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${USERNAME}`, { headers, next: { revalidate: 600 } }),
			fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`, {
				headers,
				next: { revalidate: 600 },
			}),
		]);

		if (!(userResponse.ok && reposResponse.ok)) {
			throw new Error("Failed to fetch GitHub data");
		}

		const user = await userResponse.json();
		const repos: Repo[] = await reposResponse.json();

		const contributionDays = toContributionDays(contributions);
		const streaks = calculateStreaks(contributionDays);

		const stats: GitHubStats = {
			contributionDays,
			currentStreak: streaks.current,
			longestStreak: streaks.longest,
			topLanguages: summarizeLanguages(repos),
			totalCommits: contributions?.totalCommitContributions ?? 0,
			totalContributions: contributions?.contributionCalendar?.totalContributions ?? 0,
			totalPRs: contributions?.totalPullRequestContributions ?? 0,
			totalRepos: user.public_repos,
		};

		return NextResponse.json(stats);
	} catch (error) {
		console.error("GitHub stats API error:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
	}
}
