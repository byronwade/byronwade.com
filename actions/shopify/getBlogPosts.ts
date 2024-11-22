import { shopifyClient, type ShopifyResponse } from "@/lib/shopify";
import { getBlogPostsQuery } from "@/lib/queries/blog";
import type { Post } from "@/app/blog/types";

interface ArticleNode {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	publishedAt: string;
	image: {
		url: string;
		altText: string | null;
		width: number;
		height: number;
	} | null;
	content: string;
	author: {
		name: string;
	};
}

interface ArticlesResponse {
	articles: {
		pageInfo: {
			hasNextPage: boolean;
			endCursor: string | null;
		};
		edges: Array<{
			cursor: string;
			node: ArticleNode;
		}>;
	};
}

interface ShopifyArticlesResponse {
	data: {
		articles: {
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string | null;
			};
			edges: Array<{
				cursor: string;
				node: ArticleNode;
			}>;
		};
	};
}

const DEFAULT_BLOG_IMAGE = "https://cdn.shopify.com/s/files/1/0402/7626/3079/files/default-blog-image.jpg";

export async function getBlogPosts(first: number = 10) {
	try {
		const allPosts: Post[] = [];
		let hasNextPage = true;
		let afterCursor: string | null = null;
		let retryCount = 0;
		const maxRetries = 3;

		while (hasNextPage && retryCount < maxRetries) {
			try {
				const response: ShopifyResponse<ShopifyArticlesResponse> = await shopifyClient.request(getBlogPostsQuery, {
					variables: {
						first: Math.min(first, 50),
						after: afterCursor,
					},
				});

				const articles = response?.data?.data?.articles;
				if (!articles?.edges?.length) {
					console.log("No articles found");
					return [];
				}

				const posts = articles.edges.map(({ node }: { node: ArticleNode }) => ({
					id: node.id,
					title: node.title,
					image: node.image?.url || DEFAULT_BLOG_IMAGE,
					excerpt: node.excerpt || node.content.substring(0, 150) + "...",
					date: node.publishedAt,
				}));

				allPosts.push(...posts);
				hasNextPage = articles.pageInfo.hasNextPage && allPosts.length < first;
				afterCursor = articles.pageInfo.endCursor;

				if (allPosts.length >= first) {
					break;
				}
			} catch (error) {
				retryCount++;
				console.error(`Attempt ${retryCount} failed:`, error);

				if (retryCount === maxRetries) {
					console.log("Max retries reached");
					return [];
				}

				const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		return allPosts;
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		return [];
	}
}
