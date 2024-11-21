// @ts-nocheck
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BlogPost {
	id: number;
	title: string;
	transcript: string;
	image: string;
}

interface FeaturedPost extends BlogPost {
	author: string;
}

const POSTS_PER_PAGE = 21; // 3 columns * 7 rows

const generateMockPosts = (start: number, end: number): BlogPost[] => {
	return Array.from({ length: end - start + 1 }, (_, index) => ({
		id: start + index,
		title: `Blog Post ${start + index}`,
		transcript: `This is a short transcript for Blog Post ${start + index}. It provides a brief overview of the content discussed in this post.`,
		image: `https://placehold.co/600x1200?text=Blog%20${start + index}`,
	}));
};

const featuredPost: FeaturedPost = {
	id: 0,
	title: "Featured: The Future of Web Development",
	transcript: "Explore the cutting-edge technologies and methodologies shaping the future of web development. From AI-driven design to serverless architectures, discover what's next in our field.",
	image: "https://placehold.co/600x1200?text=Featured%20Post",
	author: "John Doe",
};

export default function BlogPostsTable() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const loadMorePosts = useCallback(() => {
		if (isLoading) return;
		setIsLoading(true);
		const newPosts = generateMockPosts(posts.length + 1, posts.length + POSTS_PER_PAGE);
		setPosts((prevPosts) => [...prevPosts, ...newPosts]);
		setIsLoading(false);
	}, [posts.length, isLoading]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMorePosts();
				}
			},
			{ threshold: 1.0 }
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [loadMorePosts]);

	useEffect(() => {
		loadMorePosts();
	}, []);

	return (
		<div className="min-h-screen bg-black text-white p-6 sm:p-10">
			<div className="max-w-screen-2xl mx-auto">
				{/* Featured Post */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16">
					<div className="relative h-[400px] mb-6 rounded-lg overflow-hidden shadow-[0_8px_20px_rgba(255,255,255,0.2)]">
						<Image src={featuredPost.image} alt={`Featured: ${featuredPost.title}`} fill className="object-cover" />
					</div>
					<h2 className="font-mono text-3xl font-bold mb-4">
						<a href="#" className="hover:text-blue-400 transition-colors duration-200">
							{featuredPost.title}
						</a>
					</h2>
					<p className="text-lg text-gray-300 mb-4 line-clamp-3">{featuredPost.transcript}</p>
					<div className="flex items-center text-sm text-gray-400">
						<span>By {featuredPost.author}</span>
					</div>
				</motion.div>

				{/* Regular Posts Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
					{posts.map((post) => (
						<motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col">
							<div className="relative h-56 mb-6 rounded-lg overflow-hidden shadow-[0_8px_20px_rgba(255,255,255,0.2)]">
								<Image src={post.image} alt={`Thumbnail for ${post.title}`} fill className="object-cover" />
							</div>
							<h2 className="font-mono text-xl font-bold mb-3">
								<a href="#" className="hover:text-blue-400 transition-colors duration-200">
									{post.title}
								</a>
							</h2>
							<p className="text-sm text-gray-400 line-clamp-3">{post.transcript}</p>
						</motion.div>
					))}
				</div>

				<div ref={loadMoreRef} className="h-10 mt-16" />
				<AnimatePresence>
					{isLoading && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-center py-4">
							Loading more posts...
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
