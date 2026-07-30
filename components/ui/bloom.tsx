"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
	type BloomAlign,
	type BloomPlacement,
	type BloomSide,
	flipIfNeeded,
	type GrowAxis,
	type ResolvedPlacement,
	resolvePlacement,
} from "@/lib/bloom/placement";
import { cn } from "@/lib/utils";

// Re-export placement types for consumers.
export type { BloomAlign, BloomPlacement, BloomSide, GrowAxis, ResolvedPlacement };

export interface BloomProps {
	/** Collapsed pill content; persists as footer/header when open. */
	bar: React.ReactNode;
	/** The bloomed body. */
	children: React.ReactNode;
	/** Controlled open state. */
	open?: boolean;
	/** Uncontrolled initial open state. */
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Default "bottom". */
	placement?: BloomPlacement;
	/** Viewport-fixed (default) or element-anchored. */
	anchor?: "viewport" | React.RefObject<HTMLElement | null>;
	/** Panel cross-size in px the bloom snaps to. Default 430. */
	size?: number;
	/** Default "surface". */
	tone?: "dock" | "surface";
	/** px from viewport edge that triggers auto-flip. Default 12. */
	collisionPadding?: number;
	/** px; below → full-width bottom sheet. Default 640. */
	mobileBreakpoint?: number;
	/** Dialog semantics. Default true. */
	modal?: boolean;
	/** Bar becomes footer (edge, default) or header (leading) when open. */
	barPosition?: "edge" | "leading";
	className?: string;
	"aria-label"?: string;
	/** Bumps element-anchor reposition (e.g. React Flow viewport transform). */
	anchorRevision?: unknown;
	/** Portals element-anchored UI to `document.body` (required inside CSS `transform` ancestors). */
	portal?: boolean;
}

// useLayoutEffect warns on the server even inside a "use client" component.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** The shared morph easing + duration, ported verbatim from NavDock/DockSheet. */
const EASE = "cubic-bezier(.22,1,.36,1)";
const MORPH_MS = 400;

/** Deterministic-on-server media query hook. Initial state is always `false`
 * (desktop) so SSR and the first client render agree; flips inside an effect. */
function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = React.useState(false);
	React.useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mql = window.matchMedia(query);
		const onChange = () => setMatches(mql.matches);
		onChange();
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, [query]);
	return matches;
}

function usePrefersReducedMotion(): boolean {
	const [reduce, setReduce] = React.useState(false);
	React.useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduce(mql.matches);
		onChange();
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return reduce;
}

function isElementAnchor(
	anchor: BloomProps["anchor"]
): anchor is React.RefObject<HTMLElement | null> {
	return anchor != null && anchor !== "viewport";
}

/** Pin the bloom to a DOM element via `position: fixed` (viewport coords). */
function useElementAnchorStyle(
	anchor: React.RefObject<HTMLElement | null> | null,
	side: BloomSide,
	align: BloomAlign,
	track: boolean,
	gap = 10,
	anchorRevision?: unknown
): React.CSSProperties | null {
	const [style, setStyle] = React.useState<React.CSSProperties | null>(null);

	useIsoLayoutEffect(() => {
		if (!anchor) {
			setStyle(null);
			return;
		}
		const el = anchor.current;
		if (!el) {
			setStyle(null);
			return;
		}

		const update = () => {
			const node = anchor.current;
			if (!node) return;
			const rect = node.getBoundingClientRect();
			const base: React.CSSProperties = {
				position: "fixed",
				zIndex: 50,
				pointerEvents: "none",
			};

			if (side === "bottom") {
				const left =
					align === "start" ? rect.left : align === "end" ? rect.right : rect.left + rect.width / 2;
				setStyle({
					...base,
					top: rect.bottom + gap,
					left,
					transform:
						align === "center"
							? "translateX(-50%)"
							: align === "end"
								? "translateX(-100%)"
								: undefined,
				});
				return;
			}

			if (side === "top") {
				const left =
					align === "start" ? rect.left : align === "end" ? rect.right : rect.left + rect.width / 2;
				setStyle({
					...base,
					top: rect.top - gap,
					left,
					transform:
						align === "center"
							? "translate(-50%, -100%)"
							: align === "end"
								? "translate(-100%, -100%)"
								: "translateY(-100%)",
				});
				return;
			}

			if (side === "right") {
				setStyle({
					...base,
					left: rect.right + gap,
					top: rect.top + rect.height / 2,
					transform: "translateY(-50%)",
				});
				return;
			}

			setStyle({
				...base,
				left: rect.left - gap,
				top: rect.top + rect.height / 2,
				transform: "translate(-100%, -50%)",
			});
		};

		update();
		if (!track) return;

		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);

		let raf = 0;
		const tick = () => {
			update();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			ro.disconnect();
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
			cancelAnimationFrame(raf);
		};
	}, [anchor, side, align, track, gap, anchorRevision]);

	return style;
}

function BloomBodyPortal({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	if (!mounted || typeof document === "undefined") return null;
	return createPortal(children, document.body);
}

const FOCUSABLE =
	'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement | null): HTMLElement[] {
	if (!root) return [];
	return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
		(el) => el.offsetParent !== null || el === document.activeElement
	);
}

function toneClasses(tone: "dock" | "surface"): string {
	return tone === "dock"
		? "bg-dock text-dock-foreground shadow-float border border-white/5"
		: "bg-card text-foreground border border-border shadow-card";
}

/**
 * The morphing edge-anchored bloom primitive, a generalized port of NavDock's
 * proven CSS technique (NOT a library-animated popover).
 *
 * Two orthogonal morphs, exactly as the reference splits them:
 *  - The **outer morph container** animates inline `width` (measured collapsed
 *    bar width → `size`) + `border-radius` (`rounded-3xl` → `rounded-2xl`) with a
 *    400ms `cubic-bezier(.22,1,.36,1)` transition; reversed on close via
 *    `transitionend`.
 *  - An **inner body div** wrapping `children` animates `height` (0 →
 *    `scrollHeight`, measured by a ResizeObserver) over the same curve.
 *
 * The bar is ALWAYS mounted inside the container and pinned to the placement
 * edge (footer for bottom/right, header for top/left), so opening never reflows
 * page content: the body simply grows away from the anchored edge.
 *
 * Positioning modes:
 *  - `anchor="viewport"` (default): an outer `fixed z-50 pointer-events-none`
 *    container positioned by the resolved placement edge. Dock-style.
 *  - element/inline anchor: a `relative inline-flex` wrapper reserves the bar's
 *    space; the morph container is `absolute`, pinned to the bar's placement edge
 *    and grows away from it, so the bar never moves.
 *
 * `children` unmount when closed; the close animation keeps them mounted for the
 * 400ms collapse, then unmounts (the `mounted` flag, distinct from `open`).
 */
export function Bloom({
	bar,
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	placement = "bottom",
	anchor = "viewport",
	size = 430,
	tone = "surface",
	collisionPadding = 12,
	mobileBreakpoint = 640,
	modal = true,
	barPosition = "edge",
	className,
	"aria-label": ariaLabel,
	anchorRevision,
	portal = false,
}: BloomProps) {
	const reduce = usePrefersReducedMotion();
	const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint - 1}px)`);

	const isControlled = controlledOpen !== undefined;
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const open = isControlled ? controlledOpen : internalOpen;

	const setOpen = React.useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange]
	);

	// `mounted` keeps the body in the tree through the close animation; it lags
	// `open` by the morph duration on close (mirrors DockSheet's requestClose).
	const [mounted, setMounted] = React.useState(open);
	React.useEffect(() => {
		if (open) {
			setMounted(true);
			return;
		}
		if (!mounted) return;
		// Closing: keep mounted for the collapse, then unmount.
		const t = window.setTimeout(() => setMounted(false), reduce ? 0 : MORPH_MS);
		return () => window.clearTimeout(t);
	}, [open, mounted, reduce]);

	const morphRef = React.useRef<HTMLDivElement>(null);
	const barRef = React.useRef<HTMLDivElement>(null);
	const bodyRef = React.useRef<HTMLDivElement>(null);
	const collapsedSizeRef = React.useRef<number | null>(null);

	// Resolve effective placement (with auto-flip) when open on desktop.
	const [resolved, setResolved] = React.useState<ResolvedPlacement>(() =>
		resolvePlacement(placement)
	);

	useIsoLayoutEffect(() => {
		if (!open || isMobile) {
			setResolved(resolvePlacement(placement));
			return;
		}
		if (typeof window === "undefined") return;

		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Anchor rect: the bar/element we grow from.
		let rect: DOMRect | null = null;
		if (anchor !== "viewport" && anchor.current) {
			rect = anchor.current.getBoundingClientRect();
		} else if (barRef.current) {
			rect = barRef.current.getBoundingClientRect();
		}

		const space = rect
			? {
					top: rect.top,
					bottom: vh - rect.bottom,
					left: rect.left,
					right: vw - rect.right,
				}
			: { top: vh, bottom: vh, left: vw, right: vw };

		const flipped = flipIfNeeded(placement, space, size, collisionPadding);
		setResolved(resolvePlacement(flipped));
	}, [open, isMobile, placement, anchor, size, collisionPadding]);

	const axis = resolved.axis; // "y" → grow via height; "x" → grow via width.
	const barAsHeader = barPosition === "leading" ? true : resolved.barOrder === "before";

	const elementAnchor = isElementAnchor(anchor) ? anchor : null;
	const elementAnchorStyle = useElementAnchorStyle(
		elementAnchor,
		resolved.side,
		resolved.align,
		Boolean(elementAnchor && (open || mounted)),
		10,
		anchorRevision
	);

	const shouldPortalElementAnchor = portal && Boolean(elementAnchor);

	// ─── Cross-axis (width for y-axis, height for x-axis) morph on the container ───
	// Mirrors NavDock: measure the collapsed bar's cross-size, then transition to
	// `size` on open and back on close (reversed via transitionend).
	useIsoLayoutEffect(() => {
		const el = morphRef.current;
		if (!el || isMobile) return;
		const prop = axis === "y" ? "width" : "height";
		const T = `${prop} ${MORPH_MS}ms ${EASE}, border-radius ${MORPH_MS}ms ${EASE}`;
		const read = () => (axis === "y" ? el.offsetWidth : el.offsetHeight);
		const setSize = (v: string) => {
			if (axis === "y") el.style.width = v;
			else el.style.height = v;
		};
		const styleVal = () => (axis === "y" ? el.style.width : el.style.height);

		if (open) {
			const collapsed = collapsedSizeRef.current ?? read();
			if (reduce) {
				el.style.transition = "none";
				setSize(`${size}px`);
				return;
			}
			el.style.transition = "none";
			setSize(`${collapsed}px`);
			void el.offsetWidth; // reflow
			el.style.transition = T;
			setSize(`${size}px`);
		} else if (styleVal()) {
			const collapsed = collapsedSizeRef.current;
			const restore = () => {
				el.style.transition = "none";
				setSize("");
				void el.offsetWidth;
				el.style.transition = "";
			};
			if (reduce || collapsed == null) {
				restore();
				return;
			}
			el.style.transition = T;
			setSize(`${collapsed}px`);
			const onEnd = (e: TransitionEvent) => {
				if (e.propertyName !== prop) return;
				restore();
				el.removeEventListener("transitionend", onEnd);
			};
			el.addEventListener("transitionend", onEnd);
			return () => el.removeEventListener("transitionend", onEnd);
		}
	}, [open, axis, size, reduce, isMobile]);

	// Remember the collapsed cross-size while closed so the morph can start from it.
	useIsoLayoutEffect(() => {
		const el = morphRef.current;
		if (el && !open && !el.style.width && !el.style.height) {
			collapsedSizeRef.current = axis === "y" ? el.offsetWidth : el.offsetHeight;
		}
	});

	// ─── Growth-axis (height for y-axis, width for x-axis) bloom on the body ───
	// The body starts at 0; a ResizeObserver measures its natural scroll size and
	// we transition the wrapper to it. On close we drive it back to 0.
	const [bodySize, setBodySize] = React.useState(0);

	useIsoLayoutEffect(() => {
		if (!open || !mounted) return;
		const el = bodyRef.current;
		if (!el) return;
		const measure = () => setBodySize(axis === "y" ? el.scrollHeight : el.scrollWidth);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, [open, mounted, axis]);

	// Collapse the body when closing.
	React.useEffect(() => {
		if (!open) setBodySize(0);
	}, [open]);

	// ─── Dialog: focus management ───
	const prevFocusRef = React.useRef<HTMLElement | null>(null);

	React.useEffect(() => {
		if (!open) return;
		if (typeof document === "undefined") return;

		prevFocusRef.current = document.activeElement as HTMLElement | null;

		// Focus first focusable in the body on open.
		const focusFirst = () => {
			const focusables = getFocusable(bodyRef.current);
			focusables[0]?.focus();
		};
		const raf = requestAnimationFrame(focusFirst);

		return () => {
			cancelAnimationFrame(raf);
			// Restore focus to the bar trigger on close.
			const focusables = getFocusable(barRef.current);
			(focusables[0] ?? prevFocusRef.current)?.focus?.();
		};
	}, [open]);

	// Esc to close + Tab trap (modal only).
	const onPanelKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				setOpen(false);
				return;
			}
			if (!modal || e.key !== "Tab") return;
			const focusables = getFocusable(morphRef.current);
			if (focusables.length === 0) {
				e.preventDefault();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement;
			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		},
		[modal, setOpen]
	);

	// The bar, always mounted. When closed it's a clickable trigger; when open it
	// docks as a header/footer at the placement edge.
	const barNode = (
		<div
			ref={barRef}
			className={cn(
				"flex shrink-0 items-center",
				open
					? cn(
							"gap-2 px-4 py-3",
							barAsHeader
								? tone === "dock"
									? "border-b border-white/10"
									: "border-b border-border/60"
								: tone === "dock"
									? "border-t border-white/10"
									: "border-t border-border/60"
						)
					: "gap-2"
			)}
		>
			{!open ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					aria-expanded={open}
					aria-haspopup={modal ? "dialog" : undefined}
					className="flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
				>
					{bar}
				</button>
			) : (
				bar
			)}
		</div>
	);

	const bodyWrap = mounted ? (
		<div
			className={cn(
				"overflow-hidden motion-reduce:transition-none",
				// Literal classes (Tailwind JIT can't see interpolated strings); these
				// mirror DockSheet's body transition exactly.
				axis === "y"
					? "transition-[height] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
					: "transition-[width] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
			)}
			style={axis === "y" ? { height: bodySize } : { width: bodySize }}
		>
			<div
				ref={bodyRef}
				className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
			>
				{/* Keep children mounted through the collapse (gated on `mounted`, not
            `open`) so the body clips away under overflow-hidden instead of
            snapping to empty. This matches DockSheet's requestClose feel. */}
				{children}
			</div>
		</div>
	) : null;

	// ─── Mobile bottom sheet ───
	const mobileSheet =
		isMobile && mounted ? (
			<div
				role={modal ? "dialog" : undefined}
				aria-modal={modal ? true : undefined}
				aria-label={ariaLabel}
				onKeyDown={onPanelKeyDown}
				className={cn(
					"pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl",
					open
						? "animate-in slide-in-from-bottom duration-300 motion-reduce:animate-none"
						: "animate-out slide-out-to-bottom duration-300 motion-reduce:animate-none",
					toneClasses(tone)
				)}
			>
				<div className="flex justify-center pt-2">
					<div className="h-1.5 w-10 rounded-full bg-border" aria-hidden />
				</div>
				{barAsHeader ? barNode : null}
				<div className="min-h-0 flex-1 overflow-auto">{children}</div>
				{barAsHeader ? null : barNode}
			</div>
		) : null;

	// ─── Desktop morph container ───
	const desktopContainer = !isMobile ? (
		<div
			ref={morphRef}
			role={open ? (modal ? "dialog" : undefined) : undefined}
			aria-modal={open && modal ? true : undefined}
			aria-label={ariaLabel}
			onKeyDown={onPanelKeyDown}
			className={cn(
				"pointer-events-auto transform-gpu overflow-hidden motion-reduce:transition-none",
				toneClasses(tone),
				open ? "rounded-2xl" : "rounded-3xl",
				// Compose body above/below the bar along the growth axis.
				axis === "x" ? "flex flex-row" : "flex flex-col",
				className
			)}
		>
			{barAsHeader ? (
				<>
					{barNode}
					{bodyWrap}
				</>
			) : (
				<>
					{bodyWrap}
					{barNode}
				</>
			)}
		</div>
	) : null;

	const backdrop =
		modal && open ? (
			<div
				className="animate-in fade-in fixed inset-0 z-40 bg-foreground/20 duration-200 motion-reduce:animate-none"
				onClick={() => setOpen(false)}
				aria-hidden
			/>
		) : null;

	// ─── Outer positioning ───
	// Viewport mode: a fixed, edge-anchored, pointer-events-none container.
	if (anchor === "viewport") {
		const outer = VIEWPORT_OUTER[resolved.side];
		return (
			<>
				{backdrop}
				<div className={cn("pointer-events-none fixed z-50 flex print:hidden", outer)}>
					{desktopContainer}
				</div>
				{mobileSheet}
			</>
		);
	}

	// Element anchor: fixed to the trigger element's viewport rect (flow nodes, etc.).
	if (elementAnchor) {
		if (!elementAnchorStyle) return mobileSheet;

		const anchored = (
			<>
				{backdrop}
				<div className="print:hidden" style={elementAnchorStyle}>
					{desktopContainer}
				</div>
				{mobileSheet}
			</>
		);

		if (shouldPortalElementAnchor) {
			return <BloomBodyPortal>{anchored}</BloomBodyPortal>;
		}

		return anchored;
	}

	// Inline anchor: a relative wrapper reserves the bar's footprint; the morph
	// container is absolutely pinned to the placement edge and grows away.
	const inlineAbs = INLINE_ABS[resolved.side];
	return (
		<span className="relative inline-flex">
			<span aria-hidden className="pointer-events-none invisible">
				{bar}
			</span>
			{backdrop}
			<div className={cn("absolute z-50", inlineAbs)}>{desktopContainer}</div>
			{mobileSheet}
		</span>
	);
}

/** Outer fixed-container placement classes per resolved side (viewport mode). */
const VIEWPORT_OUTER: Record<BloomSide, string> = {
	bottom: "inset-x-0 bottom-4 justify-center px-4 sm:bottom-6",
	top: "inset-x-0 top-3 justify-center px-4",
	left: "inset-y-0 left-3 items-center",
	right: "inset-y-0 right-3 items-center justify-end",
};

/** Absolute morph-container anchoring per resolved side (inline/element mode).
 * Pins the container to the bar's placement edge so it grows away from the bar. */
const INLINE_ABS: Record<BloomSide, string> = {
	bottom: "bottom-0 left-1/2 -translate-x-1/2",
	top: "top-0 left-1/2 -translate-x-1/2",
	left: "left-0 top-1/2 -translate-y-1/2",
	right: "right-0 top-1/2 -translate-y-1/2",
};

export default Bloom;
