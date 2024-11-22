"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type Post } from "../types";

interface Props {
	post: Post;
}

export default function FeaturedPost({ post }: Props) {
	return (
		<div className="relative h-[70vh] mb-16 rounded-xl overflow-hidden">
			<motion.div style={{ height: "100%", width: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<Image src={post.image} alt={post.title} fill className="object-cover" priority />
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
					<div className="absolute bottom-0 p-8">
						<h1 className="text-4xl font-bold mb-4">{post.title}</h1>
						<p className="text-lg text-gray-200">{post.excerpt}</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
