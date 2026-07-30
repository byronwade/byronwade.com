"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export function NavigationMenu({
	className,
	children,
	viewport = true,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
	viewport?: boolean;
}) {
	return (
		<NavigationMenuPrimitive.Root
			data-viewport={viewport}
			className={cn(
				"group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center",
				className
			)}
			{...props}
		>
			{children}
			{viewport ? <NavigationMenuViewport /> : null}
		</NavigationMenuPrimitive.Root>
	);
}

export function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
			{...props}
		/>
	);
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const navigationMenuTriggerStyle = cva(
	"group inline-flex h-10 w-max items-center justify-center rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
);

export function NavigationMenuTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
	return (
		<NavigationMenuPrimitive.Trigger
			className={cn(navigationMenuTriggerStyle(), "group", className)}
			{...props}
		>
			{children}
			<ChevronDown
				className="relative top-px ml-1 size-3.5 transition duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}

export function NavigationMenuContent({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			className={cn(
				"top-0 left-0 w-full",
				"data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-4 data-[motion=from-start]:slide-in-from-left-4 data-[motion=to-end]:slide-out-to-right-4 data-[motion=to-start]:slide-out-to-left-4",
				className
			)}
			{...props}
		/>
	);
}

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

/**
 * Full-bleed panel under the sticky header — elevated surface, not a dark drawer.
 */
function NavigationMenuViewport({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	return (
		<div className="absolute inset-x-0 top-full z-50 flex justify-center">
			<NavigationMenuPrimitive.Viewport
				className={cn(
					"surface-float relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-b-2xl transition-[height] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2",
					className
				)}
				{...props}
			/>
		</div>
	);
}

export { NavigationMenuViewport };
