import type { IconComponent } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
			<h2 className="font-medium text-foreground text-heading-16">{title}</h2>
			{description && <p className="max-w-md text-body text-copy-14">{description}</p>}
			{action && <div className="pt-3">{action}</div>}
		</div>
	);
}
