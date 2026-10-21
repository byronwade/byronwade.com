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
	role,
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	// When `render` swaps the underlying element for a non-<button> (e.g. a
	// Next.js <Link> that renders an <a>), Base UI requires `nativeButton={false}`
	// for a custom render target. Destinations keep native link semantics; other
	// custom targets keep button semantics. Explicit caller roles still win.
	const renderedElement = React.isValidElement<{ href?: unknown }>(render) ? render : null;
	const resolvedNativeButton =
		nativeButton ??
		(render !== undefined && render !== null && renderedElement?.type !== "button"
			? false
			: undefined);
	const resolvedRole =
		role ??
		(resolvedNativeButton === false &&
		renderedElement?.props.href !== undefined &&
		renderedElement?.props.href !== null
			? "link"
			: undefined);

	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			render={render}
			nativeButton={resolvedNativeButton}
			role={resolvedRole}
			{...props}
		/>
	);
}

export { Button };
