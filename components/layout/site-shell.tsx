import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SiteShellProps {
	children: ReactNode;
	width?: "narrow" | "wide";
	className?: string;
}

/** Content width + gutter wrapper — header/footer/background come from SiteLayout */
export function SiteShell({ children, width = "narrow", className }: SiteShellProps) {
	const maxWidth = width === "narrow" ? "max-w-2xl" : "max-w-5xl";

	return (
		<div className={cn("mx-auto w-full px-4 py-12 sm:px-6 sm:py-16", maxWidth, className)}>
			{children}
		</div>
	);
}
