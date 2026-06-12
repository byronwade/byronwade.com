import type * as React from "react";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

type VerificationTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface VerificationStep {
	tone: VerificationTone;
	label: string;
	count?: number;
	description?: string;
}

export interface VerificationProgressProps extends React.ComponentProps<"div"> {
	steps: VerificationStep[];
}

// Soft tonal node treatment — mirrors StatusPill (`bg-<tone>/10` + `text-<tone>`)
// so the tracker reads as native to the design system. `info` resolves to
// `--brand` like every other accent (never a literal blue). Colour lives in the
// node; labels stay foreground/muted so a multi-tone track never turns rainbow.
const toneClasses: Record<VerificationTone, { node: string; label: string }> = {
	success: { node: "bg-success/10 text-success ring-success/25", label: "text-foreground" },
	warning: { node: "bg-warning/10 text-warning ring-warning/30", label: "text-foreground" },
	danger: {
		node: "bg-destructive/10 text-destructive ring-destructive/25",
		label: "text-foreground",
	},
	info: { node: "bg-brand/10 text-brand ring-brand/25", label: "text-foreground" },
	neutral: { node: "bg-muted text-muted-foreground ring-border", label: "text-muted-foreground" },
};

function VerificationProgress({ steps, className, ...props }: VerificationProgressProps) {
	return (
		// Responsive: stacks vertically (node + label per row) on narrow screens,
		// and lays out as a horizontal track with connecting rails from `sm` up.
		<div
			data-slot="verification-progress"
			className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0", className)}
			{...props}
		>
			{steps.map((step, i) => {
				const colors = toneClasses[step.tone];
				const isLast = i === steps.length - 1;
				return (
					<div
						key={i}
						className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:items-center sm:gap-2.5"
					>
						{/* Node + rail row. Capsule rails only show on the horizontal (sm+)
                layout; the outer ends are transparent so every node stays
                centred over its label and the rail reads continuous. */}
						<div className="flex items-center sm:w-full">
							<span
								className={cn(
									"hidden h-0.5 flex-1 rounded-full sm:block",
									i > 0 ? "bg-border" : "bg-transparent"
								)}
							/>
							{/* Step node — soft tonal disc */}
							<span
								className={cn(
									"relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ring-1 ring-inset",
									colors.node
								)}
							>
								{step.count !== undefined ? (
									step.count > 99 ? (
										"99+"
									) : (
										step.count
									)
								) : step.tone === "success" ? (
									<Check className="size-4" strokeWidth={2.75} aria-hidden />
								) : (
									<span className="size-2 rounded-full bg-current" />
								)}
							</span>
							<span
								className={cn(
									"hidden h-0.5 flex-1 rounded-full sm:block",
									!isLast ? "bg-border" : "bg-transparent"
								)}
							/>
						</div>

						{/* Label — left-aligned beside the node when stacked, centred under
                it on the horizontal track. */}
						<div className="flex min-w-0 flex-col gap-0.5 text-left sm:items-center sm:px-3 sm:text-center">
							<span className={cn("text-xs font-medium leading-tight", colors.label)}>
								{step.label}
							</span>
							{step.description && (
								<span className="text-[11px] leading-tight text-muted-foreground sm:max-w-[120px]">
									{step.description}
								</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export { VerificationProgress };
