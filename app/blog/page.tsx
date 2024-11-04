"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const dayOfMonth = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${month} ${dayOfMonth}, ${year}`;
}

interface BlogPostProps {
	post: any;
	index: number;
	setActiveIndex: (index: number) => void;
}

function BlogPost({ post, index, setActiveIndex }: BlogPostProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		//@ts-ignore
		target: ref,
		offset: ["start end", "end start"],
	});
	const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			if (v > 0.3 && v < 0.7) {
				setActiveIndex(index);
			}
		});
		return () => unsubscribe();
	}, [scrollYProgress, index, setActiveIndex]);

	return (
		// @ts-ignore
		<motion.div ref={ref} style={{ opacity, scale }} className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 lg:pl-[calc(25%+1.5rem)]">
			<Card className="w-full mx-auto max-w-3xl bg-black border border-zinc-800 rounded-xl overflow-hidden z-10">
				<CardHeader className="flex justify-between items-center py-10 border-b border-zinc-800">
					<div className="h-8 w-8 flex items-center justify-center">
						<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-zinc-500">
							<path d="M12 2L2 19.7778H22L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 p-6">
					<div className="mb-4">
						<span className="text-lg sm:text-xl font-bold text-yellow-500">{formatDate(post.date)}</span>
					</div>
					<h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">{post.title}</h2>
					<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
						<div className="flex items-center gap-4">
							<div className="flex -space-x-2">
								{[...Array(post.authors)].map((_, i) => (
									<div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900" />
								))}
							</div>
							<Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
								{post.category}
							</Badge>
						</div>
					</div>
					<Separator className="bg-zinc-800" />
					<p className="text-zinc-400 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</CardContent>
				<CardFooter className="border-t border-zinc-800 p-6">
					<Button variant="outline" className="bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold py-2 px-4 border border-yellow-500 hover:border-transparent rounded-md transition-colors">
						Read Article
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

export default function Blog() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [allPosts, setAllPosts] = useState<any[]>([]);
	const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const totalPosts = 100;
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const loadMorePosts = async (direction: "top" | "bottom") => {
		if (loading || !hasMore) return;
		setLoading(true);
		// Simulating an API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		const newPosts = Array(15)
			.fill(null)
			.map((_, index) => ({
				title: `New Blog Post ${allPosts.length + index + 1}`,
				category: "Developers",
				date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
				authors: Math.floor(Math.random() * 3) + 1,
			}));

		if (direction === "top") {
			setAllPosts((prevPosts) => [...newPosts, ...prevPosts]);
			setVisiblePosts((prevVisible) => [...newPosts, ...prevVisible.slice(0, 5)]);
		} else {
			setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
			setVisiblePosts((prevVisible) => [...prevVisible.slice(-5), ...newPosts]);
		}

		setLoading(false);
		if (allPosts.length + newPosts.length >= totalPosts) {
			setHasMore(false);
		}
	};

	useEffect(() => {
		loadMorePosts("bottom");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			if (scrollTop === 0 && !loading && hasMore) {
				loadMorePosts("top");
			} else if (scrollHeight - scrollTop === clientHeight && !loading && hasMore) {
				loadMorePosts("bottom");
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [loading, hasMore]);

	return (
		<div className="min-h-screen overflow-x-hidden">
			<div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] z-10">
				{/* Left side - Title, Description, and Scroll Bar */}
				<div className="w-full lg:w-1/4 lg:max-w-xs flex flex-col justify-between p-6 lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto">
					<div className="max-w-xs mx-auto lg:mx-0">
						{/* @ts-ignore */}
						<motion.h1 className="text-3xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							Blog
						</motion.h1>
						{/* @ts-ignore */}
						<motion.p className="text-base text-gray-400 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
							Stay up to date with the latest news and insights from our team.
						</motion.p>
					</div>
					<div className="mt-6 lg:mt-0 relative">
						<div className="w-1 bg-gray-800 absolute left-0 top-0 bottom-0 rounded-full">
							<motion.div
								// @ts-ignore
								className="w-full bg-yellow-500 rounded-full"
								style={{
									height: `${((activeIndex + 1) / visiblePosts.length) * 100}%`,
									transition: "height 0.3s ease-in-out",
								}}
							/>
						</div>
						<div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800" ref={scrollContainerRef}>
							<ul className="space-y-2 pl-6">
								{visiblePosts.map((post, index) => (
									// @ts-ignore
									<motion.li key={post.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className={`transition-all duration-300 text-sm cursor-pointer ${index === activeIndex ? "text-yellow-400 translate-x-1" : "text-gray-500 hover:text-yellow-400"}`} onClick={() => setActiveIndex(index)}>
										{post.title}
									</motion.li>
								))}
							</ul>
						</div>
						{loading && (
							<div className="absolute left-0 bottom-0 transform -translate-x-1/2 -translate-y-full mt-4">
								<Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
							</div>
						)}
					</div>
				</div>

				{/* Right side - Scrolling Blog Posts */}
				<div className="w-full" ref={containerRef}>
					{visiblePosts.map((post, index) => (
						<BlogPost key={post.title} post={post} index={index} setActiveIndex={setActiveIndex} />
					))}
				</div>
			</div>

			{/* Search bar */}
			<div className="fixed top-[calc(64px+1rem)] right-4 z-10">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
					<input type="search" placeholder="Search blog" className="w-48 sm:w-64 bg-black border border-gray-700 rounded-md pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
				</div>
			</div>
		</div>
	);
}
