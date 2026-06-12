import { cn } from "@/lib/utils";

type ActivityGridSize = "compact" | "default" | "comfortable";
type ActivityGridShape = "circle" | "rounded" | "square";

/** GitHub-style activity grid. `data` = per-cell counts; intensity buckets fill --brand. */
export function ActivityGrid({
	data,
	columns = 26,
	size = "default",
	shape = "circle",
	className,
}: {
	data: number[];
	columns?: number;
	size?: ActivityGridSize;
	shape?: ActivityGridShape;
	className?: string;
}) {
	const max = Math.max(1, ...data);
	const level = (n: number) => (n <= 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));
	const fill = ["bg-muted", "bg-brand/30", "bg-brand/50", "bg-brand/75", "bg-brand"];
	const cellSize = {
		compact: "size-2",
		default: "size-2.5",
		comfortable: "size-3",
	} satisfies Record<ActivityGridSize, string>;
	const cellShape = {
		circle: "rounded-full",
		rounded: "rounded-sm",
		square: "rounded-none",
	} satisfies Record<ActivityGridShape, string>;

	return (
		<div
			data-slot="activity-grid"
			data-size={size}
			data-shape={shape}
			className={cn("grid w-fit gap-1", className)}
			style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
		>
			{data.map((n, i) => (
				<span key={i} className={cn(cellSize[size], cellShape[shape], fill[level(n)])} />
			))}
		</div>
	);
}

export type { ActivityGridShape, ActivityGridSize };
