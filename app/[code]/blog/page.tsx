"use server";

import { Suspense } from "react";
import FeaturedPost from "./components/FeaturedPost";
import { type Post } from "./types";
import { getBlogPosts } from "@/actions/shopify/getBlogPosts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { unstable_cache } from "next/cache";
import { showBlog, pageFlags } from "@/lib/feature-flags";
import { notFound } from "next/navigation";
import Image from "next/image";

// Cache blog posts data
const getAllPosts = unstable_cache(
	async (): Promise<Post[]> => {
		try {
			const posts = await getBlogPosts(50);
			if (!posts.length) {
				console.log("No blog posts found");
				return [];
			}
			return posts;
		} catch (error) {
			console.error("Error fetching blog posts:", error);
			return [];
		}
	},
	["blog-posts"],
	{
		revalidate: 60 * 60, // Cache for 1 hour
		tags: ["blog-posts"],
	}
);

async function BlogContent() {
	const posts = await getAllPosts();

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
								<Image src={post.image} alt={post.title} width={500} height={300} priority={true} loading="eager" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
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

export default async function BlogPage({ params: { code } }: { params: { code: string } }) {
	// Check if blog feature is enabled
	const isEnabled = await showBlog(code, pageFlags);
	if (!isEnabled) {
		notFound();
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<BlogContent />
		</Suspense>
	);
}

export const generateMetadata = async ({ params: { code } }: { params: { code: string } }) => {
	// Check if blog feature is enabled for metadata
	const isEnabled = await showBlog(code, pageFlags);
	if (!isEnabled) {
		return {};
	}

	const posts = await getAllPosts();
	return {
		title: "Blog | Byron Wade",
		description: "Read the latest posts about web development, design, and digital marketing",
		openGraph: {
			title: "Blog | Byron Wade",
			description: "Read the latest posts about web development, design, and digital marketing",
			images: posts[0]?.image ? [{ url: posts[0].image }] : [],
		},
	};
};
