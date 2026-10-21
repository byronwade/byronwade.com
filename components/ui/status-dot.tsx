import type { StatusTone } from "@/lib/status-tone";
import { cn } from "@/lib/utils";

const dot: Record<StatusTone, string> = {
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-destructive",
	info: "bg-brand",
	neutral: "bg-muted-foreground",
};

/**
 * Atomic status indicator dot, reused by StatusPill. It never pulses: status
 * is a word with a quiet mark, and Thorbis keeps motion for work in progress.
 */
export function StatusDot({
	tone = "neutral",
	className,
}: {
	tone?: StatusTone;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn("inline-flex size-1.5 rounded-full", dot[tone], className)}
		/>
	);
}
