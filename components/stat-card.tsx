import type { LucideIcon } from "lucide-react";
import { type Delta, DeltaPill } from "@/components/metric-stat";
import { cn } from "@/lib/utils";

/** Compact metric tile used across Overview and Billing. */
export function StatCard({
	label,
	value,
	hint,
	delta,
	icon: Icon,
	className,
}: {
	label: string;
	value: React.ReactNode;
	hint?: React.ReactNode;
	delta?: Delta;
	icon?: LucideIcon;
	className?: string;
}) {
	return (
		<div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">{label}</span>
				{Icon && <Icon className="size-4 text-muted-foreground" />}
			</div>
			<div className="mt-2 flex items-center gap-2">
				<span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
				{delta && <DeltaPill delta={delta} />}
			</div>
			{hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
		</div>
	);
}
