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
/**
 * Neutral hover and press fill shared by index rows and topic links.
 * The press fill matches the hover fill: the row is one object, and accent
 * ink is not used for the label (it fails AA on this fill).
 */
export const quietPressClass =
	"transition-colors hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground";

export const indexRowLinkClass = `group/row -mx-3 flex flex-col items-stretch gap-1.5 wrap-anywhere rounded-lg px-3 py-4 outline-none ${quietPressClass} focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2`;

/**
 * The colour transition a row's title and affordances share, so the whole row
 * responds as one object rather than as several independently hovering parts.
 * Foreground ink retains AA on the dark hover fill; accent ink did not. The
 * focus outline still carries the accent without reducing text contrast.
 */
export const indexRowAccentClass =
	"transition-colors group-hover/row:text-foreground group-focus-visible/row:text-foreground";
