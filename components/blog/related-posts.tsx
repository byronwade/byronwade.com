import { IndexList } from "@/components/common/index-list";
import { sectionHeadingClass } from "@/components/layout/page";
import { type BlogPost, getBlogPost, getBlogPosts } from "@/lib/blog";
import { PostRow } from "./post-row";

interface RelatedPostsProps {
	currentSlug: string;
	/** Slugs already offered elsewhere on the page, such as the older/newer pager. */
	exclude?: readonly string[];
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
export async function RelatedPosts({ currentSlug, limit = 3, exclude = [] }: RelatedPostsProps) {
	const [current, allPosts] = await Promise.all([getBlogPost(currentSlug), getBlogPosts()]);
	if (!current) {
		return null;
	}

	const otherPosts = allPosts.filter(
		(post) => post.slug !== currentSlug && !exclude.includes(post.slug)
	);
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
		<section aria-labelledby="related-posts" className="flex w-full flex-col gap-4">
			<h2 className={sectionHeadingClass} id="related-posts">
				Related posts
			</h2>
			{/* The same row as the writing index: shared tags first, then recency. */}
			<IndexList>
				{relatedPosts.map((post) => (
					<PostRow key={post.slug} post={post} />
				))}
			</IndexList>
		</section>
	);
}
