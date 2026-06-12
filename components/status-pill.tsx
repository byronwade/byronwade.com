import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

const tones: Record<StatusTone, { text: string; ring: string }> = {
	success: { text: "text-success", ring: "bg-success/10" },
	warning: { text: "text-warning", ring: "bg-warning/10" },
	danger: { text: "text-destructive", ring: "bg-destructive/10" },
	info: { text: "text-brand", ring: "bg-brand/10" },
	neutral: { text: "text-muted-foreground", ring: "bg-muted" },
};

/** Resend-style status pill: a colored dot + label in a soft chip. */
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
	const t = tones[tone];
	return (
		<span
			data-slot="status-pill"
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
				t.ring,
				t.text,
				className
			)}
		>
			<StatusDot tone={tone} pulse={pulse} />
			{children}
		</span>
	);
}
