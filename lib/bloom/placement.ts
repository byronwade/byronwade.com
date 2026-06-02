export type BloomPlacement =
	| "top"
	| "top-start"
	| "top-end"
	| "bottom"
	| "bottom-start"
	| "bottom-end"
	| "left"
	| "left-start"
	| "left-end"
	| "right"
	| "right-start"
	| "right-end";

export type BloomSide = "top" | "bottom" | "left" | "right";
export type BloomAlign = "start" | "center" | "end";
export type GrowAxis = "y" | "x";

export interface ResolvedPlacement {
	side: BloomSide;
	align: BloomAlign;
	grow: "up" | "down" | "left" | "right";
	axis: GrowAxis;
	transformOrigin: string;
	barOrder: "before" | "after";
}

export function parsePlacement(p: BloomPlacement): { side: BloomSide; align: BloomAlign } {
	const [side, align = "center"] = p.split("-") as [BloomSide, BloomAlign?];
	return { side, align };
}

const GROW: Record<BloomSide, ResolvedPlacement["grow"]> = {
	bottom: "up",
	top: "down",
	left: "right",
	right: "left",
};
const ORIGIN: Record<BloomSide, string> = {
	bottom: "bottom center",
	top: "top center",
	left: "left center",
	right: "right center",
};

export function resolvePlacement(p: BloomPlacement): ResolvedPlacement {
	const { side, align } = parsePlacement(p);
	const axis: GrowAxis = side === "left" || side === "right" ? "x" : "y";
	const barOrder = side === "bottom" || side === "right" ? "after" : "before";
	return { side, align, grow: GROW[side], axis, transformOrigin: ORIGIN[side], barOrder };
}

const OPPOSITE: Record<BloomSide, BloomSide> = {
	top: "bottom",
	bottom: "top",
	left: "right",
	right: "left",
};

/** Auto-flip: if the panel would overflow the viewport on `side`, flip to the opposite side. */
export function flipIfNeeded(
	p: BloomPlacement,
	space: { top: number; bottom: number; left: number; right: number },
	needed: number,
	padding: number
): BloomPlacement {
	const { side, align } = parsePlacement(p);
	if (space[side] >= needed + padding) return p;
	const opp = OPPOSITE[side];
	if (space[opp] > space[side])
		return (align === "center" ? opp : `${opp}-${align}`) as BloomPlacement;
	return p;
}
