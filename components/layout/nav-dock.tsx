"use client";

// Thorbis site-header + site-shell.stylex: headerBase, navLink, menu and menuLink.
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { HeaderPopover } from "@/components/layout/header-popover";
import { isActive, navItems } from "@/components/layout/nav-config";
import { publicProfiles } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavDock({
	brand,
	tools,
	icons,
}: {
	brand: ReactNode;
	tools: ReactNode;
	icons: Record<(typeof navItems)[number]["href"], ReactNode>;
}) {
	const pathname = usePathname();
	// The static 404 is prerendered at /_not-found but hydrates at the visitor's URL,
	// e.g. /blog/missing. Its segment is the same on both sides, so no section is
	// current there and the server and browser markup agree.
	const current =
		useSelectedLayoutSegment() === "_not-found"
			? undefined
			: navItems.find((item) => isActive(item, pathname));
	const previousPath = useRef(pathname);
	const [open, setOpen] = useState(false);
	const headerRef = useRef<HTMLElement>(null);
	const firstLinkRef = useRef<HTMLAnchorElement>(null);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const menuId = useId();

	useEffect(() => {
		if (previousPath.current !== pathname) {
			previousPath.current = pathname;
			setOpen(false);
		}
	}, [pathname]);
	useEffect(() => {
		const closeForSearch = () => setOpen(false);
		window.addEventListener("open-command-palette", closeForSearch);
		return () => window.removeEventListener("open-command-palette", closeForSearch);
	}, []);
	useEffect(() => {
		const header = headerRef.current;
		if (!header) {
			return;
		}
		const measure = () => {
			document.documentElement.style.scrollPaddingBlockStart = `${header.getBoundingClientRect().bottom + 16}px`;
			const menuButton = menuButtonRef.current;
			if (menuButton && getComputedStyle(menuButton).display === "none") {
				setOpen(false);
			}
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(header);
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty("scroll-padding-block-start");
		};
	}, []);

	return (
		<>
			<div
				onKeyDownCapture={(event) => {
					if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
						setOpen(false);
					}
				}}
				className="@container/site-header pointer-events-none fixed inset-x-0 top-0 z-(--z-chrome) px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3 sm:px-5 print:hidden"
			>
				<header
					ref={headerRef}
					data-site-header
					className="pointer-events-auto relative mx-auto flex min-h-13 w-full max-w-2xl @max-[16rem]/site-header:flex-wrap items-center justify-between @max-[16rem]/site-header:gap-2 gap-3 rounded-lg border border-border bg-card px-2.5 shadow-(--header-shadow-panel)"
				>
					{brand}
					<nav
						aria-label="Primary"
						className="@min-[40rem]/site-header:flex hidden items-center gap-0.5"
					>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								prefetch={false}
								aria-current={item === current ? "page" : undefined}
								className={cn(
									"relative isolate inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 font-medium text-copy-13 tracking-[-0.015em] outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
									item === current
										? "text-foreground before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-7 before:-translate-y-1/2 before:rounded-full before:border before:border-border before:bg-muted"
										: "text-muted-foreground"
								)}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="flex @max-[16rem]/site-header:contents shrink-0 items-center">
						{tools}
						<HeaderPopover
							kind="navigation"
							id={menuId}
							label="Navigate"
							closedLabel="Open menu"
							open={open}
							onOpenChange={setOpen}
							anchor={headerRef}
							initialFocus={firstLinkRef}
							finalFocus={menuButtonRef}
							trigger={
								<button
									type="button"
									ref={menuButtonRef}
									data-site-menu
									aria-expanded={open}
									aria-controls={menuId}
									aria-label={open ? "Close menu" : "Open menu"}
									className="group inline-flex @min-[40rem]/site-header:hidden size-11 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
								>
									<span
										aria-hidden="true"
										className="group-aria-expanded:before:-translate-1/2 relative isolate block size-4 group-aria-expanded:before:absolute group-aria-expanded:before:inset-1/2 group-aria-expanded:before:-z-10 group-aria-expanded:before:size-7 group-aria-expanded:before:rounded-full group-aria-expanded:before:bg-muted"
									>
										<span className="absolute inset-x-0 top-1/2 h-px -translate-y-[0.15625rem] bg-current transition-transform duration-(--motion-fast) ease-(--ease-out) group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45 motion-reduce:transition-none" />
										<span className="absolute inset-x-0 top-1/2 h-px translate-y-[0.15625rem] bg-current transition-transform duration-(--motion-fast) ease-(--ease-out) group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45 motion-reduce:transition-none" />
									</span>
								</button>
							}
						>
							<div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 font-medium font-mono text-copy-12 text-muted-foreground">
								<span>Navigate</span>
								<span>{current?.label ?? "Explore"}</span>
							</div>
							<nav aria-label="Mobile site navigation" className="grid gap-0.5">
								{navItems.map((item, index) => (
									<Link
										key={item.href}
										ref={index === 0 ? firstLinkRef : undefined}
										href={item.href}
										prefetch={false}
										onClick={() => setOpen(false)}
										aria-current={item === current ? "page" : undefined}
										className={cn(
											"grid min-h-12 grid-cols-[1.9rem_minmax(0,1fr)_auto] items-center gap-[0.65rem] rounded-lg px-2.5 py-1.5 outline-none transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2",
											item === current && "bg-muted shadow-(--shadow-short)"
										)}
									>
										<span className="text-muted-foreground">{icons[item.href]}</span>
										<span className="min-w-0">
											<span className="block font-medium text-copy-13 text-foreground">
												{item.label}
											</span>
											<span className="block text-copy-12 text-muted-foreground">
												{item.description}
											</span>
										</span>
										<span
											aria-hidden="true"
											className={cn(
												"size-1.5 rounded-full",
												item === current && "bg-brand ring-3 ring-brand/12"
											)}
										/>
									</Link>
								))}
							</nav>
							<div className="mt-2 flex flex-wrap gap-1 border-border border-t pt-2">
								{publicProfiles.map((profile) => (
									<a
										key={profile.href}
										href={profile.href}
										target="_blank"
										rel="noreferrer"
										className="inline-flex min-h-11 min-w-11 items-center rounded-lg px-2.5 text-copy-13 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									>
										{profile.name}
										<span className="sr-only"> (opens in a new tab)</span>
									</a>
								))}
							</div>
						</HeaderPopover>
					</div>
				</header>
			</div>
			{/* Match the chrome's container without containing its fixed position. */}
			<div aria-hidden="true" className="@container/site-header px-4 sm:px-5 print:hidden">
				<div className="@max-[16rem]/site-header:h-[calc(var(--control-touch)*2+var(--spacing)*2+2px+1rem+env(safe-area-inset-top))] h-[calc(4.25rem+env(safe-area-inset-top))]" />
			</div>
		</>
	);
}
