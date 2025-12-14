import { cn } from "@/lib/utils";

interface GradientTextProps {
	children: React.ReactNode;
	className?: string;
	variant?: "accent" | "warm" | "cool" | "purple" | "blue";
	as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Gradient Text Component
 * Applies gradient text effects with proper fallbacks
 */
export function GradientText({
	children,
	className,
	variant = "accent",
	as: Component = "span",
}: GradientTextProps) {
	const gradientClasses = {
		accent: "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-500 dark:from-yellow-500 dark:via-amber-500 dark:to-yellow-400",
		warm: "bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 dark:from-orange-500 dark:via-red-400 dark:to-pink-400",
		cool: "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-500 dark:via-cyan-400 dark:to-teal-400",
		purple: "bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-500 dark:via-indigo-400 dark:to-blue-400",
		blue: "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400",
	};

	return (
		<Component
			className={cn(
				"bg-clip-text text-transparent",
				gradientClasses[variant],
				className
			)}
		>
			{children}
		</Component>
	);
}
