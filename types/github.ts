/**
 * A GitHub repository as this app consumes it — the fields the portfolio route,
 * the portfolio page, and the sort in `getGitHubRepositories` actually read.
 *
 * Nullability mirrors the GitHub REST API: `description`, `homepage`, and
 * `language` are null for repos that have not set them.
 */
export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	homepage: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	topics?: string[];
	created_at: string;
	updated_at: string;
	pushed_at?: string;
	archived?: boolean;
	fork?: boolean;
}
