import type { StatusTone } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

const stroke: Record<StatusTone, string> = {
	success: "stroke-success",
	warning: "stroke-warning",
	danger: "stroke-destructive",
	info: "stroke-brand",
	neutral: "stroke-muted-foreground",
};

/** Map a 0–100 score to a tone via thresholds (default: <50 danger, <90 warning, else success). */
export function scoreTone(value: number, t: [number, number] = [50, 90]): StatusTone {
	if (value < t[0]) return "danger";
	if (value < t[1]) return "warning";
	return "success";
}

/** Circular ring gauge: big centered number + optional status word. AGENTS.md "Gauge hero". */
export function Gauge({
	value,
	label,
	tone,
	size = 160,
	thickness = 10,
	className,
}: {
	value: number;
	label?: string;
	tone?: StatusTone;
	size?: number;
	thickness?: number;
	className?: string;
}) {
	const t = tone ?? scoreTone(value);
	const r = (size - thickness) / 2;
	const c = 2 * Math.PI * r;
	const pct = Math.max(0, Math.min(100, value));
	const offset = c - (pct / 100) * c;
	return (
		<div
			className={cn("relative inline-grid place-items-center", className)}
			style={{ width: size, height: size }}
		>
			<svg width={size} height={size} className="-rotate-90" aria-hidden>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					strokeWidth={thickness}
					className="stroke-muted"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					strokeWidth={thickness}
					strokeLinecap="round"
					className={cn("transition-[stroke-dashoffset] duration-700", stroke[t])}
					strokeDasharray={c}
					strokeDashoffset={offset}
				/>
			</svg>
			<div className="absolute inset-0 grid place-items-center text-center">
				<div>
					<div className="text-3xl font-semibold tracking-tight tabular-nums">
						{Math.round(value)}
					</div>
					{label && <div className="text-xs text-muted-foreground">{label}</div>}
				</div>
			</div>
		</div>
	);
}
