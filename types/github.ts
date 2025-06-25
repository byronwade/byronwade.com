export interface GitHubProfile {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
	name: string;
	company: string | null;
	blog: string;
	location: string;
	email: string | null;
	bio: string;
	twitter_username: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	language: string;
	topics: string[];
	updated_at: string;
	created_at: string;
	homepage?: string;
	size: number;
	default_branch: string;
	open_issues_count: number;
	owner: {
		login: string;
		avatar_url: string;
	};
	// Enhanced repository metrics
	subscribers_count?: number;
	network_count?: number;
	archived?: boolean;
	disabled?: boolean;
	private?: boolean;
	fork?: boolean;
	has_issues?: boolean;
	has_projects?: boolean;
	has_wiki?: boolean;
	has_pages?: boolean;
	has_downloads?: boolean;
	pushed_at?: string;
	git_url?: string;
	ssh_url?: string;
	clone_url?: string;
	license?: {
		key: string;
		name: string;
		spdx_id: string;
		url: string;
	};
	// Priority project properties
	progress?: number;
	status?: string;
	concept?: string;
}

// Repository statistics and analytics
export interface GitHubRepoStatistics {
	repoId: number;
	// Commit activity
	commit_activity?: {
		total: number;
		week_data: Array<{
			week: number;
			total: number;
			days: number[];
		}>;
	};
	// Contributor statistics
	contributors?: Array<{
		author: {
			login: string;
			id: number;
			avatar_url: string;
			html_url: string;
		};
		total: number;
		weeks: Array<{
			w: number; // Week timestamp
			a: number; // Additions
			d: number; // Deletions
			c: number; // Commits
		}>;
	}>;
	// Language breakdown
	languages?: Record<string, number>;
	// Code frequency
	code_frequency?: Array<[number, number, number]>; // [timestamp, additions, deletions]
	// Participation stats
	participation?: {
		all: number[];
		owner: number[];
	};
	// Punch card data (commit activity by hour/day)
	punch_card?: Array<[number, number, number]>; // [day, hour, commits]
}

// Repository traffic data
export interface GitHubRepoTraffic {
	repoId: number;
	// Views data
	views?: {
		count: number;
		uniques: number;
		views: Array<{
			timestamp: string;
			count: number;
			uniques: number;
		}>;
	};
	// Clones data
	clones?: {
		count: number;
		uniques: number;
		clones: Array<{
			timestamp: string;
			count: number;
			uniques: number;
		}>;
	};
	// Popular paths
	popular_paths?: Array<{
		path: string;
		title: string;
		count: number;
		uniques: number;
	}>;
	// Referral sources
	referrers?: Array<{
		referrer: string;
		count: number;
		uniques: number;
	}>;
}

// GitHub Actions workflow data
export interface GitHubWorkflowData {
	repoId: number;
	workflows?: Array<{
		id: number;
		name: string;
		path: string;
		state: string;
		created_at: string;
		updated_at: string;
		url: string;
		html_url: string;
		badge_url: string;
	}>;
	// Workflow runs summary
	workflow_runs_summary?: {
		total_runs: number;
		successful_runs: number;
		failed_runs: number;
		cancelled_runs: number;
		success_rate: number;
		avg_duration: number; // in seconds
	};
	// Recent workflow runs
	recent_runs?: Array<{
		id: number;
		name: string;
		head_branch: string;
		head_sha: string;
		status: string;
		conclusion: string;
		workflow_id: number;
		created_at: string;
		updated_at: string;
		run_duration?: number;
	}>;
}

// Release information
export interface GitHubReleaseData {
	repoId: number;
	releases?: Array<{
		id: number;
		tag_name: string;
		target_commitish: string;
		name: string;
		draft: boolean;
		prerelease: boolean;
		created_at: string;
		published_at: string;
		body: string;
		html_url: string;
		tarball_url: string;
		zipball_url: string;
		download_count?: number;
		assets: Array<{
			id: number;
			name: string;
			label: string;
			content_type: string;
			size: number;
			download_count: number;
			created_at: string;
			updated_at: string;
			browser_download_url: string;
		}>;
	}>;
	release_frequency?: {
		total_releases: number;
		avg_days_between_releases: number;
		most_downloaded_release?: {
			tag_name: string;
			download_count: number;
		};
	};
}

// Community health metrics
export interface GitHubCommunityHealth {
	repoId: number;
	health_percentage: number;
	description?: string;
	documentation?: string;
	files: {
		code_of_conduct?: {
			name: string;
			key: string;
			url: string;
			html_url: string;
		};
		code_of_conduct_file?: {
			url: string;
			html_url: string;
		};
		contributing?: {
			url: string;
			html_url: string;
		};
		issue_template?: {
			url: string;
			html_url: string;
		};
		pull_request_template?: {
			url: string;
			html_url: string;
		};
		license?: {
			name: string;
			key: string;
			spdx_id: string;
			url: string;
			html_url: string;
		};
		readme?: {
			url: string;
			html_url: string;
		};
	};
	updated_at: string;
	content_reports_enabled?: boolean;
}

// Issues and Pull Requests metrics
export interface GitHubIssuesPRMetrics {
	repoId: number;
	issues_summary?: {
		total_open: number;
		total_closed: number;
		avg_time_to_close: number; // in days
		issues_by_label: Array<{
			label: string;
			count: number;
		}>;
	};
	pull_requests_summary?: {
		total_open: number;
		total_closed: number;
		total_merged: number;
		avg_time_to_merge: number; // in days
		avg_review_time: number; // in days
		merge_rate: number; // percentage
	};
	recent_activity?: Array<{
		type: "issue" | "pull_request";
		number: number;
		title: string;
		state: string;
		created_at: string;
		updated_at: string;
		html_url: string;
		user: {
			login: string;
			avatar_url: string;
		};
	}>;
}

// Security and dependency information
export interface GitHubSecurityData {
	repoId: number;
	security_advisories?: Array<{
		id: string;
		ghsa_id: string;
		summary: string;
		description: string;
		severity: string;
		published_at: string;
		updated_at: string;
	}>;
	vulnerability_alerts?: {
		total_count: number;
		open_count: number;
		dismissed_count: number;
		fixed_count: number;
	};
	dependency_graph?: {
		dependencies: Array<{
			package_name: string;
			package_manager: string;
			requirements: string;
			scope: string;
		}>;
	};
	// Code scanning alerts
	code_scanning_alerts?: {
		total_count: number;
		open_count: number;
		dismissed_count: number;
		fixed_count: number;
	};
}

// Comprehensive repository analytics combining all metrics
export interface GitHubRepoAnalytics {
	repo: GitHubRepo;
	statistics?: GitHubRepoStatistics;
	traffic?: GitHubRepoTraffic;
	workflows?: GitHubWorkflowData;
	releases?: GitHubReleaseData;
	community_health?: GitHubCommunityHealth;
	issues_prs?: GitHubIssuesPRMetrics;
	security?: GitHubSecurityData;
	// Calculated metrics
	calculated_metrics?: {
		activity_score: number; // 0-100 based on commits, issues, PRs
		community_score: number; // 0-100 based on stars, forks, contributors
		maintenance_score: number; // 0-100 based on recent activity, issues resolution
		popularity_trend: "rising" | "stable" | "declining";
		tech_stack_analysis?: {
			primary_language: string;
			language_diversity: number;
			modern_practices_score: number;
		};
	};
}
