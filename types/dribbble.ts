/** Validated shot fields. Additional API metadata is preserved without claiming its shape. */
export interface DribbbleShot {
	animated?: boolean;
	buckets_count?: number;
	colors?: string[];
	comments_count?: number;
	description?: string | null;
	height?: number;
	html_url: string;
	id: number;
	images: {
		four_x?: string | null;
		hidpi: string | null;
		two_x?: string | null;
		one_x?: string | null;
		normal: string;
		teaser: string;
	};
	likes_count?: number;
	published_at?: string;
	rebounds_count?: number;
	tags?: string[];
	title: string;
	updated_at?: string;
	views_count?: number;
	width?: number;
}
