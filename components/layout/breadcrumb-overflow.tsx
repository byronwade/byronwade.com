"use client";

import { useRef } from "react";
import { Link } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BreadcrumbOverflowTrigger } from "./breadcrumb-overflow-trigger";
import type { Crumb } from "./breadcrumb-trail";

/**
 * The hidden-ancestor menu. Loaded by the first activation of the collapsed
 * trail's trigger, so it mounts open; closing returns focus to its trigger.
 */
export function BreadcrumbOverflow({ crumbs }: { crumbs: Crumb[] }) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	return (
		<Popover defaultOpen>
			<PopoverTrigger render={<BreadcrumbOverflowTrigger ref={triggerRef} />} />
			<PopoverContent
				align="start"
				className="flex w-auto min-w-44 flex-col gap-0.5 rounded-xl border border-dock-border bg-dock p-1.5 text-dock-foreground ring-0"
				finalFocus={triggerRef}
				sideOffset={8}
			>
				{crumbs.map((crumb) => (
					<Link
						className="truncate rounded-lg px-2.5 py-1.5 text-[13px] text-dock-active-foreground/85 transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
						href={crumb.href}
						key={crumb.href}
					>
						{crumb.label}
					</Link>
				))}
			</PopoverContent>
		</Popover>
	);
}
