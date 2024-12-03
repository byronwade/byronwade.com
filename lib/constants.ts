export const SHOPIFY = {
	MAX_POSTS: 50,
	MAX_PRODUCTS: 50,
	DEFAULT_IMAGE: "/next.svg",
	EXCERPT_LENGTH: 150,
} as const;

export const CACHE = {
	TAGS: {
		PRODUCTS: "products",
		BLOG: "blog",
		SINGLE_PRODUCT: "single-product",
		SINGLE_POST: "single-post",
	},
	REVALIDATE: {
		FAST: 60, // 1 minute
		NORMAL: 300, // 5 minutes
		SLOW: 3600, // 1 hour
		DAILY: 86400, // 24 hours
	},
} as const;

export const ERROR_MESSAGES = {
	PRODUCTS: {
		FETCH_FAILED: "Failed to fetch products. Please try again later.",
		INVALID_HANDLE: "Invalid product handle provided",
		NOT_FOUND: "No products found in the response",
	},
	BLOG: {
		FETCH_FAILED: "Failed to fetch blog posts. Please try again later.",
		INVALID_HANDLE: "Invalid blog post handle provided",
		INVALID_COUNT: "Number of posts must be between 1 and 50",
	},
} as const;
