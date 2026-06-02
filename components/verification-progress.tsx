import * as React from "react";
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

const toneClasses: Record<VerificationTone, { dot: string; label: string; count: string }> = {
	success: {
		dot: "bg-success",
		label: "text-success",
		count: "bg-success/10 text-success",
	},
	warning: {
		dot: "bg-warning",
		label: "text-warning",
		count: "bg-warning/10 text-warning",
	},
	danger: {
		dot: "bg-destructive",
		label: "text-destructive",
		count: "bg-destructive/10 text-destructive",
	},
	info: {
		dot: "bg-blue-500",
		label: "text-blue-600 dark:text-blue-400",
		count: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	},
	neutral: {
		dot: "bg-muted-foreground",
		label: "text-muted-foreground",
		count: "bg-muted text-muted-foreground",
	},
};

function VerificationProgress({ steps, className, ...props }: VerificationProgressProps) {
	return (
		<div
			data-slot="verification-progress"
			className={cn("flex items-start gap-0", className)}
			{...props}
		>
			{steps.map((step, i) => {
				const colors = toneClasses[step.tone];
				const isLast = i === steps.length - 1;
				return (
					<React.Fragment key={i}>
						<div className="flex min-w-0 flex-1 flex-col items-center gap-2">
							{/* Circle + connector row */}
							<div className="relative flex w-full items-center">
								{/* Left connector */}
								{i > 0 && <span className="h-px flex-1 bg-border" />}
								{/* Step circle */}
								<span
									className={cn(
										"relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm",
										colors.dot
									)}
								>
									{step.count !== undefined ? (
										<span className="text-[10px] font-bold leading-none text-white tabular-nums">
											{step.count > 99 ? "99+" : step.count}
										</span>
									) : (
										<span className="size-2 rounded-full bg-white/80" />
									)}
								</span>
								{/* Right connector */}
								{!isLast && <span className="h-px flex-1 bg-border" />}
							</div>

							{/* Label */}
							<div className="flex flex-col items-center gap-0.5 text-center">
								<span className={cn("text-xs font-semibold leading-tight", colors.label)}>
									{step.label}
								</span>
								{step.description && (
									<span className="max-w-[120px] text-[11px] leading-tight text-muted-foreground">
										{step.description}
									</span>
								)}
							</div>
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
}

export { VerificationProgress };
