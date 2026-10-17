"use client";

import { Link } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "@/lib/icons";
import type { Crumb } from "./breadcrumb-trail";

/** The hidden-ancestor menu. Loaded only after a trail actually collapses. */
export function BreadcrumbOverflow({ crumbs }: { crumbs: Crumb[] }) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<button
						aria-label="Show hidden breadcrumb levels"
						className="flex size-6 items-center justify-center rounded-md text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-ring"
						type="button"
					>
						<MoreHorizontal className="size-4" />
					</button>
				}
			/>
			<PopoverContent
				align="start"
				className="flex w-auto min-w-44 flex-col gap-0.5 rounded-xl border border-dock-border bg-dock p-1.5 text-dock-foreground ring-0"
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
