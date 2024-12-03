"use cache";

import { shopifyClient } from "@/lib/shopify";
import { getBlogPostsQuery } from "@/lib/queries/blog";
import { BlogError } from "@/lib/errors";
import { ERROR_MESSAGES, SHOPIFY } from "@/lib/constants";

interface ShopifyImage {
	url: string;
	altText?: string;
	width: number;
	height: number;
}

interface ShopifySEO {
	title: string;
	description: string;
}

interface ShopifyAuthor {
	name: string;
	bio?: string;
	email?: string;
}

interface ShopifyBlogPost {
	id: string;
	title: string;
	handle: string;
	excerpt: string | null;
	publishedAt: string;
	image?: ShopifyImage;
	content: string;
	seo?: ShopifySEO;
	author?: ShopifyAuthor;
	tags?: string[];
}

interface ProcessedBlogPost {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	date: string;
	image: string;
	content: string;
	seo?: ShopifySEO;
	author?: string;
	tags?: string[];
}

function processShopifyBlogPost(post: ShopifyBlogPost): ProcessedBlogPost {
	return {
		id: post.id,
		title: post.title,
		handle: post.handle,
		excerpt: post.excerpt || post.content.substring(0, SHOPIFY.EXCERPT_LENGTH) + "...",
		date: new Date(post.publishedAt).toISOString(),
		image: post.image?.url || SHOPIFY.DEFAULT_IMAGE,
		content: post.content,
		seo: post.seo,
		author: post.author?.name,
		tags: post.tags,
	};
}

export async function getBlogPosts(first: number = SHOPIFY.MAX_POSTS): Promise<ProcessedBlogPost[]> {
	if (first <= 0 || first > SHOPIFY.MAX_POSTS) {
		throw BlogError.invalidInput(ERROR_MESSAGES.BLOG.INVALID_COUNT);
	}

	try {
		const { data } = await shopifyClient.request(getBlogPostsQuery, {
			variables: {
				first: Math.min(first, SHOPIFY.MAX_POSTS),
			},
		});

		if (!data?.blog?.articles?.edges) {
			return [];
		}

		return data.blog.articles.edges.map(({ node }: { node: ShopifyBlogPost }) => processShopifyBlogPost(node));
	} catch (error) {
		console.error("Failed to fetch blog posts:", error);
		throw BlogError.fetchError(ERROR_MESSAGES.BLOG.FETCH_FAILED, error);
	}
}

export async function getBlogPost(handle: string): Promise<ProcessedBlogPost | null> {
	if (!handle || typeof handle !== "string") {
		throw BlogError.invalidInput(ERROR_MESSAGES.BLOG.INVALID_HANDLE);
	}

	try {
		const posts = await getBlogPosts(SHOPIFY.MAX_POSTS);
		const post = posts.find((post) => post.handle === handle);
		return post || null;
	} catch (error) {
		console.error(`Failed to fetch blog post with handle ${handle}:`, error);
		throw BlogError.fetchError(ERROR_MESSAGES.BLOG.FETCH_FAILED, error);
	}
}
