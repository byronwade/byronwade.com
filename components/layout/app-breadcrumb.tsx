"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, MoreHorizontal } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type Crumb, resolveTrail } from "./breadcrumb-trail";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Room reserved around the centered nav dock so the breadcrumb never crowds it. */
const NAV_RESERVE = 420;
const GAP = 12;

/**
 * Breadcrumb pill: a matched-sibling overlay in the top-left header group, sharing
 * the corner-pill material with the launcher (40px, dark `--dock`, `rounded-3xl`).
 * Ported from the byronwade-ui chrome. Renders the full trail responsively
 * collapsing to `root / … / current` on desktop and `‹ Current` on mobile, with
 * the collapse budget computed from stable inputs (viewport width, pinned left
 * edge, the nav reserve).
 */
export function AppBreadcrumb({ labels }: { labels: Record<string, string> }) {
	const pathname = usePathname();
	const crumbs = resolveTrail(pathname, labels);
	const trailKey = crumbs.map((c) => `${c.href}|${c.label}`).join(">");

	const rootRef = React.useRef<HTMLOListElement>(null);
	const twinRef = React.useRef<HTMLOListElement>(null);
	const [{ collapsed, maxW }, setFit] = React.useState<{ collapsed: boolean; maxW: number }>({
		collapsed: false,
		maxW: Number.POSITIVE_INFINITY,
	});

	useIsoLayoutEffect(() => {
		const root = rootRef.current;
		const twin = twinRef.current;
		if (!(root && twin)) {
			return;
		}
		const compute = () => {
			const W = window.innerWidth;
			const left = root.getBoundingClientRect().left;
			const budget = Math.max(0, W / 2 - NAV_RESERVE / 2 - GAP - left);
			const full = twin.scrollWidth;
			setFit({ collapsed: full > budget && crumbs.length >= 3, maxW: budget });
		};
		compute();
		const ro = new ResizeObserver(compute);
		ro.observe(twin);
		window.addEventListener("resize", compute);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", compute);
		};
	}, [trailKey, crumbs.length]);

	if (crumbs.length <= 1) {
		return null;
	}

	const first = crumbs[0];
	const last = crumbs.at(-1);
	const parent = crumbs.at(-2);
	const middle = crumbs.slice(1, -1);

	if (!(first && last)) {
		return null;
	}

	return (
		// This pill shares the top row with two other fixed elements: the launcher
		// to its left and the centre-anchored nav dock. It was overlapping both of
		// them. The toolbar painted over it at 390px, and a long page title ran
		// straight under the nav dock at 1440px. The ceiling is now the distance from the
		// launcher to the dock's left edge (half the viewport, less half the dock
		// and the launcher), and it only renders where that distance is usable.
		// Nothing is lost below `lg`: the nav dock already shows the section.
		<nav
			aria-label="Breadcrumb"
			className="pointer-events-auto relative z-0 hidden h-[40px] max-w-[calc(50vw-24rem)] items-center overflow-hidden rounded-3xl border border-dock-border bg-dock px-4 text-[13px] shadow-float lg:flex"
		>
			{/* DESKTOP, full trail, collapsing to root / … / current. */}
			<ol
				ref={rootRef}
				style={maxW === Number.POSITIVE_INFINITY ? undefined : { maxWidth: maxW }}
				className="hidden min-w-0 items-center gap-1.5 sm:flex"
			>
				{collapsed ? (
					<>
						<CrumbLink crumb={first} />
						<Sep />
						<li className="flex shrink-0 items-center">
							<Popover>
								<PopoverTrigger
									render={
										<button
											type="button"
											aria-label="Show hidden breadcrumb levels"
											className="flex size-6 items-center justify-center rounded-md text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-ring"
										>
											<MoreHorizontal className="size-4" />
										</button>
									}
								/>
								<PopoverContent
									align="start"
									sideOffset={8}
									className="flex w-auto min-w-44 flex-col gap-0.5 rounded-xl border border-dock-border bg-dock p-1.5 text-dock-foreground ring-0"
								>
									{middle.map((c) => (
										<Link
											key={c.href}
											href={c.href}
											className="truncate rounded-lg px-2.5 py-1.5 text-[13px] text-dock-active-foreground/85 transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
										>
											{c.label}
										</Link>
									))}
								</PopoverContent>
							</Popover>
						</li>
						<Sep />
						<CrumbLink crumb={last} current />
					</>
				) : (
					crumbs.map((c, i) => (
						<React.Fragment key={c.href}>
							{i > 0 && <Sep />}
							<CrumbLink crumb={c} current={i === crumbs.length - 1} />
						</React.Fragment>
					))
				)}
			</ol>

			{/* MOBILE, current only, with a back-chevron to the parent level. */}
			<ol className="flex min-w-0 items-center gap-1 sm:hidden">
				{parent && (
					<li className="flex shrink-0 items-center">
						<Link
							href={parent.href}
							aria-label={`Back to ${parent.label}`}
							className="-ml-1 flex size-6 items-center justify-center rounded-md text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
						>
							<ChevronLeft className="size-4" />
						</Link>
					</li>
				)}
				<li className="min-w-0">
					<span className="truncate font-semibold text-dock-active-foreground">{last.label}</span>
				</li>
			</ol>

			{/* Hidden measuring twin, always the full desktop row. */}
			<ol
				ref={twinRef}
				aria-hidden="true"
				className="pointer-events-none invisible absolute flex items-center gap-1.5"
			>
				{crumbs.map((c, i) => (
					<React.Fragment key={c.href}>
						{i > 0 && <Sep />}
						<span className={cn("shrink-0", i === crumbs.length - 1 ? "font-semibold" : "")}>
							{c.label}
						</span>
					</React.Fragment>
				))}
			</ol>
		</nav>
	);
}

function CrumbLink({ crumb, current }: { crumb: Crumb; current?: boolean }) {
	return (
		<li className={cn("flex items-center", current ? "min-w-0" : "shrink-0")}>
			<Link
				href={crumb.href}
				aria-current={current ? "page" : undefined}
				className={cn(
					"truncate rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
					current
						? "font-semibold text-dock-active-foreground"
						: "text-dock-foreground hover:text-dock-active-foreground"
				)}
			>
				{crumb.label}
			</Link>
		</li>
	);
}

function Sep() {
	return (
		<li aria-hidden="true" className="shrink-0 text-dock-foreground/50">
			/
		</li>
	);
}
