"use client";

import { type ReactNode, useRef } from "react";
import { Link } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BreadcrumbOverflowTrigger } from "./breadcrumb-overflow-trigger";
import type { Crumb } from "./breadcrumb-trail";

/**
 * The hidden-ancestor menu. Loaded by the first activation of the collapsed
 * trail's trigger, so it mounts open; closing returns focus to its trigger.
 */
export function BreadcrumbOverflow({ crumbs, icon }: { crumbs: Crumb[]; icon: ReactNode }) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	return (
		<Popover defaultOpen>
			<PopoverTrigger render={<BreadcrumbOverflowTrigger icon={icon} ref={triggerRef} />} />
			<PopoverContent
				align="start"
				className="flex w-auto min-w-44 flex-col gap-0.5 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground ring-0"
				finalFocus={triggerRef}
				sideOffset={8}
			>
				{crumbs.map((crumb) => (
					<Link
						className="flex min-h-11 items-center truncate rounded-lg px-2.5 text-body text-copy-13 transition-colors hover:bg-muted hover:text-foreground"
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
