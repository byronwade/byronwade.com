import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";

async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 5);

	if (recentPosts.length === 0) {
		return <p className="text-sm text-muted-foreground">No blog posts yet. Check back soon.</p>;
	}

	return (
		<div className="surface-panel divide-y divide-border overflow-hidden">
			{recentPosts.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted"
				>
					<span className="truncate font-bold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
						{post.title}
					</span>
					<div className="flex shrink-0 items-center gap-2.5 text-xs text-muted-foreground">
						<Badge variant="muted">
							<Clock />
							{post.readingTime} min
						</Badge>
						{post.date && (
							<span className="hidden sm:inline">{format(new Date(post.date), "MMM d, yyyy")}</span>
						)}
					</div>
				</Link>
			))}
		</div>
	);
}

export function HomeBlog() {
	return (
		<section className="reveal reveal-delay-7 flex w-full flex-col gap-5">
			<div className="section-head-row">
				<div className="section-head">
					<p className="spec-label">Notes</p>
					<h2 className="type-title text-foreground">Writing</h2>
				</div>
				<Link
					href="/blog"
					className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
				>
					All posts →
				</Link>
			</div>
			<BlogList />
		</section>
	);
}
