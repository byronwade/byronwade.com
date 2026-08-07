"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isActive, type NavItem, navItems } from "./nav-config";

const ITEM_IDLE = "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground";
const ITEM_ACTIVE = "bg-dock-active text-dock-active-foreground";

function NavDockItem({ item, pathname }: { item: NavItem; pathname: string }) {
	const active = isActive(item, pathname);
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Link
						href={item.href}
						aria-label={item.label}
						aria-current={active ? "page" : undefined}
						className={cn(
							"relative flex h-8 items-center gap-1.5 rounded-full px-2.5 font-medium text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
							active ? ITEM_ACTIVE : ITEM_IDLE
						)}
					/>
				}
			>
				<item.icon className="size-4 shrink-0" strokeWidth={2} />
				<span className="hidden sm:inline">{item.label}</span>
			</TooltipTrigger>
			<TooltipContent className="sm:hidden" sideOffset={10}>
				{item.label}
			</TooltipContent>
		</Tooltip>
	);
}

/**
 * Primary navigation dock: a `--dock`-toned capsule of destinations, floating
 * centered (top on sm+, bottom on phones). Utility actions (search, GitHub, theme,
 * donate) live in the far-right DockToolbar; this dock is navigation only.
 */
export function NavDock() {
	const pathname = usePathname();
	return (
		<TooltipProvider delay={350}>
			<div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:top-3 sm:bottom-auto print:hidden">
				<nav
					aria-label="Primary"
					className="pointer-events-auto flex items-center gap-1 rounded-3xl border border-dock-border bg-dock p-[3px] text-dock-foreground shadow-float"
				>
					{navItems.map((item) => (
						<NavDockItem key={item.href} item={item} pathname={pathname} />
					))}
				</nav>
			</div>
		</TooltipProvider>
	);
}
