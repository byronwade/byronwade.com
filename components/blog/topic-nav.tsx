import Link from "next/link";
import type { BlogTopic } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Topics as links to static topic pages: shareable state in the URL (DESIGN.md
 * §7.3) with no client JavaScript. The writing index and topic pages lead with
 * "All writing" and mark the current topic like the header's current page, a
 * quiet fill rather than an accent. A post names its own topics under a
 * `heading` instead; its header tags stay labels, since 20px badges cannot be
 * 44px targets.
 */
export function TopicNav({
	topics,
	current,
	heading,
}: {
	topics: BlogTopic[];
	current?: string;
	/** Shown above the links and names the landmark; omits "All writing". */
	heading?: string;
}) {
	if (topics.length === 0) {
		return null;
	}

	const links = [
		...(heading
			? []
			: [{ href: "/blog", label: "All writing", slug: undefined, count: undefined }]),
		...topics.map((topic) => ({
			href: `/blog/topic/${topic.slug}`,
			label: topic.label,
			slug: topic.slug,
			count: topic.posts.length,
		})),
	];

	return (
		<nav aria-label={heading ?? "Topics"} className={cn(heading && "flex flex-col gap-1")}>
			{heading && <p className="text-copy-13 text-muted-foreground">{heading}</p>}
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
