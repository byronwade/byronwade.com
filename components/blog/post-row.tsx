import Link from "next/link";
import { IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common/index-list";
import { TagList } from "@/components/common/tag-list";
import type { BlogPost } from "@/lib/blog";
import { safeFormatDate } from "@/lib/markdown-utils";

/**
 * One post in any writing index: the home preview, /blog, and related posts.
 *
 * The date and reading time lead in a mono column so a list of posts reads as
 * a chronology (DESIGN.md §7.1, /blog). `excerpt="full"` keeps the whole lede
 * where scanning is the reading; previews clamp it to two lines.
 */
export function PostRow({
	post,
	dateFormat = "MMM d, yyyy",
	excerpt = "clamp",
	tagLimit = 0,
}: {
	post: BlogPost;
	dateFormat?: string;
	excerpt?: "clamp" | "full";
	/** How many tags to show under the excerpt; none by default. */
	tagLimit?: number;
}) {
	return (
		<IndexRow>
			<Link className={indexRowLinkClass} href={`/blog/${post.slug}`} prefetch={false}>
				<div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row">
					<p className="flex gap-3 font-mono text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:flex-col sm:gap-0.5 sm:pt-1">
						{post.date && <time dateTime={post.date}>{safeFormatDate(post.date, dateFormat)}</time>}
						<span>{post.readingTime} min read</span>
					</p>
					<div className="flex min-w-0 flex-col gap-1">
						<span className={`font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}>
							{post.title}
						</span>
						{post.excerpt && (
							<p
								className={`text-body text-copy-14 leading-relaxed ${excerpt === "clamp" ? "line-clamp-2" : ""}`}
							>
								{post.excerpt}
							</p>
						)}
						{tagLimit > 0 && post.tags && post.tags.length > 0 && (
							<TagList className="pt-1" limit={tagLimit} tags={post.tags} />
						)}
					</div>
				</div>
			</Link>
		</IndexRow>
	);
}
