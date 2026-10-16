"use client";

// Thorbis Design port: site/site-shell.stylex navLink @ 46b6654.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActive, navItems } from "./nav-config";

export function NavDock() {
	const pathname = usePathname();
	return (
		<nav aria-label="Primary" className="flex flex-wrap items-center justify-center gap-1">
			{navItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					aria-current={isActive(item, pathname) ? "page" : undefined}
					className={cn(
						"inline-flex min-h-11 items-center justify-center rounded-full px-3 font-medium text-copy-13 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
						isActive(item, pathname)
							? "bg-muted text-foreground shadow-(--shadow-short)"
							: "text-muted-foreground"
					)}
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
}
