export interface DribbbleShot {
	animated?: boolean;
	attachments?: Array<{
		id: number;
		url: string;
		thumbnail_url: string;
		size: number;
		content_type: string;
	}>;
	buckets_count?: number; // Collections this shot is in
	// Color palette extracted from the shot
	colors?: string[];
	comments_count?: number;
	description?: string;
	height?: number;
	html_url: string;
	id: number;
	images: {
		four_x?: string | null; // Highest quality (1600x1200)
		hidpi: string | null; // High quality (800x600)
		two_x?: string | null; // 2x quality (800x600)
		one_x?: string | null; // 1x quality (400x300)
		normal: string; // Normal quality (400x300)
		teaser: string; // Thumbnail (200x150)
	};
	likes_count?: number;
	// Project context
	project?: {
		id: number;
		name: string;
		description?: string;
		shots_count?: number;
		created_at?: string;
	};
	published_at?: string;
	rebounds_count?: number; // Shots inspired by this one
	tags?: string[];
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
	title: string;
	updated_at?: string;
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
	views_count?: number;
	width?: number;
}
// User portfolio analytics
