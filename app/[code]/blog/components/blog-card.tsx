import Image from "next/image";
import { Link } from "@/components/ui/link";
import { type Post } from "../types";
import { BlogCardAnimation } from "./blog-card-animation";

interface BlogCardProps {
	post: Post;
	priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
	return (
		<BlogCardAnimation>
			<article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card">
				<Link href={`/blog/${post.handle}`} className="relative h-48 overflow-hidden">
					<Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={priority} />
				</Link>

				<div className="flex flex-1 flex-col justify-between p-6">
					<div className="flex-1">
						<Link href={`/blog/${post.handle}`} className="block">
							<h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
							<p className="mt-3 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
						</Link>
					</div>

					<time className="mt-6 text-sm text-muted-foreground">
						{new Date(post.date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</time>
				</div>
			</article>
		</BlogCardAnimation>
	);
}
