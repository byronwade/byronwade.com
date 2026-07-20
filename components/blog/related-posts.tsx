import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";

interface RelatedPostsProps {
	currentSlug: string;
	limit?: number;
}

/**
 * Related Posts Component
 * Shows related blog posts based on similar content
 */
export async function RelatedPosts({ currentSlug, limit = 3 }: RelatedPostsProps) {
	const allPosts = await getBlogPosts();

	// Filter out current post
	const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

	// For now, just show most recent posts
	// TODO: Could enhance with tag/category matching or content similarity
	const relatedPosts = otherPosts.slice(0, limit);

	if (relatedPosts.length === 0) {
		return null;
	}

	return (
		<div className="mt-12 w-full border-t border-border pt-8">
			<h3 className="mb-6 font-heading text-xl font-semibold tracking-tight text-foreground">
				Related posts
			</h3>
			<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
				{relatedPosts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="group flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-muted"
					>
						<div className="flex items-start justify-between gap-4">
							<span className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
								{post.title}
							</span>
							<div className="flex shrink-0 items-center gap-2.5 text-xs text-muted-foreground">
								<Badge variant="muted">
									<Clock />
									{post.readingTime} min
								</Badge>
								{post.date && (
									<time className="hidden sm:inline">
										{format(new Date(post.date), "MMM d, yyyy")}
									</time>
								)}
							</div>
						</div>
						{post.excerpt && (
							<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
								{post.excerpt}
							</p>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
