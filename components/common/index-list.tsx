import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Thorbis list adaptation: quiet rows, stable contrast, explicit keyboard focus.
export function IndexList({
	children,
	className,
	/** A rule above the first row. Off when a header already supplies one. */
	topRule = true,
	as: Tag = "ul",
}: {
	children: ReactNode;
	className?: string;
	topRule?: boolean;
	as?: "ul" | "ol" | "div";
}) {
	return (
		<Tag className={cn("group/list flex flex-col", topRule && "border-border border-t", className)}>
			{children}
		</Tag>
	);
}

/**
 * One row. Renders the hairline and the spotlight state; the caller supplies
 * the interactive element as `children` so a row can be an internal `Link`, an
 * external anchor, or static content without this component knowing which.
 */
export function IndexRow({
	children,
	className,
	as: Tag = "li",
}: {
	children: ReactNode;
	className?: string;
	as?: "li" | "div";
}) {
	return <Tag className={cn("border-border border-b last:border-b-0", className)}>{children}</Tag>;
}

/**
 * The class an index row's link or button must carry to participate in the
 * spotlight. Exported as a string rather than a wrapper component because the
 * element varies: `next/link`, a plain anchor, a button, and wrapping each
 * variant would put a div between the rule and the target.
 */
export const indexRowLinkClass =
	"group/row flex flex-col items-stretch gap-2 rounded-sm py-5 outline-none transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4";

/**
 * The colour transition a row's title and affordances share, so the whole row
 * responds as one object rather than as several independently hovering parts.
 */
export const indexRowAccentClass =
	"transition-colors group-hover/row:text-brand group-focus-visible/row:text-brand";
