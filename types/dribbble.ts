export interface DribbbleShot {
	id: number;
	title: string;
	description?: string;
	html_url: string;
	width?: number;
	height?: number;
	animated?: boolean;
	images: {
		four_x?: string | null; // Highest quality (1600x1200)
		hidpi: string | null; // High quality (800x600)
		two_x?: string | null; // 2x quality (800x600)
		one_x?: string | null; // 1x quality (400x300)
		normal: string; // Normal quality (400x300)
		teaser: string; // Thumbnail (200x150)
	};
	published_at?: string;
	updated_at?: string;
	tags?: string[];
	views_count?: number;
	likes_count?: number;
	comments_count?: number;
	rebounds_count?: number; // Shots inspired by this one
	buckets_count?: number; // Collections this shot is in
	attachments?: Array<{
		id: number;
		url: string;
		thumbnail_url: string;
		size: number;
		content_type: string;
	}>;
	user?: {
		id?: number;
		name?: string;
		username?: string;
		login?: string;
		html_url?: string;
		avatar_url?: string;
		bio?: string;
		location?: string;
		links?: {
			web?: string;
			twitter?: string;
		};
		// Enhanced user metrics
		shots_count?: number;
		followers_count?: number;
		followings_count?: number;
		likes_count?: number;
		likes_received_count?: number;
		comments_received_count?: number;
		rebounds_received_count?: number;
		can_upload_shot?: boolean;
		type?: string;
		pro?: boolean;
		buckets_count?: number;
		projects_count?: number;
		teams_count?: number;
		created_at?: string;
	};
	// Color palette extracted from the shot
	colors?: string[];
	// Project context
	project?: {
		id: number;
		name: string;
		description?: string;
		shots_count?: number;
		created_at?: string;
	};
	// Team information if applicable
	team?: {
		id: number;
		name: string;
		login: string;
		html_url: string;
		avatar_url: string;
		bio?: string;
		location?: string;
		members_count?: number;
		shots_count?: number;
		created_at?: string;
	};
}

// Extended analytics interface for shot performance
export interface DribbbleShotAnalytics {
	shotId: number;
	// Engagement metrics
	engagement_rate?: number;
	views_to_likes_ratio?: number;
	comments_to_views_ratio?: number;
	// Performance over time
	daily_views?: Array<{
		date: string;
		views: number;
		likes: number;
		comments: number;
	}>;
	// Geographic data
	top_countries?: Array<{
		country: string;
		views: number;
		percentage: number;
	}>;
	// Referral sources
	referral_sources?: Array<{
		source: string;
		views: number;
		percentage: number;
	}>;
	// Device analytics
	device_breakdown?: {
		desktop: number;
		mobile: number;
		tablet: number;
	};
}

// User portfolio analytics
export interface DribbbleUserAnalytics {
	userId: number;
	// Overall performance
	total_views: number;
	total_likes: number;
	total_comments: number;
	total_rebounds: number;
	// Growth metrics
	followers_growth?: Array<{
		date: string;
		count: number;
	}>;
	// Engagement trends
	engagement_trends?: Array<{
		period: string;
		avg_likes_per_shot: number;
		avg_views_per_shot: number;
		avg_comments_per_shot: number;
	}>;
	// Top performing shots
	top_shots?: Array<{
		shot_id: number;
		title: string;
		views: number;
		likes: number;
		engagement_score: number;
	}>;
}
