"use client";

import { cn } from "@/lib/utils";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { type AnchorHTMLAttributes, forwardRef } from "react";

interface LinkProps extends NextLinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	className?: string;
	children: React.ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, children, ...props }, ref) => {
		return (
			<NextLink {...props} ref={ref} className={cn(className)}>
				{children}
			</NextLink>
		);
	}
);

Link.displayName = "Link";
