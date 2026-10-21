// Thorbis Design port: src/components/ui/button.tsx @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

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
