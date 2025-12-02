import { getBlogPosts } from "@/lib/blog";
import { format } from "date-fns";
import Link from "next/link";

async function BlogList() {
	const posts = await getBlogPosts();

	// Limit to most recent posts (e.g., 3-5)
	const recentPosts = posts.slice(0, 5);

	return (
		<div className="flex flex-col gap-1 sm:gap-1.5">
			{recentPosts.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No blog posts yet. Check back soon!
				</p>
			) : (
				recentPosts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-1.5 sm:py-2 gap-2 sm:gap-4"
					>
						<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text flex-1 min-w-0">
							{post.title}
						</p>
						{post.date && (
							<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors shrink-0 sm:ml-2">
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
			<div className="flex flex-col gap-6 sm:gap-7 md:gap-8 w-full">
				<div className="flex flex-col gap-2 sm:gap-3">
					<h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] tracking-tight">
						Blog
					</h2>
				</div>
				<BlogList />
			</div>
		</div>
	);
}
