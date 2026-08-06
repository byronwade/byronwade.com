"use client";

import { type RefObject, useEffect, useLayoutEffect } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const EASE = "cubic-bezier(.22,1,.36,1)";

interface CapsuleMorphOptions {
	/** Delay before the pill fades back in. */
	closeDelayMs: number;
	/** The collapsed pill, cross-faded out on open. */
	compactRef: RefObject<HTMLElement | null>;
	/** Extra values that should re-run the choreography (e.g. a panel mode swap). */
	deps?: readonly unknown[];
	/** Transition duration for width, height, and radius. */
	durationMs: number;
	/** The shared capsule that resizes between the two states. */
	morphRef: RefObject<HTMLElement | null>;
	/** Runs once the open animation has been started — used to move focus. */
	onOpened?: () => void;
	/** Whether the panel is currently open. */
	open: boolean;
	/** Delay before the panel fades in. */
	openDelayMs: number;
	/** The expanded panel, cross-faded in on open. */
	panelRef: RefObject<HTMLElement | null>;
}

/**
 * The dock's signature choreography: a single capsule animates its width,
 * height, and radius between a compact pill and an expanded panel while the two
 * sets of contents cross-fade.
 *
 * Shared by the app launcher and the dock toolbar, which previously carried
 * near-identical copies that had already drifted apart in their timings. Honors
 * `prefers-reduced-motion` by snapping to the end state instead of animating.
 */
export function useCapsuleMorph({
	open,
	morphRef,
	compactRef,
	panelRef,
	durationMs,
	openDelayMs,
	closeDelayMs,
	onOpened,
	deps = [],
}: CapsuleMorphOptions) {
	useIsoLayoutEffect(() => {
		const morph = morphRef.current;
		const compact = compactRef.current;
		const panel = panelRef.current;
		if (!(morph && compact && panel)) {
			return;
		}

		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const transition = `width ${durationMs}ms ${EASE}, height ${durationMs}ms ${EASE}, border-radius ${durationMs}ms ${EASE}`;

		// Hand sizing back to the layout once the animation is done, so the
		// capsule keeps tracking its natural content size.
		const release = () => {
			morph.style.transition = "none";
			morph.style.width = "";
			morph.style.height = "";
			void morph.offsetWidth;
			morph.style.transition = "";
		};

		if (open) {
			collapsed.set(morph, collapsed.get(morph) ?? { w: morph.offsetWidth, h: morph.offsetHeight });
			const startWidth = morph.offsetWidth;
			const startHeight = morph.offsetHeight;
			const endWidth = panel.offsetWidth;
			const endHeight = panel.offsetHeight;

			compact.style.transitionDelay = "0ms";
			compact.style.opacity = "0";
			panel.style.transitionDelay = reduce ? "0ms" : `${openDelayMs}ms`;
			panel.style.opacity = "1";

			if (reduce) {
				morph.style.transition = "none";
			} else {
				morph.style.transition = "none";
				morph.style.width = `${startWidth}px`;
				morph.style.height = `${startHeight}px`;
				void morph.offsetWidth; // reflow, so the next assignment animates
				morph.style.transition = transition;
			}
			morph.style.width = `${endWidth}px`;
			morph.style.height = `${endHeight}px`;
			onOpened?.();
			return;
		}

		const collapsedSize = collapsed.get(morph);
		if (!(collapsedSize && morph.style.width)) {
			return;
		}

		panel.style.transitionDelay = "0ms";
		panel.style.opacity = "0";
		compact.style.transitionDelay = reduce ? "0ms" : `${closeDelayMs}ms`;
		compact.style.opacity = "1";

		if (reduce) {
			release();
			return;
		}

		morph.style.transition = transition;
		morph.style.width = `${collapsedSize.w}px`;
		morph.style.height = `${collapsedSize.h}px`;

		const onEnd = (event: TransitionEvent) => {
			if (event.propertyName !== "height") {
				return;
			}
			release();
			morph.removeEventListener("transitionend", onEnd);
		};
		morph.addEventListener("transitionend", onEnd);
		return () => morph.removeEventListener("transitionend", onEnd);
	}, [open, durationMs, openDelayMs, closeDelayMs, ...deps]);
}

/** Collapsed footprint per capsule, measured once before the first expansion. */
const collapsed = new WeakMap<HTMLElement, { w: number; h: number }>();
