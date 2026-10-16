// Thorbis Design port: src/components/ui/button.tsx @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap in-data-[slot=button-group]:rounded-md rounded-md border border-transparent bg-clip-padding font-medium text-copy-13 outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 max-sm:min-h-11 max-sm:min-w-11 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-(--shadow-commit) hover:bg-primary/90",
				brand:
					"bg-brand text-brand-foreground shadow-(--shadow-accent-action) hover:bg-(--thorbis-accent-hover)",
				outline:
					"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				ghost:
					"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default:
					"h-9 min-h-11 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 sm:min-h-9",
				xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-md px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-md px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-11 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				icon: "size-11 sm:size-10",
				"icon-xs":
					"size-6 in-data-[slot=button-group]:rounded-lg rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-7 in-data-[slot=button-group]:rounded-lg rounded-md",
				"icon-lg": "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

function Button({
	className,
	variant = "default",
	size = "default",
	render,
	nativeButton,
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	// When `render` swaps the underlying element for a non-<button> (e.g. a
	// Next.js <Link> that renders an <a>), Base UI requires `nativeButton={false}`
	// to keep correct button semantics. Infer it from the render target unless the
	// caller set it explicitly.
	const resolvedNativeButton =
		nativeButton ??
		(render !== undefined &&
		render !== null &&
		!(React.isValidElement(render) && render.type === "button")
			? false
			: undefined);

	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			render={render}
			nativeButton={resolvedNativeButton}
			{...props}
		/>
	);
}

export { Button };
