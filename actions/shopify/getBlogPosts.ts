export const runtime = "edge";

import { unstable_cache } from "@/lib/unstable-cache";
import { shopifyClient } from "@/lib/shopify";
import { getBlogPostsQuery } from "@/lib/queries/blog";

interface BlogPost {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	publishedAt: string;
	image?: {
		url: string;
	};
	content: string;
}

interface ProcessedBlogPost {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	date: string;
	image: string;
	content: string;
}

export const getBlogPosts = unstable_cache(
	async (first: number = 50): Promise<ProcessedBlogPost[]> => {
		const { data } = await shopifyClient.request(getBlogPostsQuery, {
			variables: {
				first: Math.min(first, 50),
			},
		});

		console.log("Raw blog response:", JSON.stringify(data, null, 2));

		if (!data?.blog?.articles?.edges) {
			console.log("No articles found");
			return [];
		}

		return data.blog.articles.edges.map(({ node }: { node: BlogPost }) => ({
			id: node.id,
			title: node.title,
			handle: node.handle,
			excerpt: node.excerpt || node.content.substring(0, 150) + "...",
			date: node.publishedAt,
			image: node.image?.url || "/next.svg",
			content: node.content,
		}));
	},
	["blog-posts"],
	{
		revalidate: 60 * 60 * 2, // Cache for 2 hours
	}
);

export const getBlogPost = unstable_cache(
	async (handle: string): Promise<ProcessedBlogPost | undefined> => {
		const posts = await getBlogPosts(50);
		return posts.find((post) => post.handle === handle);
	},
	["blog-post"],
	{
		revalidate: 60 * 60 * 2, // Cache for 2 hours
	}
);
