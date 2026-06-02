import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Delta = { value: string; direction: "up" | "down" | "flat" };

/** Delta pill: green for up, red for down, neutral for flat. */
export function DeltaPill({ delta, className }: { delta: Delta; className?: string }) {
	const tone =
		delta.direction === "up"
			? "bg-success/10 text-success"
			: delta.direction === "down"
				? "bg-destructive/10 text-destructive"
				: "bg-muted text-muted-foreground";
	const Icon = delta.direction === "up" ? ArrowUp : delta.direction === "down" ? ArrowDown : null;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
				tone,
				className
			)}
		>
			{Icon && <Icon className="size-3" />}
			{delta.value}
		</span>
	);
}

/** Inline metric: small label, large value, optional delta pill. AGENTS.md "Metric rows". */
export function MetricStat({
	label,
	value,
	delta,
	icon: Icon,
	className,
}: {
	label: string;
	value: React.ReactNode;
	delta?: Delta;
	icon?: LucideIcon;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
				{Icon && <Icon className="size-3.5" />}
				{label}
			</span>
			<div className="flex items-center gap-2">
				<span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
				{delta && <DeltaPill delta={delta} />}
			</div>
		</div>
	);
}
