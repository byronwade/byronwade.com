import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Thorbis type roles are sizes, not colors. Without this theme extension,
// text-foreground removes text-copy-13 (and every other named source role).
const merge = extendTailwindMerge({
	extend: {
		theme: {
			text: ["copy-12", "copy-13", "copy-14", "copy-16", "heading-16", "heading-20", "heading-32"],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return merge(clsx(inputs));
}
