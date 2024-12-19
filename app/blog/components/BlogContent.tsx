"use client";

import Image from "next/image";
import { Link } from "@/components/ui/link";
import { motion } from "framer-motion";

interface Post {
	id: string;
	title: string;
	handle: string;
	excerpt: string;
	date: string;
	image: string;
	content: string;
	author?: string;
	tags?: string[];
}

interface BlogContentProps {
	posts: Post[];
}

export default function BlogContent({ posts }: BlogContentProps) {
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
				{/* Featured Post */}
				<Link prefetch={true} href={`/blog/${posts[0].handle}`} className="block group">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative aspect-video overflow-hidden rounded-lg">
						<Image src={posts[0].image} alt={posts[0].title} fill priority className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 1280px) 100vw, 1280px" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						<div className="absolute bottom-0 left-0 right-0 p-6">
							<h2 className="text-3xl font-bold text-white mb-2">{posts[0].title}</h2>
							<p className="text-lg text-white/80">{posts[0].excerpt}</p>
							<time className="text-sm text-white/60 mt-2 block">{new Date(posts[0].date).toLocaleDateString()}</time>
						</div>
					</motion.div>
				</Link>

				{/* Grid of Posts */}
				<div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.slice(1).map((post, index) => (
						<motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
							<Link prefetch={true} href={`/blog/${post.handle}`} className="block group">
								<div className="rounded-lg overflow-hidden">
									<div className="aspect-video relative">
										<Image src={post.image} alt={post.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
									</div>
									<div className="p-6">
										<h2 className="text-xl font-bold mb-2 group-hover:text-yellow-400">{post.title}</h2>
										<p className="text-muted-foreground">{post.excerpt}</p>
										<time className="text-sm text-muted-foreground mt-2 block">{new Date(post.date).toLocaleDateString()}</time>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
