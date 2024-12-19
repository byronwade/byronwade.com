import { Metadata } from "next";
import { getBlogPosts } from "@/app/actions/shopify/getBlogPosts";
import BlogContent from "./components/BlogContent";

export const metadata: Metadata = {
	title: "Blog | Byron Wade - Insights on Tech & Entrepreneurship",
	description: "Explore articles on web development, entrepreneurship, and technology innovation. Get insights from Byron Wade's experience in building successful tech and construction businesses.",
	openGraph: {
		title: "Blog | Byron Wade - Tech & Business Insights",
		description: "Expert insights on web development, entrepreneurship, and technology innovation.",
		images: [
			{
				url: new URL("/api/og?title=Blog&description=Tech %26 Business Insights&type=blog", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString(),
				width: 1200,
				height: 630,
				alt: "Byron Wade's Blog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog | Byron Wade - Tech & Business Insights",
		description: "Expert insights on web development, entrepreneurship, and technology innovation.",
		images: [new URL("/api/og?title=Blog&description=Tech %26 Business Insights&type=blog", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString()],
	},
};

// Separate data fetching from component
async function getBlogData() {
	const posts = await getBlogPosts(50);
	return posts;
}

// Main page component
export default async function BlogPage() {
	const posts = await getBlogData();
	return <BlogContent posts={posts} />;
}
