import type * as React from "react";
import { ArrowDown, ArrowUp, type Icon } from "@/lib/icons";

import { cn } from "@/lib/utils";

type Delta = { value: string; direction: "up" | "down" | "flat" };

type MetricVariant = "inline" | "card" | "compact";

type MetricProps = {
	"data-slot"?: string;
	label: React.ReactNode;
	value: React.ReactNode;
	delta?: Delta;
	icon?: Icon;
	hint?: React.ReactNode;
	variant?: MetricVariant;
	className?: string;
};

function DeltaPill({ delta, className }: { delta: Delta; className?: string }) {
	const tone =
		delta.direction === "up"
			? "bg-success/10 text-success"
			: delta.direction === "down"
				? "bg-destructive/10 text-destructive"
				: "bg-muted text-muted-foreground";
	const Icon = delta.direction === "up" ? ArrowUp : delta.direction === "down" ? ArrowDown : null;

	return (
		<span
			data-slot="metric-delta"
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
				tone,
				className
			)}
		>
			{Icon && <Icon aria-hidden data-slot="metric-delta-icon" className="size-3" />}
			{delta.value}
		</span>
	);
}

function Metric({
	"data-slot": dataSlot = "metric",
	label,
	value,
	delta,
	icon: Icon,
	hint,
	variant = "inline",
	className,
}: MetricProps) {
	const isCard = variant === "card";
	const isCompact = variant === "compact";

	return (
		<div
			data-slot={dataSlot}
			data-variant={variant}
			className={cn(
				"flex flex-col gap-1",
				isCard && "rounded-2xl bg-card p-5 edge",
				isCompact && "gap-0.5",
				className
			)}
		>
			{isCard ? (
				<div data-slot="metric-header" className="flex items-center justify-between">
					<span data-slot="metric-label" className="text-sm text-muted-foreground">
						{label}
					</span>
					{Icon && (
						<Icon aria-hidden data-slot="metric-icon" className="size-4 text-muted-foreground" />
					)}
				</div>
			) : (
				<span
					data-slot="metric-label"
					className={cn(
						"text-muted-foreground",
						isCompact ? "text-xs" : "text-sm",
						"flex items-center gap-1.5"
					)}
				>
					{Icon && <Icon aria-hidden data-slot="metric-icon" className="size-3.5" />}
					{label}
				</span>
			)}
			<div data-slot="metric-body" className={cn("flex items-center gap-2", isCard && "mt-2")}>
				<span
					data-slot="metric-value"
					className={cn(
						"font-mono font-medium tracking-tight tabular-nums",
						isCompact ? "text-lg" : "text-2xl"
					)}
				>
					{value}
				</span>
				{delta && <DeltaPill delta={delta} />}
			</div>
			{hint && (
				<div
					data-slot="metric-hint"
					className={cn("text-muted-foreground", isCard ? "mt-1 text-xs" : "text-xs")}
				>
					{hint}
				</div>
			)}
		</div>
	);
}

export type { Delta, MetricProps, MetricVariant };
export { DeltaPill, Metric };
