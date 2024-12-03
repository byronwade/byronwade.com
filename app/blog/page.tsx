"use cache";

import { Suspense } from "react";
import FeaturedPost from "./components/FeaturedPost";
import { type Post } from "./types";
import { getBlogPosts } from "@/actions/shopify/getBlogPosts";
import Image from "next/image";

export async function getAllPosts(): Promise<Post[]> {
	const start = performance.now();
	try {
		const posts = await getBlogPosts(50);
		console.log("Cache fetch time:", performance.now() - start);
		if (!posts.length) {
			console.log("No blog posts found");
			return [];
		}
		return posts;
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		return [];
	}
}

export default async function BlogPage() {
	const posts = await getAllPosts();
	console.log(posts);

	if (!posts.length) {
		return (
			<div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<h1 className="text-3xl font-bold">Blog</h1>
					<p className="mt-4">No posts available at the moment.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<Suspense fallback={<div>Loading featured post...</div>}>
					<FeaturedPost post={posts[0]} />
				</Suspense>

				<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.slice(1).map((post) => (
						<div key={post.id} className="rounded-lg overflow-hidden">
							<div className="aspect-video relative">
								<Image src={post.image} alt={post.title} width={500} height={300} priority={true} />
							</div>
							<div className="p-6">
								<h2 className="text-xl font-bold mb-2">{post.title}</h2>
								<p className="text-neutral-400">{post.excerpt}</p>
								<time className="text-sm text-neutral-500 mt-2 block">{new Date(post.date).toLocaleDateString()}</time>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
