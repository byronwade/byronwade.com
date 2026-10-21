import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Section } from "@/components/layout/page";
import { getBlogPosts } from "@/lib/blog";
import { safeFormatDate } from "@/lib/markdown-utils";

/**
 * Thorbis chronological rows; dates and excerpts remain server-rendered.
 * The date leads in a tabular column, as on /blog, so the two indexes read as
 * one pattern. Reading time sits in that column instead of a badge rack.
 */
async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 3);

	if (recentPosts.length === 0) {
		return (
			<p className="text-copy-14 text-muted-foreground">
				Nothing published yet. The first post is in progress.
			</p>
		);
	}

	return (
		<IndexList>
			{recentPosts.map((post) => (
				<IndexRow key={post.slug}>
					<Link prefetch={false} className={indexRowLinkClass} href={`/blog/${post.slug}`}>
						<div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row">
							<p className="flex gap-3 text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:flex-col sm:gap-0.5 sm:pt-1">
								{post.date && (
									<time dateTime={post.date}>{safeFormatDate(post.date, "MMM d, yyyy")}</time>
								)}
								<span>{post.readingTime} min read</span>
							</p>
							<div className="flex min-w-0 flex-col gap-1">
								<span className={`font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}>
									{post.title}
								</span>
								{post.excerpt && (
									<p className="line-clamp-2 text-body text-copy-14 leading-relaxed">
										{post.excerpt}
									</p>
								)}
							</div>
						</div>
					</Link>
				</IndexRow>
			))}
		</IndexList>
	);
}

export function HomeBlog() {
	return (
		<Section
			description="Notes from building products and running a service business."
			link={
				<Link prefetch={false} className="link-action shrink-0" href="/blog">
					All writing
				</Link>
			}
			title="Writing"
		>
			<BlogList />
		</Section>
	);
}
