import type * as React from "react";

import { cn } from "@/lib/utils";

function Card({
	className,
	size = "default",
	...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				"group/card flex flex-col gap-4 overflow-hidden rounded-2xl bg-card py-5 text-sm text-card-foreground edge has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
				className
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-2xl px-5 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
				className
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				"font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
				className
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-5 group-data-[size=sm]/card:px-3", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center rounded-b-2xl border-t bg-muted/40 px-5 py-4 group-data-[size=sm]/card:p-3",
				className
			)}
			{...props}
		/>
	);
}

/**
 * Body region for a Card used as a form/content panel. Like CardContent but
 * `flex-1`, so it fills the remaining height inside a CardFrame's inset card.
 */
function CardPanel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-panel"
			className={cn("flex-1 px-5 group-data-[size=sm]/card:px-3", className)}
			{...props}
		/>
	);
}

/**
 * Framed-card wrapper. A muted, edge-lit outer frame that insets a child Card
 * into a `bg-card` panel (its radius squared to `rounded-xl`), so frame header /
 * footer / action sit on the muted surround, outside the panel.
 */
function CardFrame({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame"
			className={cn(
				"group/card-frame flex flex-col gap-2 rounded-2xl bg-muted/40 p-2 text-card-foreground edge *:data-[slot=card]:rounded-xl",
				className
			)}
			{...props}
		/>
	);
}

function CardFrameHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame-header"
			className={cn(
				"grid auto-rows-min items-start gap-1 px-5 py-1 has-data-[slot=card-frame-action]:grid-cols-[1fr_auto]",
				className
			)}
			{...props}
		/>
	);
}

function CardFrameTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame-title"
			className={cn("font-heading text-sm leading-snug font-medium", className)}
			{...props}
		/>
	);
}

function CardFrameDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardFrameAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-center justify-self-end", className)}
			{...props}
		/>
	);
}

function CardFrameFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-frame-footer"
			className={cn("flex items-center px-5 py-1", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardFrame,
	CardFrameAction,
	CardFrameDescription,
	CardFrameFooter,
	CardFrameHeader,
	CardFrameTitle,
	CardHeader,
	CardPanel,
	CardTitle,
};
