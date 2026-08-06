import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type BlogPost, getBlogPost, getBlogPosts } from "@/lib/blog";

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
}

function tagOverlapScore(current: BlogPost, candidate: BlogPost): number {
  const currentTags = new Set((current.tags ?? []).map((tag) => tag.toLowerCase()));
  if (currentTags.size === 0) return 0;
  return (candidate.tags ?? []).reduce(
    (score, tag) => score + (currentTags.has(tag.toLowerCase()) ? 1 : 0),
    0
  );
}

/**
 * Related posts — prefer shared tags, then fall back to recent writing.
 */
export async function RelatedPosts({ currentSlug, limit = 3 }: RelatedPostsProps) {
  const [current, allPosts] = await Promise.all([getBlogPost(currentSlug), getBlogPosts()]);
  if (!current) return null;

  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);
  const relatedPosts = [...otherPosts]
    .sort((a, b) => {
      const scoreDiff = tagOverlapScore(current, b) - tagOverlapScore(current, a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);

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
