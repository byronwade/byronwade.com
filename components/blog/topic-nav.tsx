import Link from "next/link";
import { quietPressClass } from "@/components/common/index-list";
import { sectionHeadingClass } from "@/components/layout/page";
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
		<nav
			aria-label={heading ? undefined : "Topics"}
			aria-labelledby={heading ? "post-topics" : undefined}
			className={cn(heading && "flex flex-col gap-4")}
		>
			{heading && (
				<h2 className={sectionHeadingClass} id="post-topics">
					{heading}
				</h2>
			)}
			<ul className="-mx-3 flex flex-wrap gap-1">
				{links.map(({ href, label, slug, count }) => {
					const isCurrent = slug === current;
					return (
						<li key={href}>
							<Link
								aria-current={isCurrent ? "page" : undefined}
								className={cn(
									"inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-copy-13",
									quietPressClass,
									isCurrent ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
								)}
								href={href}
								prefetch={false}
							>
								{label}
								{count !== undefined && (
									<span
										className={cn(
											"text-copy-12 tabular-nums",
											isCurrent ? "text-foreground" : "text-muted-foreground"
										)}
									>
										{count}
									</span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
