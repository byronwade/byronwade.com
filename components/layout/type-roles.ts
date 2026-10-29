/**
 * Shared type-role class strings. This file imports nothing on purpose.
 * The route error boundary renders these roles, and that boundary stays off
 * `cn` and Base UI. `page.tsx` re-exports the same strings for every other caller.
 */

/** Page title: the one 32px heading role. Error recovery uses the same string. */
export const pageTitleClass =
	"min-w-0 text-balance break-words font-heading font-medium text-foreground text-heading-32 tracking-tight";

/** The orientation passage under a page title. */
export const ledeClass = "max-w-2xl text-pretty text-body text-copy-16 leading-relaxed";

/**
 * A section heading: 20px, weight 500. Post-end topics, the writing pager and
 * related writing use this so those peers share one role.
 */
export const sectionHeadingClass =
	"text-balance font-heading font-medium text-foreground text-heading-20 tracking-tight";
