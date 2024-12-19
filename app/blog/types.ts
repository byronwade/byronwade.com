export interface Post {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	date: string;
	image: string;
	content: string;
	seo?: {
		title: string;
		description: string;
	};
	author?: string;
	tags?: string[];
}
