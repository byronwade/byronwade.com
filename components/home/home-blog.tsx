import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { TagList } from "@/components/common/tag-list";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";

async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 4);

	if (recentPosts.length === 0) {
		return <p className="text-muted-foreground text-sm">No blog posts yet. Check back soon.</p>;
	}

	return (
		<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
			{recentPosts.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-muted"
				>
					<div className="flex items-start justify-between gap-4">
						<span className="font-medium text-foreground transition-colors group-hover:text-brand">
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
					{post.tags && post.tags.length > 0 && <TagList tags={post.tags} limit={3} />}
				</Link>
			))}
		</div>
	);
}

export function HomeBlog() {
	return (
		<section className="reveal reveal-delay-7 flex w-full flex-col gap-5">
			<div className="flex items-baseline justify-between">
				<div className="flex flex-col gap-1">
					<h2 className="font-heading font-semibold text-xl tracking-tight sm:text-2xl">Writing</h2>
					<p className="text-muted-foreground text-sm">
						Notes from building products and running a service business.
					</p>
				</div>
				<Link
					href="/blog"
					className="text-muted-foreground text-sm transition-colors hover:text-brand"
				>
					All posts →
				</Link>
			</div>
			<BlogList />
		</section>
	);
}
