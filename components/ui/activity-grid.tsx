import { cn } from "@/lib/utils";

/** GitHub-style activity grid. `data` = per-cell counts; intensity buckets fill --brand. */
export function ActivityGrid({
	data,
	columns = 26,
	className,
}: {
	data: number[];
	columns?: number;
	className?: string;
}) {
	const max = Math.max(1, ...data);
	const level = (n: number) => (n <= 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));
	const fill = ["bg-muted", "bg-brand/30", "bg-brand/50", "bg-brand/75", "bg-brand"];
	return (
		<div
			className={cn("grid w-fit gap-1", className)}
			style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
		>
			{data.map((n, i) => (
				<span key={i} className={cn("size-2.5 rounded-full", fill[level(n)])} />
			))}
		</div>
	);
}
