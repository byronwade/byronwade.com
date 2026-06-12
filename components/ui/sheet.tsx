"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "@/lib/icons";
import { cn } from "@/lib/utils";

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
	return (
		<SheetPrimitive.Backdrop
			data-slot="sheet-overlay"
			className={cn(
				"fixed inset-0 z-50 bg-foreground/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
				className
			)}
			{...props}
		/>
	);
}

/**
 * Positioning per `side` × `variant`. `default` pins the panel flush to the
 * viewport edge; `inset` floats it with a token-radius margin (drawer look).
 * Enter/exit translate stays on the spacing scale (no arbitrary values).
 */
const sheetSide = {
	default: {
		top: "inset-x-0 top-0 h-auto rounded-b-2xl data-starting-style:-translate-y-10 data-ending-style:-translate-y-10",
		right:
			"inset-y-0 right-0 h-full w-3/4 sm:max-w-sm data-starting-style:translate-x-10 data-ending-style:translate-x-10",
		bottom:
			"inset-x-0 bottom-0 h-auto rounded-t-2xl data-starting-style:translate-y-10 data-ending-style:translate-y-10",
		left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm data-starting-style:-translate-x-10 data-ending-style:-translate-x-10",
	},
	inset: {
		top: "inset-x-2 top-2 h-auto rounded-2xl data-starting-style:-translate-y-10 data-ending-style:-translate-y-10",
		right:
			"inset-y-2 right-2 w-3/4 rounded-2xl sm:max-w-sm data-starting-style:translate-x-10 data-ending-style:translate-x-10",
		bottom:
			"inset-x-2 bottom-2 h-auto rounded-2xl data-starting-style:translate-y-10 data-ending-style:translate-y-10",
		left: "inset-y-2 left-2 w-3/4 rounded-2xl sm:max-w-sm data-starting-style:-translate-x-10 data-ending-style:-translate-x-10",
	},
} as const;

function SheetContent({
	className,
	children,
	side = "right",
	variant = "default",
	showBar = false,
	showCloseButton = true,
	...props
}: SheetPrimitive.Popup.Props & {
	side?: "top" | "right" | "bottom" | "left";
	variant?: "default" | "inset";
	showBar?: boolean;
	showCloseButton?: boolean;
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Popup
				data-slot="sheet-content"
				data-side={side}
				data-variant={variant}
				className={cn(
					"fixed z-50 flex flex-col gap-4 overflow-hidden bg-popover bg-clip-padding text-sm text-popover-foreground edge transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0",
					sheetSide[variant][side],
					className
				)}
				{...props}
			>
				{showBar && (
					<div
						data-slot="sheet-bar"
						aria-hidden
						className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-border"
					/>
				)}
				{children}
				{showCloseButton && (
					<SheetPrimitive.Close
						data-slot="sheet-close"
						render={<Button variant="ghost" className="absolute top-3 right-3" size="icon-sm" />}
					>
						<X />
						<span className="sr-only">Close</span>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Popup>
		</SheetPortal>
	);
}

/**
 * Scrollable body region for a Sheet/Drawer, between the header and footer.
 */
function SheetPanel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-panel"
			className={cn("flex-1 overflow-y-auto px-4", className)}
			{...props}
		/>
	);
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-header"
			className={cn("flex flex-col gap-0.5 p-4", className)}
			{...props}
		/>
	);
}

function SheetFooter({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & { variant?: "default" | "bare" }) {
	return (
		<div
			data-slot="sheet-footer"
			data-variant={variant}
			className={cn(
				"mt-auto flex gap-2 p-4",
				variant === "bare" ? "flex-row items-center" : "flex-col",
				className
			)}
			{...props}
		/>
	);
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn("font-heading text-base font-medium text-foreground", className)}
			{...props}
		/>
	);
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
};
