/**
 * The site's one decorative layer (DESIGN.md §5.1): a fixed field of stars
 * behind every page. It is a server-rendered SVG of three repeating tiles at
 * different, coprime sizes, so the repeat never lines up into a visible grid,
 * and the star positions come from a fixed sequence, so the markup is identical on
 * every render and hydration has nothing to reconcile. It paints with the
 * `--space-star*` tokens: bright in deep space, faint chart dots in daylight.
 */

const fraction = (value: number) => value - Math.floor(value);

/**
 * The R2 low-discrepancy sequence: point n of an even scatter that never
 * clumps or lines up, with no randomness, so the sky is the same on every build.
 */
const R2 = [0.754_877_666_2, 0.569_840_291] as const;

const LAYERS = [
	{ id: "stars-far", tile: 263, count: 14, radius: [0.5, 0.8], tone: "fill-(--space-star-dim)" },
	{ id: "stars-mid", tile: 409, count: 9, radius: [0.8, 1.2], tone: "fill-(--space-star)" },
	{ id: "stars-near", tile: 677, count: 5, radius: [1.2, 1.7], tone: "fill-(--space-star)" },
] as const;

const round = (value: number) => Math.round(value * 10) / 10;

const TILES = LAYERS.map((layer, index) => {
	const [min, max] = layer.radius;
	return {
		...layer,
		stars: Array.from({ length: layer.count }, (_, n) => ({
			cx: round(fraction(0.5 + index / 3 + (n + 1) * R2[0]) * layer.tile),
			cy: round(fraction(0.5 + index / 5 + (n + 1) * R2[1]) * layer.tile),
			r: round(min + fraction((n + 1) * 0.618_034) * (max - min)),
		})),
	};
});

export function Starfield() {
	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 z-(--z-underlay) size-full print:hidden"
			focusable="false"
		>
			<defs>
				{TILES.map(({ id, tile, tone, stars }) => (
					<pattern height={tile} id={id} key={id} patternUnits="userSpaceOnUse" width={tile}>
						{stars.map(({ cx, cy, r }) => (
							<circle className={tone} cx={cx} cy={cy} key={`${cx}-${cy}`} r={r} />
						))}
					</pattern>
				))}
			</defs>
			{TILES.map(({ id }) => (
				<rect fill={`url(#${id})`} height="100%" key={id} width="100%" />
			))}
		</svg>
	);
}
