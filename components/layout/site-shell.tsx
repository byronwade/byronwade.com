import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SiteShellProps {
	children: ReactNode;
	width?: "narrow" | "wide" | "full";
	className?: string;
	/** Skip default vertical padding (useful when a PageHero already sets rhythm). */
	flush?: boolean;
}

/** Content width + gutter wrapper — header/footer come from SiteLayout */
export function SiteShell({
	children,
	width = "narrow",
	className,
	flush = false,
}: SiteShellProps) {
	const shell =
		width === "full" ? "w-full" : width === "wide" ? "container-shell" : "article-shell";

	return (
		<div className={cn(shell, !flush && "py-[var(--space-section-y-tight)]", className)}>
			{children}
		</div>
	);
}
