import { getBlogPosts } from "@/lib/blog";
import { format } from "date-fns";
import Link from "next/link";

async function BlogList() {
	const posts = await getBlogPosts();

	// Limit to most recent posts (e.g., 3-5)
	const recentPosts = posts.slice(0, 5);

	return (
		<div className="flex flex-col gap-3 sm:gap-4">
			{recentPosts.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No blog posts yet. Check back soon!
				</p>
			) : (
				recentPosts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="flex items-center justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1"
					>
						<p className="font-medium text-[var(--foreground)] text-base underline-animate mobile-text">
							{post.title}
						</p>
						{post.date && (
							<p className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors whitespace-nowrap ml-2">
								{format(new Date(post.date), "MMM d, yyyy")}
							</p>
						)}
					</Link>
				))
			)}
		</div>
	);
}

export function HomeBlog() {
	return (
		<div className="animate-in animate-delay-6 w-full">
			<BlogList />
		</div>
	);
}
