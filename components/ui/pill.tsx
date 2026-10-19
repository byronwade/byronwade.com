/**
 * Canonical "pill" primitives for byronwade/ui.
 *
 * Every rounded chip on the site should draw from one of these so the design
 * language stays standardized. Previously these class strings were hand-rolled
 * and duplicated across the home hero, blog share bar, contact panel, resume
 * skills, and project tags, each drifting slightly. Import from here instead.
 */

/**
 * Interactive outline pill: social links, tags, share buttons, skill chips.
 * Muted by default; borrows the brand accent on hover so interaction reads
 * consistently everywhere.
 */
export const pillLinkClass =
	"inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:bg-muted hover:text-foreground focus-ring";
