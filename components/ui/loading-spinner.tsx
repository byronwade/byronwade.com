"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, Code, Zap, Rocket } from "lucide-react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	variant?: "default" | "dots" | "pulse" | "bounce" | "tech";
	className?: string;
	text?: string;
}

const sizeClasses = {
	sm: "w-4 h-4",
	md: "w-6 h-6",
	lg: "w-8 h-8",
	xl: "w-12 h-12",
};

const textSizeClasses = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
	xl: "text-xl",
};

export function LoadingSpinner({ size = "md", variant = "default", className, text }: LoadingSpinnerProps) {
	const baseClasses = cn("animate-spin text-yellow-600", sizeClasses[size], className);

	if (variant === "default") {
		return (
			<div className="flex flex-col items-center gap-3">
				<Loader2 className={baseClasses} />
				{text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
			</div>
		);
	}

	if (variant === "dots") {
		return (
			<div className="flex flex-col items-center gap-4">
				<div className="flex space-x-2">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							className={cn("bg-yellow-600 rounded-full", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5")}
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 1, 0.7],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								delay: i * 0.2,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
				{text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
			</div>
		);
	}

	if (variant === "pulse") {
		return (
			<div className="flex flex-col items-center gap-4">
				<motion.div
					className={cn("bg-yellow-600 rounded-full", size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : size === "lg" ? "w-16 h-16" : "w-20 h-20")}
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.8, 1, 0.8],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				{text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
			</div>
		);
	}

	if (variant === "bounce") {
		return (
			<div className="flex flex-col items-center gap-4">
				<div className="flex space-x-2">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							className={cn("bg-yellow-600 rounded-full", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5")}
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 0.8,
								repeat: Infinity,
								delay: i * 0.1,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
				{text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
			</div>
		);
	}

	if (variant === "tech") {
		const icons = [Code, Zap, Rocket];
		return (
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					{icons.map((Icon, i) => (
						<motion.div
							key={i}
							className="absolute inset-0 flex items-center justify-center"
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: {
									duration: 3,
									repeat: Infinity,
									ease: "linear",
								},
								scale: {
									duration: 2,
									repeat: Infinity,
									delay: i * 0.3,
									ease: "easeInOut",
								},
							}}
						>
							<Icon className={cn("text-yellow-600", sizeClasses[size])} />
						</motion.div>
					))}
				</div>
				{text && <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{text}</p>}
			</div>
		);
	}

	return null;
}

// Full page loading component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
			<div className="text-center space-y-8">
				<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
					<LoadingSpinner size="xl" variant="tech" text={text} />
				</motion.div>

				{/* Progress bar */}
				<div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500"
						initial={{ width: "0%" }}
						animate={{ width: "100%" }}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>
			</div>
		</div>
	);
}

// Inline loading component for buttons
export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" }) {
	return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className={cn("border-2 border-current border-t-transparent rounded-full", size === "sm" ? "w-4 h-4" : "w-5 h-5")} />;
}
