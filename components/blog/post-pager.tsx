import Link from "next/link";
import { indexRowAccentClass, indexRowLinkClass } from "@/components/common/index-list";
import { sectionHeadingClass } from "@/components/layout/page";
import type { BlogPost } from "@/lib/blog";
import { ArrowLeft, ArrowRight } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * The next step through the writing chronology once a post ends: older on the
 * reading edge, newer opposite it. Rows reuse the index row so the hover fill,
 * focus ring and accent match every other list of posts.
 */
export function PostPager({ newer, older }: { newer?: BlogPost; older?: BlogPost }) {
	if (!(newer || older)) {
		return null;
	}
	return (
		<nav aria-labelledby="more-writing" className="flex w-full flex-col gap-4">
			<h2 className={sectionHeadingClass} id="more-writing">
				More writing
			</h2>
			<div className="grid w-full gap-1 sm:grid-cols-2 sm:gap-6">
				{older && (
					<Link className={indexRowLinkClass} href={`/blog/${older.slug}`} prefetch={false}>
						<span className="inline-flex items-center gap-1.5 text-copy-13 text-muted-foreground">
							<ArrowLeft aria-hidden="true" className="size-4" />
							Older post
							<span className="sr-only">:</span>
						</span>
						<span
							className={cn(
								"text-pretty font-medium text-foreground text-heading-16",
								indexRowAccentClass
							)}
						>
							{older.title}
						</span>
					</Link>
				)}
				{newer && (
					<Link
						className={cn(indexRowLinkClass, "sm:col-start-2 sm:items-end sm:text-right")}
						href={`/blog/${newer.slug}`}
						prefetch={false}
					>
						<span className="inline-flex items-center gap-1.5 text-copy-13 text-muted-foreground">
							Newer post
							<span className="sr-only">:</span>
							<ArrowRight aria-hidden="true" className="size-4" />
						</span>
						<span
							className={cn(
								"text-pretty font-medium text-foreground text-heading-16",
								indexRowAccentClass
							)}
						>
							{newer.title}
						</span>
					</Link>
				)}
			</div>
		</nav>
	);
}
