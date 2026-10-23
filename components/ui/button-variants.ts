// Thorbis Design port: src/components/ui/button.tsx @ 46b6654, variant table only.
// Dependency-free so markup outside Base UI (the always-loaded error boundary)
// can wear the commit recipe without shipping the Button primitive.
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"group/button inline-flex max-w-full shrink-0 select-none items-center justify-center in-data-[slot=button-group]:rounded-md rounded-md border border-transparent bg-clip-padding text-center font-medium text-copy-13 outline-none transition-[color,background-color,border-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 motion-safe:active:not-aria-[haspopup]:translate-y-px dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-(--shadow-commit) hover:bg-primary/90",
				outline:
					"border-(--ui-rim) bg-secondary shadow-(--shadow-button) hover:border-(--ui-rim-strong) hover:bg-(--ui-hover) hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-(--ui-hover) aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				ghost:
					"hover:bg-(--ui-hover) hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
				link: "text-primary underline-offset-4 hover:underline",
			},
			// Every size keeps at least the 44px touch target (DESIGN.md §3.3, Thorbis
			// control-touch). Sizes differ in padding and icon scale only, so a compact
			// control is visually quieter without becoming a smaller target. Text sizes
			// set a minimum, not a height: with enlarged text a label wraps inside the
			// container's width and the button grows taller instead of pushing the page
			// sideways. At default text every label fits on one 44px line.
			size: {
				default:
					"min-h-11 gap-1.5 px-3 py-2 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				sm: "min-h-11 gap-1 px-2.5 py-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "min-h-11 gap-1.5 px-3.5 py-2 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				icon: "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);
