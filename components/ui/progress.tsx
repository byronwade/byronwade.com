"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressIndicatorVariants = cva("h-full transition-all", {
	variants: {
		tone: {
			default: "bg-primary",
			brand: "bg-brand",
			success: "bg-success",
			warning: "bg-warning",
			destructive: "bg-destructive",
		},
	},
	defaultVariants: {
		tone: "default",
	},
});

export type ProgressTone = NonNullable<VariantProps<typeof progressIndicatorVariants>["tone"]>;

function Progress({
	className,
	children,
	value,
	tone,
	...props
}: ProgressPrimitive.Root.Props & { tone?: ProgressTone }) {
	return (
		<ProgressPrimitive.Root
			value={value}
			data-slot="progress"
			className={cn("flex flex-wrap gap-3", className)}
			{...props}
		>
			{children}
			<ProgressTrack>
				<ProgressIndicator tone={tone} />
			</ProgressTrack>
		</ProgressPrimitive.Root>
	);
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
	return (
		<ProgressPrimitive.Track
			className={cn(
				"relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
				className
			)}
			data-slot="progress-track"
			{...props}
		/>
	);
}

function ProgressIndicator({
	className,
	tone,
	...props
}: ProgressPrimitive.Indicator.Props & VariantProps<typeof progressIndicatorVariants>) {
	return (
		<ProgressPrimitive.Indicator
			data-slot="progress-indicator"
			className={cn(progressIndicatorVariants({ tone }), className)}
			{...props}
		/>
	);
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
	return (
		<ProgressPrimitive.Label
			className={cn("text-sm font-medium", className)}
			data-slot="progress-label"
			{...props}
		/>
	);
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
	return (
		<ProgressPrimitive.Value
			className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)}
			data-slot="progress-value"
			{...props}
		/>
	);
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue };
