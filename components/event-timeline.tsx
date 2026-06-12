import { cn } from "@/lib/utils";

export interface TimelineEvent {
	title: React.ReactNode;
	description?: React.ReactNode;
	timestamp?: React.ReactNode;
	tone?: "success" | "warning" | "danger" | "info" | "neutral";
}

const dotTone: Record<NonNullable<TimelineEvent["tone"]>, string> = {
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-destructive",
	info: "bg-brand",
	neutral: "bg-muted-foreground",
};

/** Resend "Domain Events"-style vertical timeline. */
export function EventTimeline({
	events,
	className,
}: {
	events: TimelineEvent[];
	className?: string;
}) {
	return (
		<ol data-slot="event-timeline" className={cn("relative space-y-6", className)}>
			{events.map((e, i) => (
				<li key={i} className="relative flex gap-4 pl-1">
					<div className="flex flex-col items-center">
						<span
							className={cn(
								"mt-1 size-2 rounded-full ring-4 ring-background",
								dotTone[e.tone ?? "neutral"]
							)}
						/>
						{i < events.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
					</div>
					<div className="flex-1 space-y-0.5 pb-1">
						<div className="text-sm font-medium">{e.title}</div>
						{e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
						{e.timestamp && (
							<div className="pt-1 font-mono text-xs text-muted-foreground">{e.timestamp}</div>
						)}
					</div>
				</li>
			))}
		</ol>
	);
}
