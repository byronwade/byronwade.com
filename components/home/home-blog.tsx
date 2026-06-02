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
		<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
			{recentPosts.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted"
				>
					<span className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
						{post.title}
					</span>
					<div className="flex shrink-0 items-center gap-2.5 text-xs text-muted-foreground">
						<Badge variant="outline">
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
			<div className="flex items-baseline justify-between">
				<h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">Writing</h2>
				<Link
					href="/blog"
					className="text-sm text-muted-foreground transition-colors hover:text-brand"
				>
					All posts →
				</Link>
			</div>
			<BlogList />
		</section>
	);
}
