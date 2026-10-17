"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { type Crumb, resolveTrail } from "./breadcrumb-trail";

const BreadcrumbOverflow = dynamic(
	() => import("./breadcrumb-overflow").then((module) => module.BreadcrumbOverflow),
	{ ssr: false }
);

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Desktop breadcrumb within the shared header; long trails collapse to a popover. */
export function BreadcrumbTrail({ labels }: { labels: Record<string, string> }) {
	const pathname = usePathname();
	const crumbs = resolveTrail(pathname, labels);
	const trailKey = crumbs.map((c) => `${c.href}|${c.label}`).join(">");

	const rootRef = React.useRef<HTMLOListElement>(null);
	const twinRef = React.useRef<HTMLOListElement>(null);
	const [collapsed, setCollapsed] = React.useState(false);

	useIsoLayoutEffect(() => {
		const root = rootRef.current;
		const twin = twinRef.current;
		if (!(root && twin)) {
			return;
		}
		const compute = () => {
			// The header grid owns the available space, including launcher width.
			setCollapsed(twin.scrollWidth > root.clientWidth && crumbs.length >= 3);
		};
		compute();
		const ro = new ResizeObserver(compute);
		ro.observe(twin);
		ro.observe(root);
		return () => ro.disconnect();
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
			className="pointer-events-auto relative z-0 hidden h-[40px] w-full max-w-full items-center overflow-hidden rounded-3xl border border-dock-border bg-dock px-4 text-[13px] shadow-float lg:flex"
		>
			{/* DESKTOP, full trail, collapsing to root / … / current. */}
			<ol ref={rootRef} className="flex min-w-0 flex-1 items-center gap-1.5">
				{collapsed ? (
					<>
						<CrumbLink crumb={first} />
						<Sep />
						<li className="flex shrink-0 items-center">
							<BreadcrumbOverflow crumbs={middle} />
						</li>
						<Sep />
						<CrumbLink crumb={last} current truncate />
					</>
				) : (
					crumbs.map((c, i) => (
						<React.Fragment key={c.href}>
							{i > 0 && <Sep />}
							<CrumbLink
								crumb={c}
								current={i === crumbs.length - 1}
								truncate={i === crumbs.length - 1}
							/>
						</React.Fragment>
					))
				)}
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

function CrumbLink({
	crumb,
	current,
	truncate,
}: {
	crumb: Crumb;
	current?: boolean;
	truncate?: boolean;
}) {
	return (
		<li className={cn("flex items-center", truncate ? "min-w-0" : "shrink-0")}>
			<Link
				href={crumb.href}
				aria-current={current ? "page" : undefined}
				className={cn(
					"min-h-6 min-w-6 whitespace-nowrap rounded-sm leading-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
					truncate && "min-w-0 truncate",
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
