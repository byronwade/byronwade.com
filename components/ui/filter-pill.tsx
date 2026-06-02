import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Pill+chevron filter/range trigger (AGENTS.md Controls). Pass as `render` to a Select/Menu trigger,
 *  or use standalone with onClick. */
export const FilterPill = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & { icon?: React.ReactNode }
>(function FilterPill({ className, children, icon, ...props }, ref) {
	return (
		<button
			ref={ref}
			type="button"
			data-slot="filter-pill"
			className={cn(
				"inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm font-medium shadow-card transition-colors hover:bg-muted aria-expanded:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 outline-none",
				className
			)}
			{...props}
		>
			{icon}
			{children}
			<ChevronsUpDown className="size-3.5 text-muted-foreground" />
		</button>
	);
});
