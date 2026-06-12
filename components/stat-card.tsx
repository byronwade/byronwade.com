import type { ReactNode } from "react";
import { type Delta, Metric } from "@/components/ui/metric";
import type { Icon } from "@/lib/icons";

function StatCard({
	label,
	value,
	hint,
	delta,
	icon,
	className,
}: {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	delta?: Delta;
	icon?: Icon;
	className?: string;
}) {
	return (
		<Metric
			data-slot="stat-card"
			className={className}
			delta={delta}
			hint={hint}
			icon={icon}
			label={label}
			value={value}
			variant="card"
		/>
	);
}

export { StatCard };
