const fraction = (value: number) => value - Math.floor(value);

/** The R2 low-discrepancy sequence's two irrational steps. */
const R2 = [0.754_877_666_2, 0.569_840_291] as const;

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Point n of an even scatter that never clumps or lines up (the R2 sequence),
 * with no randomness, so a sky drawn from it is identical on every render.
 * `offset` shifts the sequence so separate layers do not share points; `size`
 * in [0, 1) is a third, independent coordinate for a star's radius.
 */
export function starScatter(count: number, width: number, height: number, offset = 0) {
	return Array.from({ length: count }, (_, index) => {
		const n = index + 1;
		return {
			x: round(fraction(0.5 + offset / 3 + n * R2[0]) * width),
			y: round(fraction(0.5 + offset / 5 + n * R2[1]) * height),
			size: fraction(n * 0.618_034),
		};
	});
}
