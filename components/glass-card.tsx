import { cn } from "@/lib/utils";

interface GlassCardProps {
	children: React.ReactNode;
	className?: string;
	blur?: "sm" | "md" | "lg";
}

/**
 * Glass Card Component
 * Creates a glassmorphism effect with backdrop blur
 */
export function GlassCard({ children, className, blur = "md" }: GlassCardProps) {
	const blurClasses = {
		sm: "backdrop-blur-sm",
		md: "backdrop-blur-md",
		lg: "backdrop-blur-lg",
	};

	return (
		<div
			className={cn(
				"bg-[var(--card)]/80 dark:bg-[var(--card)]/60",
				"border border-[var(--border)]/50",
				"rounded-lg",
				blurClasses[blur],
				"shadow-lg",
				className
			)}
		>
			{children}
		</div>
	);
}
