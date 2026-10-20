/**
 * A GitHub repository as this app consumes it, the fields the portfolio route,
 * the portfolio page, and the sort in `getGitHubRepositories` actually read.
 *
 * Optional metadata and nullable dates follow GitHub's minimal-repository schema.
 * Counts are required because the page displays them. Missing dates sort behind
 * dated activity; the loader never invents a date or count.
 */
export interface GitHubRepo {
	archived?: boolean;
	created_at?: string | null;
	description: string | null;
	fork: boolean;
	forks_count: number;
	full_name: string;
	homepage?: string | null;
	html_url: string;
	id: number;
	language?: string | null;
	name: string;
	pushed_at?: string | null;
	stargazers_count: number;
	topics?: string[];
	updated_at?: string | null;
}
