import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[color,background-color,transform,opacity,box-shadow] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary)_88%,black)]",
				outline:
					"border-border bg-card text-foreground hover:border-foreground/20 hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary)_90%,var(--foreground))]",
				ghost:
					"bg-transparent text-foreground hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
				link: "bg-transparent text-primary underline-offset-4 hover:underline",
				inverse:
					"bg-transparent px-0 text-white hover:bg-transparent hover:text-primary-bright focus-visible:ring-offset-ink",
			},
			size: {
				default: "h-11 px-4 py-2",
				xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 rounded-xl px-3.5 text-xs",
				lg: "h-12 px-6 text-base",
				xl: "h-14 px-7 text-base tracking-[-0.01em]",
				icon: "size-11",
				"icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-9 rounded-xl",
				"icon-lg": "size-12",
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
		(render != null && !(React.isValidElement(render) && render.type === "button")
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

export { Button, buttonVariants };
