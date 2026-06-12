"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import * as React from "react";

import { cn } from "@/lib/utils";

type SliderSize = "sm" | "default" | "lg";

// Track thickness + thumb diameter scale together so the thumb always reads as
// a control sitting on the rail. Token surfaces are unchanged across sizes.
const trackHeight: Record<SliderSize, string> = {
	sm: "h-1",
	default: "h-1.5",
	lg: "h-2",
};

const thumbSize: Record<SliderSize, string> = {
	sm: "size-3",
	default: "size-4",
	lg: "size-5",
};

function Slider({
	className,
	value,
	defaultValue,
	min = 0,
	max = 100,
	size = "default",
	...props
}: SliderPrimitive.Root.Props & { size?: SliderSize }) {
	// One thumb per value; an array value/defaultValue makes it a range slider.
	const thumbCount = React.useMemo(() => {
		if (Array.isArray(value)) return value.length;
		if (Array.isArray(defaultValue)) return defaultValue.length;
		return 1;
	}, [value, defaultValue]);

	// The Root's aria-label labels the group; each thumb renders its own range
	// input that needs a label too (axe flags an unlabelled input otherwise).
	const ariaLabel = (props as Record<string, unknown>)["aria-label"] as string | undefined;
	const thumbLabel = (i: number) =>
		ariaLabel ? (thumbCount > 1 ? `${ariaLabel} ${i + 1}` : ariaLabel) : undefined;

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			value={value}
			defaultValue={defaultValue}
			min={min}
			max={max}
			className={cn(
				"relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
				className
			)}
			{...props}
		>
			<SliderPrimitive.Control data-slot="slider-control" className="flex w-full items-center py-2">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className={cn("relative w-full grow rounded-full bg-muted", trackHeight[size])}
				>
					<SliderPrimitive.Indicator
						data-slot="slider-indicator"
						className="rounded-full bg-primary"
					/>
					{Array.from({ length: thumbCount }, (_, i) => (
						<SliderPrimitive.Thumb
							key={i}
							index={i}
							aria-label={thumbLabel(i)}
							data-slot="slider-thumb"
							className={cn(
								"rounded-full border border-primary bg-background outline-none transition-[box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 data-[disabled]:pointer-events-none",
								thumbSize[size]
							)}
						/>
					))}
				</SliderPrimitive.Track>
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
