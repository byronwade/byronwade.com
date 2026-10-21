import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Thorbis list adaptation: quiet rows, stable contrast, explicit keyboard focus.
export function IndexList({
	children,
	className,
	as: Tag = "ul",
}: {
	children: ReactNode;
	className?: string;
	as?: "ul" | "ol";
}) {
	return <Tag className={cn("flex flex-col", className)}>{children}</Tag>;
}

/**
 * The class an index row's link or button must carry to participate in the
 * spotlight. Exported as a string rather than a wrapper component because the
 * element varies: `next/link`, a plain anchor, or a button. Keep the caller's
 * native interactive element as the row's full target.
 */
export const indexRowLinkClass =
	"group/row flex flex-col items-stretch gap-2 rounded-sm py-5 outline-none transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4";

/**
 * The colour transition a row's title and affordances share, so the whole row
 * responds as one object rather than as several independently hovering parts.
 */
export const indexRowAccentClass =
	"transition-colors group-hover/row:text-brand group-focus-visible/row:text-brand";
