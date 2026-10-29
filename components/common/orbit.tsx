import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * A small planetary system: a ringed planet, three orbits and their moons.
 * Decorative only (DESIGN.md §5.1), so it is hidden from assistive technology
 * and never carries meaning. The moons turn on `--motion-orbit`, slow enough to
 * read as stillness; reduced motion leaves them parked where they start.
 */
export function Orbit({ className }: { className?: string }) {
	const planet = useId();
	return (
		<svg
			aria-hidden="true"
			className={cn("pointer-events-none overflow-visible", className)}
			fill="none"
			focusable="false"
			viewBox="0 0 240 240"
		>
			<circle className="stroke-(--space-orbit)" cx="120" cy="120" r="112" strokeDasharray="2 6" />
			<circle className="stroke-(--space-orbit)" cx="120" cy="120" r="84" />
			<circle className="stroke-(--space-orbit)" cx="120" cy="120" r="56" strokeDasharray="1 4" />

			<g className="orbit-spin">
				<circle className="fill-brand" cx="204" cy="120" r="4.5" />
			</g>
			<g className="orbit-spin orbit-spin-reverse">
				<circle className="fill-(--space-moon)" cx="120" cy="8" r="3" />
			</g>
			<g className="orbit-spin orbit-spin-near">
				<circle className="fill-muted-foreground" cx="80.4" cy="159.6" r="2.5" />
			</g>

			<ellipse
				className="stroke-(--space-rim)"
				cx="120"
				cy="120"
				rx="44"
				ry="9"
				strokeWidth="1.25"
				transform="rotate(-18 120 120)"
			/>
			<clipPath id={planet}>
				<circle cx="120" cy="120" r="26" />
			</clipPath>
			<circle className="fill-(--space-planet)" cx="120" cy="120" r="26" />
			{/* The night side: the page's own sky, offset away from the light. */}
			<circle className="orbit-night" clipPath={`url(#${planet})`} cx="134" cy="130" r="26" />
			<circle className="stroke-(--space-rim)" cx="120" cy="120" r="26" strokeWidth="1" />
			{/* The ring passes behind the planet; its near half is redrawn in front. */}
			<path
				className="stroke-(--space-rim)"
				d="M 78.2 133.6 A 44 9 -18 0 0 161.8 106.4"
				strokeWidth="1.25"
			/>
		</svg>
	);
}
