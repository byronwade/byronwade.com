import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { Flame } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface RailItem {
	glyph?: React.ReactNode; // leading icon; falls back to a StatusDot
	tone?: StatusTone;
	title: React.ReactNode;
	meta?: React.ReactNode; // trailing (right-aligned) duration/time
}

/** Split+rail archetype's right column: grouped vertical timeline with a terminal marker. */
export function TimelineRail({
	groups,
	terminalLabel = "This is where it begins",
	className,
}: {
	groups: { label: string; items: RailItem[] }[];
	terminalLabel?: string;
	className?: string;
}) {
	return (
		<div data-slot="timeline-rail" className={cn("space-y-4", className)}>
			{groups.map((g, gi) => (
				<div key={gi} className="space-y-2">
					<div className="flex justify-center">
						<span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
							{g.label}
						</span>
					</div>
					<ol className="edge overflow-hidden rounded-2xl bg-card">
						{g.items.map((it, i) => (
							<li
								key={i}
								className={cn(
									"flex items-center gap-3 px-4 py-2.5 text-sm",
									i > 0 && "border-t border-border"
								)}
							>
								<span className="grid size-5 shrink-0 place-items-center text-muted-foreground">
									{it.glyph ?? <StatusDot tone={it.tone ?? "neutral"} />}
								</span>
								<span className="min-w-0 flex-1 truncate">{it.title}</span>
								{it.meta && (
									<span className="shrink-0 font-mono text-xs text-muted-foreground">
										{it.meta}
									</span>
								)}
							</li>
						))}
					</ol>
				</div>
			))}
			<div className="flex flex-col items-center gap-1 pt-2 text-center text-muted-foreground">
				<Flame className="size-4" />
				<span className="text-xs">{terminalLabel}</span>
			</div>
		</div>
	);
}
