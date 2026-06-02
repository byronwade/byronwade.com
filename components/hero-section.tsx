import { cn } from "@/lib/utils";

/** Hero-chart / Map-hero archetype: optional metric/header row above an edge-to-edge child.
 *  Requires an ancestor with `overflow-x-clip` for the full-bleed child not to cause scroll. */
export function HeroSection({
	header,
	children,
	className,
}: {
	header?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("space-y-4", className)}>
			{header && <div className="flex flex-wrap items-end justify-between gap-4">{header}</div>}
			<div className="full-bleed">{children}</div>
		</section>
	);
}
