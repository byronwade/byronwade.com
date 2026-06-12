import type { ReactNode } from "react";
import { type Delta, DeltaPill, Metric } from "@/components/ui/metric";
import type { Icon } from "@/lib/icons";

function MetricStat({
	label,
	value,
	delta,
	icon,
	className,
}: {
	label: string;
	value: ReactNode;
	delta?: Delta;
	icon?: Icon;
	className?: string;
}) {
	return (
		<Metric
			data-slot="metric-stat"
			className={className}
			delta={delta}
			icon={icon}
			label={label}
			value={value}
		/>
	);
}

export type { Delta };
export { DeltaPill, MetricStat };
