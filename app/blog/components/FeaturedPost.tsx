"use client";

import Image from "next/image";
import Link from "next/link";
import { type Post } from "../types";

interface Props {
	post: Post;
}

export default function FeaturedPost({ post }: Props) {
	return (
		<div className="relative h-[70vh] rounded-xl overflow-hidden">
			<Link href={`/blog/${post.handle}`} className="group block h-full">
				<Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority sizes="100vw" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
					<div className="absolute bottom-0 p-8">
						<h1 className="text-4xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{post.title}</h1>
						<p className="text-lg text-gray-200">{post.excerpt}</p>
					</div>
				</div>
			</Link>
		</div>
	);
}
