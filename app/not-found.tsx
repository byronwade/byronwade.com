import type { Viewport } from "next";
import Link from "next/link";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function NotFound() {
	return (
		<div className="bg-[var(--background)] min-h-screen w-full flex items-center justify-center py-12 px-4 sm:py-16 md:py-20 safe-top safe-bottom">
			<div className="flex flex-col gap-8 sm:gap-10 items-center w-full max-w-[544px]">
				{/* Decorative floating elements */}
				<div className="relative">
					<div className="absolute -top-4 -left-4 w-2 h-2 bg-accent/40 rounded-full animate-pulse" />
					<div className="absolute -bottom-2 -right-6 w-3 h-3 bg-accent/30 rounded-full animate-pulse delay-150" />
					<div className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-accent/50 rounded-full animate-pulse delay-300" />
					
					{/* Main 404 with enhanced styling */}
					<h1 className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--foreground)] to-[var(--muted-foreground)] select-none">
						404
					</h1>
				</div>
				
				<div className="text-center space-y-4 sm:space-y-5">
					{/* Decorative line */}
					<div className="flex items-center justify-center gap-3 mb-2">
						<span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
						<span className="text-accent text-lg">✦</span>
						<span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
					</div>
					
					<h2 className="text-lg sm:text-xl font-medium text-[var(--foreground)]">
						Page not found
					</h2>
					<p className="text-[var(--muted-foreground)] mobile-text text-sm sm:text-base max-w-xs mx-auto">
						The page you're looking for seems to have wandered off. Let's get you back on track.
					</p>
					
					<Link
						href="/"
						className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-all duration-300 hover:translate-x-1 touch-target"
					>
						<span>Return home</span>
						<span className="transition-transform group-hover:translate-x-1">→</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
