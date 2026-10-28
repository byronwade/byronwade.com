import Link from "next/link";
import { IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common/index-list";
import { TagList } from "@/components/common/tag-list";
import type { BlogPost } from "@/lib/blog";
import { safeFormatDate } from "@/lib/markdown-utils";

/**
 * One post in any writing index: home, /blog, topics, and related posts.
 *
 * The date and reading time lead in a tabular column so a list of posts reads as
 * a chronology (DESIGN.md §7.1, /blog). The whole excerpt stays readable; no
 * index clamps it.
 */
export function PostRow({
	post,
	dateFormat = "MMM d, yyyy",
	tagLimit = 0,
	headingAs: Heading = "h3",
}: {
	post: BlogPost;
	dateFormat?: string;
	/** How many tags to show under the excerpt; none by default. */
	tagLimit?: number;
	/** Use h2 directly below a page title; h3 below a section or year heading. */
	headingAs?: "h2" | "h3";
}) {
	return (
		<IndexRow>
			<Link className={indexRowLinkClass} href={`/blog/${post.slug}`} prefetch={false}>
				<div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row">
					<p className="flex gap-3 text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:flex-col sm:gap-0.5 sm:pt-1">
						{post.date && <time dateTime={post.date}>{safeFormatDate(post.date, dateFormat)}</time>}
						<span>{post.readingTime} min read</span>
					</p>
					<div className="flex min-w-0 flex-col gap-1">
						<Heading
							className={`text-pretty font-medium text-foreground text-heading-16 ${indexRowAccentClass}`}
						>
							{post.title}
						</Heading>
						{post.excerpt && <p className="text-pretty text-body text-copy-14">{post.excerpt}</p>}
						{tagLimit > 0 && post.tags && post.tags.length > 0 && (
							<TagList className="pt-1" limit={tagLimit} tags={post.tags} />
						)}
					</div>
				</div>
			</Link>
		</IndexRow>
	);
}
