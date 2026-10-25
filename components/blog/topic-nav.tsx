import Link from "next/link";
import type { BlogTopic } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * The writing index's topics, as links to static topic pages: shareable state
 * in the URL (DESIGN.md §7.3) with no client JavaScript. The current topic is
 * marked like the header's current page, a quiet fill rather than an accent.
 */
export function TopicNav({ topics, current }: { topics: BlogTopic[]; current?: string }) {
	if (topics.length === 0) {
		return null;
	}

	const links = [
		{ href: "/blog", label: "All writing", slug: undefined, count: undefined },
		...topics.map((topic) => ({
			href: `/blog/topic/${topic.slug}`,
			label: topic.label,
			slug: topic.slug,
			count: topic.posts.length,
		})),
	];

	return (
		<nav aria-label="Topics">
			<ul className="-mx-3 flex flex-wrap gap-x-1 gap-y-0.5">
				{links.map(({ href, label, slug, count }) => {
					const isCurrent = slug === current;
					return (
						<li key={href}>
							<Link
								aria-current={isCurrent ? "page" : undefined}
								className={cn(
									"inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-copy-13 transition-colors",
									isCurrent
										? "bg-muted font-medium text-foreground"
										: "text-muted-foreground hover:text-foreground"
								)}
								href={href}
								prefetch={false}
							>
								{label}
								{count !== undefined && (
									<span className="text-copy-12 text-muted-foreground tabular-nums">{count}</span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
