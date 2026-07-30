import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SiteShellProps {
	children: ReactNode;
	width?: "narrow" | "wide";
	className?: string;
}

/** Content width + gutter wrapper: header/footer/background come from SiteLayout */
export function SiteShell({ children, width = "narrow", className }: SiteShellProps) {
	const maxWidth = width === "narrow" ? "max-w-2xl" : "max-w-5xl";

	return (
		<div
			className={cn(
				// Small top (the layout's <main> already clears the floating chrome).
				// The cinematic footer carries its own lead-in, so the bottom gap here
				// stays modest and the two don't compound into a dead zone.
				"mx-auto w-full px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-12",
				maxWidth,
				className
			)}
		>
			{children}
		</div>
	);
}
