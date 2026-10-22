import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page-level typographic structure: the pieces every route was hand-rolling.
 *
 * Before this file, seven routes each wrote their own `h1` class string and
 * their own title/lede spacing, and they had drifted: three different heading
 * sizes, four different lede measures, two different gaps. DESIGN.md §5.2 says
 * there is one type scale and peers share a role, which cannot be true while
 * every page re-declares the role from scratch.
 *
 * These are foundation, not templates. §7.1 requires each route to keep its own
 * organizing move and §13 rejects one layout repeated across unrelated pages
 * so what is shared here is the *identity* block and the *turn* in the argument,
 * never the arrangement of the content beneath them.
 */

/**
 * Route or object identity. One per page, per §5.2.
 *
 * `lede` is the single orientation passage; anything longer belongs in the body.
 * `aside` is for a control that acts on the whole page, a refresh, a print
 * and sits opposite the title rather than under the lede, so it never reads as
 * the page's primary action.
 */
export function PageHeader({
	title,
	lede,
	aside,
	className,
}: {
	title: ReactNode;
	lede?: ReactNode;
	aside?: ReactNode;
	className?: string;
}) {
	return (
		<header className={cn("flex w-full flex-col gap-3", className)}>
			<div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
				<h1 className="text-balance font-heading font-medium text-foreground text-heading-32 tracking-tight">
					{title}
				</h1>
				{aside}
			</div>
			{lede && (
				// Reading measure near 60–72 characters (§5.2).
				<p className="max-w-2xl text-pretty text-body text-copy-16 leading-relaxed">{lede}</p>
			)}
		</header>
	);
}

/**
 * Long-form document body: the legal pages.
 *
 * These two pages were the only users of `@tailwindcss/typography`, which meant
 * the site shipped two type scales: the plugin's on `/privacy` and `/terms`, and
 * its own everywhere else. §5.2 allows exactly one, and the plugin's headings,
 * measure, and link colour were all visibly different from the blog's. The
 * dependency is gone with them; blog posts and case studies already render
 * through `components/common/markdown.tsx`, which sets the site's own scale
 * explicitly, and this is that same scale for static JSX.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
	// The document body is the article; its title sits above it in PageHeader.
	return (
		<article
			className={cn(
				"flex max-w-2xl flex-col gap-5 text-body text-copy-16 leading-relaxed",
				"[&_h2]:mt-5 [&_h2]:font-heading [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-heading-20 [&_h2]:tracking-tight",
				"[&_strong]:font-medium [&_strong]:text-foreground",
				"[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
				// The link-underline recipe for links in static JSX prose; hover belongs to each link,
				// not to the article, or hovering anywhere in the text would darken every underline.
				"[&_a:hover]:decoration-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-(--thorbis-link-decoration) [&_a]:decoration-from-font [&_a]:underline-offset-2 [&_a]:transition-colors",
				className
			)}
		>
			{children}
		</article>
	);
}

/**
 * A major turn in the page's argument (§5.2 "section heading").
 *
 * `link` is the escape hatch to the full index, the pattern the homepage
 * sections were each re-implementing with slightly different colours and
 * arrow glyphs.
 */
export function Section({
	title,
	description,
	link,
	children,
	className,
}: {
	title: ReactNode;
	description?: ReactNode;
	link?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("flex w-full flex-col gap-5", className)}>
			<div className="flex items-baseline justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-balance font-heading font-medium text-heading-20 tracking-tight">
						{title}
					</h2>
					{description && <p className="text-body text-copy-14">{description}</p>}
				</div>
				{link}
			</div>
			{children}
		</section>
	);
}
