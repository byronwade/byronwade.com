import type { IconComponent } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Friendly empty state with an icon, copy, and an optional action. */
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
		<div
			className={cn("flex flex-col items-center justify-center px-4 py-12 text-center", className)}
		>
			{Icon && <Icon aria-hidden="true" className="mb-4 size-6 text-muted-foreground" />}
			<h2 className="font-medium text-heading-16">{title}</h2>
			{description && (
				<p className="mt-2 max-w-sm text-body text-sm leading-relaxed">{description}</p>
			)}
			{action && <div className="mt-5">{action}</div>}
		</div>
	);
}
