"use client";

import Image from "next/image";
import { type Post } from "../types";
import { FeaturedPostAnimation } from "./featured-post-animation";

interface Props {
	post: Post;
}

export default function FeaturedPost({ post }: Props) {
	return (
		<FeaturedPostAnimation>
			<div className="relative h-[70vh] mb-16 rounded-xl overflow-hidden">
				<div style={{ height: "100%", width: "100%" }}>
					<Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
						<div className="absolute bottom-0 p-8">
							<h1 className="text-4xl font-bold mb-4">{post.title}</h1>
							<p className="text-lg text-neutral-200">{post.excerpt}</p>
						</div>
					</div>
				</div>
			</div>
		</FeaturedPostAnimation>
	);
}
