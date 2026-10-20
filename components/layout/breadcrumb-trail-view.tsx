"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type Crumb, resolveTrail } from "./breadcrumb-trail";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Room reserved around the centered nav dock so the breadcrumb never crowds it. */
const NAV_RESERVE = 420;
const GAP = 12;

/** Desktop breadcrumb within the shared header; long trails collapse to a popover. */
export function BreadcrumbTrail({ labels }: { labels: Record<string, string> }) {
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
	const middle = crumbs.slice(1, -1);

	if (!(first && last)) {
		return null;
	}

	return (
		// Only the wide header has room for the trail beside visible primary nav.
		<nav
			aria-label="Breadcrumb"
			className="pointer-events-auto relative z-0 hidden min-h-13 max-w-[calc(50vw-24rem)] items-center overflow-hidden rounded-lg border border-border bg-card px-1.5 text-copy-13 shadow-(--header-shadow-panel) lg:flex"
		>
			{/* DESKTOP, full trail, collapsing to root / … / current. */}
			<ol
				ref={rootRef}
				style={maxW === Number.POSITIVE_INFINITY ? undefined : { maxWidth: maxW }}
				className="flex min-w-0 items-center"
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
											className="flex size-11 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
										>
											<MoreHorizontal className="size-4" />
										</button>
									}
								/>
								<PopoverContent
									align="start"
									sideOffset={8}
									className="flex w-auto min-w-44 flex-col gap-0.5 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground ring-0"
								>
									{middle.map((c) => (
										<Link
											key={c.href}
											href={c.href}
											className="flex min-h-11 items-center truncate rounded-lg px-2.5 text-body text-copy-13 transition-colors hover:bg-muted hover:text-foreground"
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

			{/* Hidden measuring twin, always the full desktop row. */}
			<ol
				ref={twinRef}
				aria-hidden="true"
				className="pointer-events-none invisible absolute flex items-center"
			>
				{crumbs.map((c, i) => (
					<React.Fragment key={c.href}>
						{i > 0 && <Sep />}
						<span className={cn("shrink-0 px-2.5", i === crumbs.length - 1 && "font-medium")}>
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
			{/* Same pill target as the header's nav links: 44px, quiet until hovered. */}
			<Link
				href={crumb.href}
				aria-current={current ? "page" : undefined}
				className={cn(
					"inline-flex min-h-11 min-w-11 items-center justify-center truncate rounded-full px-2.5 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
					current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
				)}
			>
				<span className="truncate">{crumb.label}</span>
			</Link>
		</li>
	);
}

function Sep() {
	return (
		<li aria-hidden="true" className="shrink-0 text-muted-foreground">
			/
		</li>
	);
}
