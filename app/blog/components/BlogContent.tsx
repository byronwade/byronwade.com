"use client";

import { Suspense } from "react";
import FeaturedPost from "./FeaturedPost";
import { type Post } from "../types";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { useFocusList, useFocusTrap } from "@/hooks/useKeyboardNavigation";

export default function BlogContent({ posts }: { posts: Post[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const postRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	// Initialize refs array
	useEffect(() => {
		postRefs.current = new Array(posts.length - 1).fill(null);
	}, [posts.length]);

	// Ref callback for post links
	const setPostRef = useCallback((element: HTMLAnchorElement | null, index: number) => {
		if (postRefs.current) {
			postRefs.current[index] = element;
		}
	}, []);

	// Use focus trap for the entire blog container
	useFocusTrap(containerRef as React.RefObject<HTMLElement>);

	// Use focus list for blog post navigation
	const focusIndex = useFocusList(
		postRefs.current.map((_, i) => ({
			current: postRefs.current[i],
		})) as React.RefObject<HTMLElement>[]
	);

	// Handle keyboard shortcuts for quick navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Alt + H to go to home
			if (e.altKey && e.key === "h") {
				e.preventDefault();
				window.location.href = "/";
			}
			// Alt + F to focus on featured post
			if (e.altKey && e.key === "f") {
				e.preventDefault();
				const featuredPost = document.querySelector<HTMLElement>("[data-featured-post]");
				featuredPost?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	if (!posts.length) {
		return (
			<div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white" role="region" aria-label="Blog content">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<h1 className="text-3xl font-bold">Blog</h1>
					<p className="mt-4" role="alert">
						No posts available at the moment.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white" role="region" aria-label="Blog content">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<section aria-label="Featured post">
					<Suspense
						fallback={
							<div role="status" aria-label="Loading featured post">
								Loading featured post...
							</div>
						}
					>
						<div data-featured-post tabIndex={0}>
							<FeaturedPost post={posts[0]} />
						</div>
					</Suspense>
				</section>

				<section className="mt-16" aria-label="Blog posts">
					<h2 className="sr-only">All blog posts</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="feed" aria-label="Blog posts list">
						{posts.slice(1).map((post, index) => (
							<article key={post.id} className="rounded-lg overflow-hidden" role="article">
								<a
									ref={(el) => setPostRef(el, index)}
									href={`/blog/${post.handle}`}
									className={`block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${focusIndex === index ? "ring-2 ring-blue-500" : ""}`}
									aria-label={`Read ${post.title}`}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											window.location.href = `/blog/${post.handle}`;
										}
									}}
								>
									<div className="aspect-video relative">
										<Image src={post.image} alt={`Cover image for ${post.title}`} width={500} height={300} priority={true} />
									</div>
									<div className="p-6">
										<h3 className="text-xl font-bold mb-2">{post.title}</h3>
										<p className="text-neutral-400">{post.excerpt}</p>
										<time className="text-sm text-neutral-500 mt-2 block" dateTime={new Date(post.date).toISOString()}>
											{new Date(post.date).toLocaleDateString()}
										</time>
									</div>
								</a>
							</article>
						))}
					</div>
				</section>

				{/* Keyboard Navigation Help */}
				<div className="mt-8 text-sm text-neutral-500" role="complementary" aria-label="Keyboard shortcuts">
					<h2 className="font-medium mb-2">Keyboard Shortcuts:</h2>
					<ul className="space-y-1">
						<li>
							Press <kbd className="px-2 py-1 bg-neutral-200 rounded">Alt + H</kbd> to go home
						</li>
						<li>
							Press <kbd className="px-2 py-1 bg-neutral-200 rounded">Alt + F</kbd> to focus featured post
						</li>
						<li>
							Use <kbd className="px-2 py-1 bg-neutral-200 rounded">↑</kbd> <kbd className="px-2 py-1 bg-neutral-200 rounded">↓</kbd> to navigate posts
						</li>
						<li>
							Press <kbd className="px-2 py-1 bg-neutral-200 rounded">Enter</kbd> to read post
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
