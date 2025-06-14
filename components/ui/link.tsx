"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends NextLinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	className?: string;
	children: React.ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ className, children, ...props }, ref) => {
	return (
		<NextLink {...props} ref={ref} className={cn(className)}>
			{children}
		</NextLink>
	);
});

Link.displayName = "Link";
