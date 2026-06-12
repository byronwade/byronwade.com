"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
	options,
	value,
	onValueChange,
	className,
}: {
	options: { label: string; value: T }[];
	value: T;
	onValueChange: (v: T) => void;
	className?: string;
}) {
	return (
		<div
			data-slot="segmented-control"
			role="group"
			className={cn(
				"inline-flex max-w-full flex-wrap items-center gap-0.5 rounded-full edge bg-muted/60 p-0.5",
				className
			)}
		>
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					aria-pressed={o.value === value}
					data-active={o.value === value}
					onClick={() => onValueChange(o.value)}
					className={cn(
						"rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
						"data-[active=true]:bg-card data-[active=true]:text-foreground data-[active=true]:edge"
					)}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}
