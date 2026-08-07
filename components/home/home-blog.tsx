import { format } from "date-fns";
import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { TagList } from "@/components/common/tag-list";
import { Section } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";
import { Clock } from "@/lib/icons";

/**
 * Homepage "writing". The second turn.
 *
 * Same index primitives as selected work, deliberately different row content:
 * §7.1 gives the blog chronology-with-the-lede-visible, so a row carries the
 * excerpt and its date rather than outcomes and metrics. Sharing the structure
 * while differing in substance is the point. The alternative was two hand-made
 * copies of the same markup that had already drifted apart.
 */
async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 4);

	if (recentPosts.length === 0) {
		return <p className="text-muted-foreground text-sm">No blog posts yet. Check back soon.</p>;
	}

	return (
		<IndexList>
			{recentPosts.map((post) => (
				<IndexRow key={post.slug}>
					<Link className={indexRowLinkClass} href={`/blog/${post.slug}`}>
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
									<span className="hidden sm:inline">
										{format(new Date(post.date), "MMM d, yyyy")}
									</span>
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
			className="max-w-3xl"
			description="Notes from building products and running a service business."
			link={
				<Link
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
