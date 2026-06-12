import * as React from "react";
import { CaretUpDown } from "@/lib/icons";
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
				"inline-flex h-8 items-center gap-1.5 rounded-full bg-background px-3 text-sm font-medium edge transition-colors hover:bg-muted aria-expanded:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 outline-none",
				className
			)}
			{...props}
		>
			{icon}
			{children}
			<CaretUpDown className="size-3.5 text-muted-foreground" />
		</button>
	);
});
