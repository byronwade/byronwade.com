import Image from "next/image";

/**
 * The dark theme's sky (DESIGN.md §5.1): a real photograph, the Hubble eXtreme
 * Deep Field, set behind the top of every page and scrolling away with it.
 *
 * The photo is pre-dimmed and its fade is baked in (scripts/build-space-band.py),
 * and `screen` blending turns its black into the page's own sky, so the band has
 * no edge on any width. The blend sits on the wrapper, not the images: its
 * negative z-index makes it a stacking context, which isolates its children, so
 * an image blending inside it met a transparent backdrop and stayed black, and
 * the band ended in a hard black-to-navy seam 1395px down. It is decorative, so it is hidden from assistive
 * technology, from print and from the light theme. `loading="lazy"` keeps a
 * `display: none` image from downloading in the light theme at all; in the dark
 * theme it is already in view, so it loads at once, after the text it sits under.
 * The band is capped by the layout as well as the photograph: a short page must
 * end on its footer horizon, without the absolute image extending its scroll area.
 */
export function DeepField() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-(--z-underlay) hidden max-h-[87.1875rem] overflow-hidden mix-blend-screen dark:block print:hidden"
		>
			{/* One exposure protects copy in the reading column and in the gutters
			    (the article outline and breadcrumbs), at every viewport width. */}
			<Image
				alt=""
				className="absolute top-0 left-1/2 w-[100rem] max-w-none -translate-x-1/2"
				height={1395}
				loading="lazy"
				src="/images/space/hubble-xdf-band.webp"
				unoptimized
				width={1600}
			/>
		</div>
	);
}
