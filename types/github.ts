/**
 * A GitHub repository as this app consumes it, the fields the portfolio route,
 * the portfolio page, and the sort in `getGitHubRepositories` actually read.
 *
 * Nullability mirrors the GitHub REST API: `description`, `homepage`, and
 * `language` are null for repos that have not set them.
 */
export interface GitHubRepo {
	archived?: boolean;
	created_at: string;
	description: string | null;
	fork?: boolean;
	forks_count: number;
	full_name: string;
	homepage: string | null;
	html_url: string;
	id: number;
	language: string | null;
	name: string;
	pushed_at?: string;
	stargazers_count: number;
	topics?: string[];
	updated_at: string;
}
