"use client";

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
	<NextLink {...props} ref={ref} className={cn(className)}>
		{children}
	</NextLink>
);
