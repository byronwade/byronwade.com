import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { TagList } from "@/components/common/tag-list";
import { Section } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";
import { Clock } from "@/lib/icons";
import { safeFormatDate } from "@/lib/markdown-utils";

// Thorbis chronological rows; dates and excerpts remain server-rendered.
async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 3);

	if (recentPosts.length === 0) {
		return <p className="text-muted-foreground text-sm">No blog posts yet. Check back soon.</p>;
	}

	return (
		<IndexList>
			{recentPosts.map((post) => (
				<IndexRow key={post.slug}>
					<Link prefetch={false} className={indexRowLinkClass} href={`/blog/${post.slug}`}>
						<div className="flex items-start justify-between gap-4">
							<span className={`font-medium text-foreground ${indexRowAccentClass}`}>
								{post.title}
							</span>
							<div className="flex shrink-0 items-center gap-2.5 text-muted-foreground text-xs">
								<Badge variant="muted">
									<Clock />
									{post.readingTime} min
								</Badge>
								{post.date && (
									<time className="hidden sm:inline" dateTime={post.date}>
										{safeFormatDate(post.date, "MMM d, yyyy")}
									</time>
								)}
							</div>
						</div>
						{post.excerpt && (
							<p className="line-clamp-2 max-w-2xl text-muted-foreground text-sm leading-relaxed">
								{post.excerpt}
							</p>
						)}
						{post.tags && post.tags.length > 0 && <TagList limit={3} tags={post.tags} />}
					</Link>
				</IndexRow>
			))}
		</IndexList>
	);
}

export function HomeBlog() {
	return (
		<Section
			className=""
			description="Notes from building products and running a service business."
			link={
				<Link
					prefetch={false}
					className="shrink-0 text-muted-foreground text-sm transition-colors hover:text-brand"
					href="/blog"
				>
					All posts →
				</Link>
			}
			title="Writing"
		>
			<BlogList />
		</Section>
	);
}
