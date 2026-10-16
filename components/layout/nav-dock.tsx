"use client";

// Thorbis Design port: site/site-shell.stylex navLink @ 46b6654.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { isActive, navItems } from "./nav-config";

export function NavDock() {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);
	useEffect(() => {
		const header = navRef.current?.closest("header");
		if (!header) {
			return;
		}
		// Thorbis scripts/chrome header clearance: focus and anchored content must
		// clear the actual wrapped header, including text resizing.
		const measure = () => {
			const inset = Number.parseFloat(getComputedStyle(header).top) || 0;
			document.documentElement.style.setProperty(
				"--site-header-clearance",
				`${header.offsetHeight + inset * 2}px`
			);
		};
		const observer = new ResizeObserver(measure);
		observer.observe(header);
		measure();
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty("--site-header-clearance");
		};
	}, []);
	return (
		<nav
			ref={navRef}
			aria-label="Primary"
			className="flex flex-wrap items-center justify-center gap-1"
		>
			{navItems.map((item) => (
				<Link
					prefetch={false}
					key={item.href}
					href={item.href}
					aria-current={isActive(item, pathname) ? "page" : undefined}
					className={cn(
						"inline-flex min-h-11 items-center justify-center rounded-full px-2.5 font-medium text-copy-13 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
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
