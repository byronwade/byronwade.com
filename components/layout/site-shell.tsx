import type { ReactNode } from "react";

/**
 * The surface profile a route declares (DESIGN.md §3). It is rendered as
 * `data-profile` so the profile is inspectable in the DOM and checkable in
 * tests, rather than living only in documentation.
 */
type PageProfile = "showcase" | "evidence" | "guided" | "shared";

interface SiteShellProps {
	children: ReactNode;
	className?: string;
	profile: PageProfile;
	/**
	 * `narrow` is the Thorbis document measure (42rem), shared with the header
	 * and the footer, and every route sits on it, the homepage included. `wide`
	 * is reserved for pages with a live artifact (project preview, Figma file):
	 * only the artifact spans, and its text sits in `measureClass` so it keeps
	 * the header's edge.
	 */
	width?: "narrow" | "wide";
}

/**
 * The document measure inside a `wide` shell: centred on the same axis as the
 * header and footer, so an artifact page's title and prose share their edge.
 */
export const measureClass = "mx-auto w-full max-w-2xl";

/**
 * Content width + gutter wrapper, header/footer/background come from SiteLayout.
 *
 * `box-content` keeps the gutter outside the measure, matching the header's
 * chrome (`px-4 sm:px-5` around a 42rem box), so the page title, the header
 * and the footer share one left edge instead of sitting 24px apart.
 *
 * The shell also owns the page rhythm: its direct children are the page's
 * regions (identity, body, foot) and sit one step apart on every route.
 * Routes used to pick their own gap between title and body (32, 40, 48 or
 * 64px), so the same move read differently page to page.
 *
 * Classes are joined, not merged: callers only add print or spacing classes
 * that never conflict, and skipping tailwind-merge keeps it out of the error
 * boundary, which Next loads on every route.
 */
export function SiteShell({ children, profile, width = "narrow", className }: SiteShellProps) {
	return (
		<div
			className={[
				"mx-auto box-content flex flex-col gap-10 px-4 pt-8 pb-12 sm:gap-12 sm:px-5 sm:pt-10 sm:pb-16",
				width === "narrow" ? "max-w-2xl" : "max-w-5xl",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			data-profile={profile}
		>
			{children}
		</div>
	);
}
