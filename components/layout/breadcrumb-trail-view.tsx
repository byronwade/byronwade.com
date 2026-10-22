"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { BreadcrumbOverflowTrigger } from "./breadcrumb-overflow-trigger";
import { type Crumb, resolveTrail } from "./breadcrumb-trail";

const BreadcrumbOverflow = React.lazy(() =>
	import("./breadcrumb-overflow").then((module) => ({ default: module.BreadcrumbOverflow }))
);

// A long trail collapses on load; its popover graph loads on the first open.
// Loading that graph with the collapse put an eleventh script on every long
// titled xl page. Suspense keeps the same dots slot visible while the graph loads.
function CollapsedLevels({ crumbs, icon }: { crumbs: Crumb[]; icon: React.ReactNode }) {
	const [requested, setRequested] = React.useState(false);
	return requested ? (
		<React.Suspense fallback={<BreadcrumbOverflowTrigger aria-busy="true" icon={icon} />}>
			<BreadcrumbOverflow crumbs={crumbs} icon={icon} />
		</React.Suspense>
	) : (
		<BreadcrumbOverflowTrigger
			aria-expanded={false}
			aria-haspopup="dialog"
			icon={icon}
			onClick={() => setRequested(true)}
		/>
	);
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Desktop breadcrumb beside the shared header; long trails collapse to a popover. */
export function BreadcrumbTrail({
	labels,
	overflowIcon,
}: {
	labels: Record<string, string>;
	overflowIcon: React.ReactNode;
}) {
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
			// The nav's width cap owns the available space beside the header.
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
		// The trail is fixed beside the centered header; its cap keeps it clear of
		// the header's left edge at every xl width.
		<nav
			aria-label="Breadcrumb"
			className="pointer-events-auto relative z-0 hidden min-h-13 max-w-[calc(50vw-24rem)] items-center overflow-hidden rounded-lg border border-border bg-card px-1.5 text-copy-13 shadow-(--header-shadow-panel) lg:flex"
		>
			{/* DESKTOP, full trail, collapsing to root / … / current. */}
			<ol ref={rootRef} className="flex min-w-0 flex-1 items-center">
				{collapsed ? (
					<>
						<CrumbLink crumb={first} />
						<Sep />
						<li className="flex shrink-0 items-center">
							<CollapsedLevels crumbs={middle} icon={overflowIcon} />
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
			{/* Same pill target as the header's nav links: 44px, quiet until hovered. */}
			<Link
				href={crumb.href}
				aria-current={current ? "page" : undefined}
				className={cn(
					"inline-flex min-h-11 min-w-11 max-w-full items-center justify-center whitespace-nowrap rounded-full px-2.5 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
					current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
				)}
			>
				<span className={cn(truncate && "truncate")}>{crumb.label}</span>
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
