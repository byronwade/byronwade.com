import { getBlogPosts } from "@/lib/blog";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

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
		<ScrollReveal direction="up" delay={100}>
			<div className="w-full mt-12 pt-8 border-t border-[var(--border)]">
				<h3 className="text-xl font-semibold text-[var(--foreground)] mb-6">
					Related Posts
				</h3>
				<div className="flex flex-col gap-4">
					{relatedPosts.map((post, index) => (
						<ScrollReveal key={post.slug} direction="up" delay={index * 50}>
							<Link
								href={`/blog/${post.slug}`}
								className="group flex flex-col sm:flex-row sm:items-center sm:justify-between w-full hover:opacity-70 transition-all duration-200 focus-ring touch-target py-2 gap-2 sm:gap-4 rounded-lg hover:bg-[var(--muted)]/30 px-2 -mx-2"
							>
								<div className="flex flex-col gap-1 flex-1 min-w-0">
									<p className="font-medium text-[var(--foreground)] text-base underline-animate mobile-text">
										{post.title}
									</p>
									{post.excerpt && (
										<p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
											{post.excerpt}
										</p>
									)}
								</div>
								<div className="flex items-center gap-3 shrink-0 sm:ml-4">
									<span className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
										<Clock className="size-3" />
										{post.readingTime} min
									</span>
									{post.date && (
										<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
											{format(new Date(post.date), "MMM d, yyyy")}
										</p>
									)}
								</div>
							</Link>
						</ScrollReveal>
					))}
				</div>
			</div>
		</ScrollReveal>
	);
}
