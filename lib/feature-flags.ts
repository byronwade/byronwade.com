import { unstable_flag as flag } from "@vercel/flags";

export const showBlog = flag({
	key: "blog-enabled",
	decide: () => process.env.NEXT_PUBLIC_BLOG_ENABLED === "1",
});

export const showAnalysis = flag({
	key: "analysis-enabled",
	decide: () => process.env.NEXT_PUBLIC_ANALYSIS_ENABLED === "1",
});

export const showShop = flag({
	key: "shop-enabled",
	decide: () => process.env.NEXT_PUBLIC_SHOP_ENABLED === "1",
});

// Group flags for precomputation
export const pageFlags = [showBlog, showAnalysis, showShop] as const;
