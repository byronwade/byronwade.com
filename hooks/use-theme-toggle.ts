"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { flushSync } from "react-dom";

/** Matches the dock/launcher motion curve so the reveal feels like the rest of the chrome. */
const EASE = "cubic-bezier(.22,1,.36,1)";
const DURATION_MS = 480;

type ViewTransitionDocument = Document & {
	startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Single owner of "flip the theme". The swap is revealed with a circular wipe
 * centred on whatever element was clicked, and falls back to an instant switch
 * when the browser lacks View Transitions or the visitor prefers reduced motion.
 */
export function useThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = useCallback(
		(event?: { currentTarget: Element }) => {
			const next = resolvedTheme === "dark" ? "light" : "dark";
			const doc = document as ViewTransitionDocument;
			const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			if (!doc.startViewTransition || prefersReducedMotion || !event) {
				setTheme(next);
				return;
			}

			const rect = event.currentTarget.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

			doc
				.startViewTransition(() => flushSync(() => setTheme(next)))
				.ready.then(() => {
					document.documentElement.animate(
						{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
						{
							duration: DURATION_MS,
							easing: EASE,
							pseudoElement: "::view-transition-new(root)",
						}
					);
				});
		},
		[resolvedTheme, setTheme]
	);

	return { resolvedTheme, toggleTheme };
}
