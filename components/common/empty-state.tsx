import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Friendly empty state with an icon, copy, and an optional action. */
export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center",
				className
			)}
		>
			{Icon && (
				<div className="mb-4 flex size-11 items-center justify-center rounded-2xl border bg-muted/40">
					<Icon className="size-5 text-muted-foreground" />
				</div>
			)}
			<h3 className="font-semibold text-sm">{title}</h3>
			{description && <p className="mt-1 max-w-sm text-muted-foreground text-sm">{description}</p>}
			{action && <div className="mt-5">{action}</div>}
		</div>
	);
}
