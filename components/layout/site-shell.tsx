import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SiteShellProps {
	children: ReactNode;
	className?: string;
	width?: "narrow" | "wide";
}

/** Content width + gutter wrapper — header/footer/background come from SiteLayout */
export function SiteShell({ children, width = "narrow", className }: SiteShellProps) {
	const maxWidth = width === "narrow" ? "max-w-2xl" : "max-w-5xl";

	return (
		<div
			className={cn(
				// Small top (the layout's <main> already clears the floating chrome) +
				// generous bottom before the footer.
				"mx-auto w-full px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-20",
				maxWidth,
				className
			)}
		>
			{children}
		</div>
	);
}
