// Thorbis Design port: ui/badge.tsx @ 46b6654; status composes the canonical badge.
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import type { StatusTone } from "@/lib/status-tone";
import { cn } from "@/lib/utils";

const variants = {
	success: "success",
	warning: "warning",
	danger: "destructive",
	info: "info",
	neutral: "muted",
} as const;

export function StatusPill({
	tone = "neutral",
	children,
	pulse = false,
	className,
}: {
	tone?: StatusTone;
	children: React.ReactNode;
	pulse?: boolean;
	className?: string;
}) {
	return (
		<Badge variant={variants[tone]} className={cn("gap-1.5", className)}>
			<StatusDot tone={tone} pulse={pulse} />
			{children}
		</Badge>
	);
}
