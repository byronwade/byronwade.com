import { GradientText } from "@/components/gradient-text";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getBlogPosts } from "@/lib/blog";
import { format } from "date-fns";
import { Clock } from "lucide-react";
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
				recentPosts.map((post, index) => (
					<ScrollReveal key={post.slug} direction="up" delay={index * 50}>
						<Link
							href={`/blog/${post.slug}`}
							className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-1.5 sm:py-2 gap-2 sm:gap-4"
						>
							<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text flex-1 min-w-0">
								{post.title}
							</p>
							<div className="flex items-center gap-3 shrink-0 sm:ml-4">
								<span className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
									<Clock className="size-3" />
									{post.readingTime} min
								</span>
								{post.date && (
									<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
										{format(new Date(post.date), "MMM d, yyyy")}
									</p>
								)}
							</div>
						</Link>
					</ScrollReveal>
				))
			)}
		</div>
	);
}

export function HomeBlog() {
	return (
		<ScrollReveal direction="up" delay={100}>
			<div className="animate-in animate-delay-6 w-full">
				<div className="flex flex-col gap-6 sm:gap-7 md:gap-8 w-full items-start">
					<div className="flex flex-col gap-2 sm:gap-3 w-full">
						<GradientText
							as="h2"
							variant="accent"
							className="text-2xl sm:text-3xl font-semibold tracking-tight"
						>
							Blog
						</GradientText>
					</div>
					<BlogList />
				</div>
			</div>
		</ScrollReveal>
	);
}
