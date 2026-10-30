import type { IconComponent } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** The 16px heading role for an empty or failed state. Not a page title. */
export const failureTitleClass = "font-medium text-foreground text-heading-16";

/** The 14px body role under that title. The measure stays short of the page. */
export const failureCopyClass = "max-w-md text-pretty text-body text-copy-14";

/**
 * Empty or failed collection (DESIGN.md §8): say what is missing or what
 * failed, then the next move. Start-aligned on the page edge like the rest of
 * the site, with no dashed box and no icon tile (DESIGN.md §13).
 */
export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: {
	icon?: IconComponent;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col items-start gap-2 py-4", className)}>
			{Icon && <Icon aria-hidden="true" className="mb-1 size-6 text-muted-foreground" />}
			<h2 className={failureTitleClass}>{title}</h2>
			{description && <p className={failureCopyClass}>{description}</p>}
			{action && <div className="pt-3">{action}</div>}
		</div>
	);
}
