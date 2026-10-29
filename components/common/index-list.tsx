import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Thorbis list adaptation: quiet rows, stable contrast, explicit keyboard focus.
 *
 * Rows are separated by space, not rules. Thorbis D-017: a border is a use case
 * (a field, a commit, a photo), never a line between items; the hover fill is
 * what shows a row's extent when it matters.
 */
export function IndexList({
	children,
	className,
	as: Tag = "ul",
}: {
	children: ReactNode;
	className?: string;
	as?: "ul" | "ol" | "div";
}) {
	return <Tag className={cn("flex flex-col gap-1", className)}>{children}</Tag>;
}

/** One row. The caller supplies the interactive element as `children`. */
export function IndexRow({
	children,
	className,
	as: Tag = "li",
}: {
	children: ReactNode;
	className?: string;
	as?: "li" | "div";
}) {
	return <Tag className={className}>{children}</Tag>;
}

/**
 * The class an index row's link or button must carry. Exported as a string
 * rather than a wrapper component because the element varies: `next/link`, a
 * plain anchor, or a button. The negative inline margin lets the hover fill
 * extend past the text edge while the text stays on the page measure.
 */
export const indexRowLinkClass =
	"group/row -mx-3 flex flex-col items-stretch gap-1.5 wrap-anywhere rounded-lg px-3 py-4 outline-none transition-colors hover:bg-muted active:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2";

/**
 * The colour transition a row's title and affordances share, so the whole row
 * responds as one object rather than as several independently hovering parts.
 */
export const indexRowAccentClass =
	"transition-colors group-hover/row:text-brand group-focus-visible/row:text-brand";
