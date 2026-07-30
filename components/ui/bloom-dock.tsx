"use client";

import { ChevronsLeftRight } from "lucide-react";
import * as React from "react";
import { Bloom } from "@/components/ui/bloom";
import { BloomFlow, type BloomFlowDef } from "@/components/ui/bloom-flow";
import type { BloomPlacement } from "@/lib/bloom/placement";
import { cn } from "@/lib/utils";

/**
 * A single navigable item in the dock. Mirrors a route/tab but stays generic:
 * the dock never knows about routing, products, or cookies. The consumer wires
 * `onSelect`/`href` and the active/badge state.
 */
export interface BloomDockItem {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	onSelect?: () => void;
	href?: string;
	/** Current page → `aria-current="page"` + active fill. */
	active?: boolean;
	/** Always visible, even compact (the few primary destinations). */
	core?: boolean;
	/** Always visible AND pinned to the trailing end (e.g. Settings). */
	pinned?: boolean;
	/** Unread/count → a small brand dot (>0) when set. */
	badge?: number;
}

/**
 * The page's one contextual action. Either blooms a stepped `BloomFlow`
 * (`flow`) or runs a plain handler (`onSelect`).
 */
export interface BloomDockAction {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	/** Blooms the whole dock upward into this flow. */
	flow?: BloomFlowDef<any, any>;
	/** Or a plain action, no bloom. */
	onSelect?: () => void;
}

export interface BloomDockProps {
	items: BloomDockItem[];
	/** Where the dock sits + which way it blooms. Default "bottom". */
	placement?: BloomPlacement;
	/** Allow compact ↔ full toggling. Default true. */
	expandable?: boolean;
	/** Custom trailing slot (count + badge, env tag, …). */
	cluster?: React.ReactNode;
	/** Contextual action pill (blooms a flow or runs a handler). */
	action?: BloomDockAction;
	/** Dark dock pill (default) or light surface. */
	tone?: "dock" | "surface";
	/** Accessible name for the nav landmark. Default "Primary". */
	navLabel?: string;
	className?: string;
}

/** Visible in compact mode? Expanded shows all; otherwise only core/pinned/active. */
function isVisible(item: BloomDockItem, expanded: boolean): boolean {
	return expanded || !!item.core || !!item.pinned || !!item.active;
}

const PILL =
	"relative flex size-8 shrink-0 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30";
const PILL_IDLE = "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground";
const PILL_ACTIVE = "bg-dock-active text-dock-active-foreground";

/**
 * One nav item: `<a>` when `href`, else a `<button>`. Collapsed (compact-
 * hidden) items morph to zero width via CSS (`w-0 scale-50 opacity-0` with a
 * 300ms `cubic-bezier(.22,1,.36,1)` transition on width/opacity/transform), ported
 * from NavDock's item morph (no Motion `layout`/`AnimatePresence`).
 */
function DockItem({ item, collapsed }: { item: BloomDockItem; collapsed: boolean }) {
	const Icon = item.icon;
	const hasBadge = typeof item.badge === "number" && item.badge > 0;

	const inner = (
		<>
			<Icon className="size-4 shrink-0" />
			<span className="sr-only">{item.label}</span>
			{hasBadge ? (
				<span
					aria-hidden
					className="absolute right-1 top-1 size-2 rounded-full bg-brand ring-2 ring-dock"
				/>
			) : null}
		</>
	);

	const className = cn(PILL, item.active ? PILL_ACTIVE : PILL_IDLE);
	// stopPropagation so a click never bubbles to a parent Bloom trigger.
	const onClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		item.onSelect?.();
	};

	const content =
		item.href !== undefined ? (
			<a
				href={item.href}
				title={item.label}
				aria-label={item.label}
				aria-current={item.active ? "page" : undefined}
				onClick={onClick}
				className={className}
			>
				{inner}
			</a>
		) : (
			<button
				type="button"
				title={item.label}
				aria-label={item.label}
				aria-current={item.active ? "page" : undefined}
				onClick={onClick}
				className={className}
			>
				{inner}
			</button>
		);

	return (
		<div
			className={cn(
				"flex shrink-0 items-center overflow-hidden",
				"transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
				collapsed ? "w-0 scale-50 opacity-0" : "w-8 scale-100 opacity-100"
			)}
			aria-hidden={collapsed}
		>
			{content}
		</div>
	);
}

/**
 * Config-driven morphing navigation dock, a generalized port of NavDock.
 *
 * - Compact ↔ full: an `expanded` toggle reveals non-core/non-pinned items; each
 *   item morphs its own width/opacity/transform via CSS (no library layout).
 * - A contextual `action` either blooms the whole dock into a `BloomFlow` (via
 *   the `Bloom` primitive: the item row collapses to make room for the flow's
 *   own footer, then settles back in with `animate-in fade-in` on close) or runs
 *   a plain handler.
 * - Stays visually dark in both themes via the `--dock-*` tokens (tone="dock").
 */
export function BloomDock({
	items,
	placement = "bottom",
	expandable = true,
	cluster,
	action,
	tone = "dock",
	navLabel = "Primary",
	className,
}: BloomDockProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const mainItems = items.filter((i) => !i.pinned);
	const pinnedItems = items.filter((i) => i.pinned);
	const hasCollapsible = items.some((i) => !i.core && !i.pinned);
	const showToggle = expandable && hasCollapsible;

	const ActionIcon = action?.icon;

	// The bar = the item row + cluster + (for plain/handler actions) the action
	// pill. When bloomed into a flow, the row cross-fades out and collapses so
	// BloomFlow's own footer is the only footer.
	const bar = (
		<div
			className={cn(
				"flex items-center gap-1",
				// Collapse the row (height + opacity) while the flow is bloomed so the
				// docked bar doesn't leave a ghost footer beneath BloomFlow's footer.
				open
					? "pointer-events-none h-0 overflow-hidden opacity-0"
					: "animate-in fade-in duration-300 motion-reduce:animate-none"
			)}
		>
			<nav aria-label={navLabel} className="flex items-center gap-1">
				{mainItems.map((item) => (
					<DockItem key={item.id} item={item} collapsed={!isVisible(item, expanded)} />
				))}

				{showToggle ? (
					<button
						type="button"
						aria-expanded={expanded}
						aria-label={expanded ? "Show fewer" : "Show all"}
						title={expanded ? "Show fewer" : "Show all"}
						onClick={(e) => {
							e.stopPropagation();
							setExpanded((v) => !v);
						}}
						className={cn(PILL, expanded ? PILL_ACTIVE : PILL_IDLE)}
					>
						<ChevronsLeftRight className="size-4 shrink-0" />
						<span className="sr-only">{expanded ? "Show fewer" : "Show all"}</span>
					</button>
				) : null}

				{pinnedItems.map((item) => (
					<DockItem key={item.id} item={item} collapsed={!isVisible(item, expanded)} />
				))}
			</nav>

			{cluster ? <div className="flex shrink-0 items-center">{cluster}</div> : null}

			{/* Plain (non-flow) action: a labeled pill that runs its handler inline. */}
			{action && !action.flow && ActionIcon ? (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						action.onSelect?.();
					}}
					className={cn(
						"ml-1 flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-semibold",
						"bg-dock-active text-dock-active-foreground outline-none transition-colors",
						"hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-white/30"
					)}
				>
					<ActionIcon className="size-4 shrink-0" />
					{action.label}
				</button>
			) : null}
		</div>
	);

	// ─── Plain dock (no flow to bloom) ───
	if (!action?.flow) {
		return (
			<div
				className={cn(
					"inline-flex items-center rounded-full p-[3px]",
					tone === "dock"
						? "bg-dock text-dock-foreground shadow-float"
						: "bg-card text-foreground border border-border shadow-card",
					className
				)}
			>
				{bar}
			</div>
		);
	}

	// ─── Flow dock: wrap in a controlled Bloom; the action pill is the trigger ───
	// We render the action pill OUTSIDE the Bloom bar so it persists as the trigger
	// (clicking it opens the bloom; the item row collapses into the flow footer).
	return (
		<div className={cn("inline-flex items-end gap-2", className)}>
			<Bloom
				open={open}
				onOpenChange={setOpen}
				placement={placement}
				tone={tone}
				barPosition="edge"
				aria-label={action.label}
				bar={bar}
			>
				<BloomFlow flow={action.flow} onClose={() => setOpen(false)} />
			</Bloom>

			{ActionIcon ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					aria-haspopup="dialog"
					aria-expanded={open}
					className={cn(
						"flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-semibold shadow-float",
						"bg-brand text-brand-foreground outline-none transition-transform duration-150",
						"hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-white/30 motion-reduce:transform-none"
					)}
				>
					<ActionIcon className="size-4 shrink-0" />
					{action.label}
				</button>
			) : null}
		</div>
	);
}

export default BloomDock;
