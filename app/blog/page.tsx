import { Suspense } from "react";
import { getBlogPosts } from "@/actions/shopify/getBlogPosts";
import { BlogCard, FeaturedPost } from "./components";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Post } from "./types";

// Enable edge runtime
export const runtime = "edge";
export const preferredRegion = "auto";
export const dynamic = "force-dynamic";

function BlogGrid({ posts }: { posts: Post[] }) {
	return (
		<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{posts.map((post, index) => (
				<BlogCard key={post.id} post={post} priority={index < 3} />
			))}
		</div>
	);
}

export default async function BlogPage() {
	const posts = await getBlogPosts(50);
	console.log("Retrieved posts:", posts);

	if (!posts.length) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-12">
					<h1 className="text-3xl font-bold">Blog</h1>
					<p className="mt-4 text-muted-foreground">No posts available at the moment.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-12">
				<Suspense fallback={<LoadingSpinner />}>
					<FeaturedPost post={posts[0]} />
				</Suspense>

				<Suspense fallback={<LoadingSpinner />}>
					<BlogGrid posts={posts.slice(1)} />
				</Suspense>
			</div>
		</div>
	);
}
