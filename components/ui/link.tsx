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

export const Link = ({ className, children, ref, ...props }: LinkProps) => (
	<NextLink
		prefetch={false}
		{...props}
		ref={ref}
		className={cn(
			"inline-flex min-h-6 min-w-6 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 max-sm:min-h-11 max-sm:min-w-11",
			className
		)}
	>
		{children}
	</NextLink>
);
