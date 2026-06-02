// Deterministic anonymous identity: stable name + gradient from any seed string.
const ADJECTIVES = [
	"Spectacular",
	"Injured",
	"Current",
	"Verbal",
	"Theoretical",
	"Natural",
	"Expensive",
	"Significant",
	"Quiet",
	"Brave",
	"Sleepy",
	"Curious",
	"Polished",
	"Distant",
	"Gentle",
	"Rapid",
];
const ANIMALS = [
	"Bonobo",
	"Narwhal",
	"Pheasant",
	"Bobcat",
	"Iguana",
	"Wasp",
	"Ant",
	"Slug",
	"Otter",
	"Falcon",
	"Lynx",
	"Heron",
	"Marten",
	"Gecko",
	"Tapir",
	"Crane",
];

/** FNV-1a 32-bit hash → stable non-negative int. */
function hash(seed: string): number {
	let h = 0x811c9dc5;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

export function animalName(seed: string): string {
	const h = hash(seed);
	return `${ADJECTIVES[h % ADJECTIVES.length]} ${ANIMALS[(h >>> 8) % ANIMALS.length]}`;
}

/** Two-stop gradient stops (CSS color strings) derived from the seed. */
export function gradientFor(seed: string): { from: string; to: string; angle: number } {
	const h = hash(seed);
	const hue = h % 360;
	return {
		from: `oklch(0.72 0.18 ${hue})`,
		to: `oklch(0.62 0.2 ${(hue + 40) % 360})`,
		angle: h % 360,
	};
}
