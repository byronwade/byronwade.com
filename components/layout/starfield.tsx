import { starScatter } from "@/lib/star-scatter";

/**
 * The site's one decorative layer (DESIGN.md §5.1): a fixed field of stars
 * behind every page. It is a server-rendered SVG of three repeating tiles at
 * different, coprime sizes, so the repeat never lines up into a visible grid,
 * and the star positions come from a fixed sequence, so the markup is identical on
 * every render and hydration has nothing to reconcile. It paints with the
 * `--space-star*` tokens: bright in deep space, faint chart dots in daylight.
 *
 * The work is the hero (DESIGN.md §4.1), so stars never sit under it at a size
 * that reads as punctuation: only the faint far layer crosses the reading
 * column; the brighter layers fill the gutters either side of it, from `md`.
 */

const round = (value: number) => Math.round(value * 10) / 10;

function starTile(
	id: string,
	side: number,
	count: number,
	[min, max]: [number, number],
	tone: string,
	offset: number
) {
	return {
		id,
		tile: side,
		tone,
		stars: starScatter(count, side, side, offset).map(({ x, y, size: radius }) => ({
			cx: x,
			cy: y,
			r: round(min + radius * (max - min)),
		})),
	};
}

const far = starTile("stars-far", 263, 14, [0.5, 0.8], "fill-(--space-star-dim)", 0);
const bright = [
	starTile("stars-mid", 409, 9, [0.8, 1.2], "fill-(--space-star)", 1),
	starTile("stars-near", 677, 5, [1.2, 1.7], "fill-(--space-star)", 2),
];
const TILES = [far, ...bright];

/** Either side of the 42rem measure and its gutter, so bright stars stay off the text. */
const GUTTERS = ["left-0 w-[calc(50%-23rem)]", "right-0 w-[calc(50%-23rem)]"] as const;

const layerClass = "pointer-events-none fixed inset-y-0 z-(--z-underlay) print:hidden";

export function Starfield() {
	return (
		<>
			<svg aria-hidden="true" className={`${layerClass} inset-x-0 size-full`} focusable="false">
				<defs>
					{TILES.map(({ id, tile, tone, stars }) => (
						<pattern height={tile} id={id} key={id} patternUnits="userSpaceOnUse" width={tile}>
							{stars.map(({ cx, cy, r }) => (
								<circle className={tone} cx={cx} cy={cy} key={`${cx}-${cy}`} r={r} />
							))}
						</pattern>
					))}
				</defs>
				<rect fill={`url(#${far.id})`} height="100%" width="100%" />
			</svg>
			{GUTTERS.map((side) => (
				<svg
					aria-hidden="true"
					className={`${layerClass} ${side} hidden h-full md:block`}
					focusable="false"
					key={side}
				>
					{bright.map(({ id }) => (
						<rect fill={`url(#${id})`} height="100%" key={id} width="100%" />
					))}
				</svg>
			))}
		</>
	);
}
