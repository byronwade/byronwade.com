/**
 * Reads the motion tokens from their canonical owner, `app/globals.css`.
 *
 * JS-driven animation (the capsule morph, the theme wipe) needs the same curves
 * and durations CSS uses. Reading them at call time rather than re-declaring
 * them keeps one scale — `DESIGN.md` §6.2. Before this existed the same
 * `cubic-bezier` literal was copy-pasted into four files.
 *
 * The fallbacks match globals.css and only apply during SSR, where no computed
 * style exists.
 */

const FALLBACKS = {
	"--motion-ease-out": "cubic-bezier(0.23, 1, 0.32, 1)",
	"--motion-ease-in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
	"--motion-ease-drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
	"--motion-fast": "120ms",
	"--motion-base": "200ms",
	"--motion-slow": "300ms",
	"--motion-drawer": "480ms",
} as const;

type MotionToken = keyof typeof FALLBACKS;

export function motionToken(name: MotionToken): string {
	if (typeof window === "undefined") {
		return FALLBACKS[name];
	}
	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return value || FALLBACKS[name];
}

/** Same token, as a number of milliseconds, for the Web Animations API. */
export function motionDuration(name: MotionToken): number {
	return Number.parseFloat(motionToken(name)) || 0;
}
