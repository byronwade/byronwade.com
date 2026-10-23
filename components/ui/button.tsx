// Thorbis Design port: src/components/ui/button.tsx @ 46b6654.
// Native-element adapter; see docs/THORBIS-DESIGN-PORT.md.
import type { VariantProps } from "class-variance-authority";
import { type ComponentProps, cloneElement, type ReactElement, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

type Handler = (event: never) => void;

interface LinkTargetProps {
	children?: ReactNode;
	className?: string;
	href: unknown;
	[prop: string]: unknown;
}

type ButtonProps = ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		/**
		 * A destination (`<a href>` or Next `<Link>`) to draw as a button. It stays a
		 * real link: no button role, type or key handling is added. Its own children
		 * win over the Button's; its handlers run before the Button's.
		 */
		render?: ReactElement<LinkTargetProps>;
	};

/**
 * Hookless, so a server component renders it as plain HTML and a client component
 * ships only this function: native elements already give buttons and links their
 * keyboard, focus, form and disabled behavior.
 */
function Button({
	className,
	variant = "default",
	size = "default",
	render,
	...props
}: ButtonProps) {
	// cva joins classes without merging; cn lets a caller's override win.
	const classes = cn(buttonVariants({ variant, size, className }));
	if (!render) {
		return <button type="button" data-slot="button" className={classes} {...props} />;
	}

	const { type: _buttonOnly, ...linkProps } = props;
	const own = render.props;
	const merged: Record<string, unknown> = { ...linkProps, ...own };
	for (const [key, outer] of Object.entries(linkProps)) {
		const inner = own[key];
		// Chain only when both sides handle the event, so a server render never
		// creates a function prop that nobody passed.
		if (key.startsWith("on") && typeof outer === "function" && typeof inner === "function") {
			merged[key] = (event: never) => {
				(inner as Handler)(event);
				(outer as Handler)(event);
			};
		}
	}
	return cloneElement(render, {
		...merged,
		children: own.children ?? props.children,
		className: cn(classes, own.className),
		"data-slot": "button",
	});
}

export { Button };
