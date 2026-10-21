import { IndexList, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { type BlogPost, getBlogPost, getBlogPosts } from "@/lib/blog";
import { Clock } from "@/lib/icons";
import { safeFormatDate } from "@/lib/markdown-utils";

interface RelatedPostsProps {
	currentSlug: string;
	limit?: number;
}

function tagOverlapScore(current: BlogPost, candidate: BlogPost): number {
	const currentTags = new Set((current.tags ?? []).map((tag) => tag.toLowerCase()));
	if (currentTags.size === 0) {
		return 0;
	}
	return (candidate.tags ?? []).reduce(
		(score, tag) => score + (currentTags.has(tag.toLowerCase()) ? 1 : 0),
		0
	);
}

/**
 * Related posts: prefer shared tags, then fall back to recent writing.
 */
export async function RelatedPosts({ currentSlug, limit = 3 }: RelatedPostsProps) {
	const [current, allPosts] = await Promise.all([getBlogPost(currentSlug), getBlogPosts()]);
	if (!current) {
		return null;
	}

	const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);
	const relatedPosts = [...otherPosts]
		.sort((a, b) => {
			const scoreDiff = tagOverlapScore(current, b) - tagOverlapScore(current, a);
			if (scoreDiff !== 0) {
				return scoreDiff;
			}
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
		.slice(0, limit);

	if (relatedPosts.length === 0) {
		return null;
	}

	return (
		<section className="w-full">
			<h2 className="mb-4 font-heading font-medium text-foreground text-heading-20 tracking-tight">
				Related posts
			</h2>
			<IndexList>
				{relatedPosts.map((post) => (
					<li key={post.slug}>
						<Link className={indexRowLinkClass} href={`/blog/${post.slug}`}>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
								<span className={`min-w-0 font-medium text-foreground ${indexRowAccentClass}`}>
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
							{post.excerpt && <p className="text-body text-sm leading-relaxed">{post.excerpt}</p>}
						</Link>
					</li>
				))}
			</IndexList>
		</section>
	);
}
