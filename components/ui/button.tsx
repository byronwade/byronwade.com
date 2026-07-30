import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow,opacity] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-[0_1px_2px_color-mix(in_oklch,var(--foreground)_8%,transparent)] hover:bg-[color-mix(in_oklch,var(--primary)_92%,white)]",
				outline:
					"border-border/80 bg-card/80 text-foreground shadow-[0_1px_2px_color-mix(in_oklch,var(--foreground)_3%,transparent)] hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary)_88%,var(--foreground))]",
				ghost:
					"bg-transparent text-foreground hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
				link: "bg-transparent text-foreground underline-offset-4 hover:underline",
				inverse:
					"bg-transparent px-0 text-white hover:bg-transparent hover:text-white/80 focus-visible:ring-offset-ink",
			},
			size: {
				default: "h-11 px-5 py-2",
				xs: "h-7 gap-1 rounded-xl px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 rounded-xl px-3.5 text-xs",
				lg: "h-12 px-6 text-base",
				xl: "h-14 px-7 text-base tracking-[-0.01em]",
				icon: "size-11",
				"icon-xs": "size-7 rounded-xl [&_svg:not([class*='size-'])]:size-3",
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
