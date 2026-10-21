"use client";

// Thorbis Design port: src/components/site/site-shell.stylex.ts link/focusRing @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends NextLinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	children?: ReactNode;
	className?: string;
	/** React 19 forwards refs as a normal prop; no forwardRef wrapper needed. */
	ref?: Ref<HTMLAnchorElement>;
}

/**
 * Focus only. Size and display belong to the caller's recipe: `link-action`
 * for a standalone 44px target, `link-underline` for a link inside a sentence,
 * or a row/nav class. A default `min-h-6` here outranked `link-action`'s 44px
 * on desktop, and `inline-flex` pulled sentence links off the line.
 */
export const Link = ({ className, children, ref, ...props }: LinkProps) => (
	<NextLink
		{...props}
		prefetch={false}
		ref={ref}
		className={cn(
			"rounded-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
			className
		)}
	>
		{children}
	</NextLink>
);
