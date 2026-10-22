/**
 * Canonical "pill" primitives for byronwade/ui.
 *
 * Every rounded chip on the site should draw from one of these so the design
 * language stays standardized. Previously these class strings were hand-rolled
 * and duplicated across the home hero, blog share bar, contact panel, resume
 * skills, and project tags, each drifting slightly. Import from here instead.
 */

/**
 * Interactive Thorbis chip: share and copy actions. A chip is a pill with a
 * short lift on the secondary surface, so it reads as pressable without a
 * coloured outline; hover is a quieter fill, never a lift. The 44px height is
 * the touch target (DESIGN.md §3.3).
 */
export const pillLinkClass =
	"inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-full bg-secondary px-3.5 font-medium text-copy-13 text-foreground shadow-(--shadow-button) transition-colors hover:bg-muted";
