import { cn } from "@/lib/utils";

/** Split+rail archetype shell: summary column (left) + rail column (right). */
export function SplitWithRail({
	summary,
	rail,
	className,
}: {
	summary: React.ReactNode;
	rail: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			data-slot="split-with-rail"
			className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]", className)}
		>
			<div>{summary}</div>
			<div>{rail}</div>
		</div>
	);
}
