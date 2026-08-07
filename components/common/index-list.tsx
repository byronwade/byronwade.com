import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's index row. This is the one structure that genuinely repeats.
 *
 * Five files had independently written the same class string:
 *
 *   group/row hover-motion … hover:opacity-100! focus-visible:opacity-100!
 *   group-hover/list:opacity-40
 *
 * once each in the projects index, the portfolio index, the blog index, and
 * both homepage sections. That is a shared component wearing five costumes, and
 * it is exactly the drift §5.2 ("peers share a role") and §13 ("page-local
 * copies of shared components") exist to stop. It lives here now.
 *
 * The behaviour it encodes: hairline-separated rows, no card wrapper, and a
 * spotlight: hovering one row dims its peers so the row under the cursor is
 * the only thing at full strength. §13 rejects both the card grid and the
 * border-around-every-row reflex; an open row separated by a single rule is
 * what is left, and the spotlight is what gives it depth without a box.
 *
 * `IndexList` owns the rules and the group; rows never add their own margins
 * (§5.3, one owner per gap).
 */

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
	"group/row hover-motion flex flex-col gap-2 py-5 outline-none hover:opacity-100! focus-visible:opacity-100! group-hover/list:opacity-40";

/**
 * The colour transition a row's title and affordances share, so the whole row
 * responds as one object rather than as several independently hovering parts.
 */
export const indexRowAccentClass =
	"transition-colors group-hover/row:text-brand group-focus-visible/row:text-brand";
