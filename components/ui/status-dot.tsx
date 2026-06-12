import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const dot: Record<StatusTone, string> = {
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-destructive",
	info: "bg-brand",
	neutral: "bg-muted-foreground",
};

const sizes = { sm: "size-1.5", md: "size-2", lg: "size-2.5" } as const;

/** Atomic status indicator dot. Reused by StatusPill, tables, metric rows, timelines. */
export function StatusDot({
	tone = "neutral",
	size = "sm",
	pulse = false,
	className,
}: {
	tone?: StatusTone;
	size?: keyof typeof sizes;
	pulse?: boolean;
	className?: string;
}) {
	return (
		<span data-slot="status-dot" className={cn("relative inline-flex", sizes[size], className)}>
			{pulse && (
				<span
					className={cn(
						"absolute inline-flex size-full animate-ping rounded-full opacity-75",
						dot[tone]
					)}
				/>
			)}
			<span className={cn("relative inline-flex size-full rounded-full", dot[tone])} />
		</span>
	);
}
