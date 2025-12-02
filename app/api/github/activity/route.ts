import { type NextRequest, NextResponse } from "next/server";

interface GitHubEvent {
	id: string;
	type: string;
	created_at: string;
	repo: {
		name: string;
		full_name: string;
	};
	payload?: {
		action?: string;
		commits?: Array<{
			message: string;
			sha: string;
		}>;
	};
}

interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	updated_at: string;
	html_url: string;
}

export async function GET(request: NextRequest) {
	try {
		const username = "byronwade";

		// Build headers with optional GitHub token
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "byronwade.com",
		};

		// Add authorization if token is provided (supports both token and Bearer formats)
		const githubToken = process.env.GITHUB_API_TOKEN || process.env.GITHUB_TOKEN;
		if (githubToken) {
			headers.Authorization = `Bearer ${githubToken}`;
		}

		// Fetch recent events and repositories in parallel
		const [eventsResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${username}/events/public?per_page=5`, {
				headers,
				next: { revalidate: 300 }, // Cache for 5 minutes
			}),
			fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5&type=owner`, {
				headers,
				next: { revalidate: 600 }, // Cache for 10 minutes
			}),
		]);

		// Handle errors with more detail
		let events: GitHubEvent[] = [];
		let repos: GitHubRepo[] = [];
		let errorMessage = "";

		if (!eventsResponse.ok) {
			const errorText = await eventsResponse.text();
			console.error(`GitHub events API error (${eventsResponse.status}):`, errorText);
			errorMessage = `Events: ${eventsResponse.status} ${eventsResponse.statusText}`;
		} else {
			try {
				events = await eventsResponse.json();
			} catch (e) {
				console.error("Failed to parse events JSON:", e);
			}
		}

		if (!reposResponse.ok) {
			const errorText = await reposResponse.text();
			console.error(`GitHub repos API error (${reposResponse.status}):`, errorText);
			errorMessage += errorMessage
				? ` | Repos: ${reposResponse.status}`
				: `Repos: ${reposResponse.status} ${reposResponse.statusText}`;
		} else {
			try {
				repos = await reposResponse.json();
			} catch (e) {
				console.error("Failed to parse repos JSON:", e);
			}
		}

		// If both failed, return error
		if (events.length === 0 && repos.length === 0 && errorMessage) {
			return NextResponse.json(
				{
					error: "Failed to fetch GitHub data",
					details: errorMessage,
					message: "GitHub API request failed. Check console for details.",
				},
				{ status: 500 }
			);
		}

		// Format recent activity
		const recentActivity = events.slice(0, 5).map((event) => {
			let description = "";
			switch (event.type) {
				case "PushEvent":
					description = event.payload?.commits?.[0]?.message || "Pushed commits";
					break;
				case "CreateEvent":
					description = "Created repository";
					break;
				case "WatchEvent":
					description = "Starred repository";
					break;
				case "ForkEvent":
					description = "Forked repository";
					break;
				default:
					description = event.type.replace("Event", "");
			}

			return {
				type: event.type,
				repo: event.repo.name,
				description,
				time: new Date(event.created_at).toISOString(),
			};
		});

		// Format recent repositories
		const recentRepos = repos.slice(0, 5).map((repo) => ({
			name: repo.name,
			fullName: repo.full_name,
			description: repo.description,
			language: repo.language,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			updatedAt: repo.updated_at,
			url: repo.html_url,
		}));

		return NextResponse.json({
			activity: recentActivity,
			repositories: recentRepos,
			profile: {
				username,
				url: `https://github.com/${username}`,
			},
		});
	} catch (error) {
		console.error("GitHub API error:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub activity" }, { status: 500 });
	}
}
