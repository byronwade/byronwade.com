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
				// The nav dock is fixed to the bottom of the viewport below `sm`
				// (nav-dock.tsx) and occupies roughly 72px including its offset.
				// Reserving less than that lets it cover the last control on the
				// page, which WCAG 2.2 §2.4.11 forbids for anything focusable.
				"mx-auto w-full px-4 pt-6 pb-28 sm:px-6 sm:pt-8 sm:pb-20",
				maxWidth,
				className
			)}
		>
			{children}
		</div>
	);
}
