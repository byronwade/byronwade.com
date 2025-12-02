"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HomeNavigationProps {
	copiedButton?: string | null;
	onCopyEmail?: (buttonId: string) => void;
}

export function HomeNavigation({ copiedButton, onCopyEmail }: HomeNavigationProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const copyEmail = async (buttonId: string) => {
		if (onCopyEmail) {
			onCopyEmail(buttonId);
		} else {
			try {
				await navigator.clipboard.writeText("byron@byronwade.com");
			} catch (err) {
				console.error("Failed to copy email:", err);
			}
		}
	};

	return (
		<nav className="flex flex-wrap gap-4 sm:gap-6 items-center" aria-label="Main navigation">
			<Link
				href="/projects"
				className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
			>
				Projects
			</Link>
			<Link
				href="/blog"
				className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
			>
				Blog
			</Link>
			<Link
				href="/resume"
				className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
			>
				Resume
			</Link>
			<button
				type="button"
				onClick={() => copyEmail("nav")}
				className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 cursor-pointer bg-transparent border-none p-1 button-press focus-ring touch-target"
				aria-label="Copy email to clipboard"
			>
				<span className={copiedButton === "nav" ? "bounce-subtle" : ""}>
					{copiedButton === "nav" ? "Copied!" : "Contact"}
				</span>
			</button>
			<div className="group/tooltip relative inline-block">
				<button
					type="button"
					className="relative cursor-pointer bg-transparent border-none p-2 sm:p-1.5 rounded-md transition-all duration-200 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 theme-toggle button-press focus-ring touch-target"
					aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
					onClick={toggleTheme}
				>
					<div className="size-5 sm:size-4">
						{mounted && theme === "dark" ? (
							<Sun className="block size-full" />
						) : (
							<Moon className="block size-full" />
						)}
					</div>
				</button>
				<div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
					{mounted && theme === "dark" ? "Go Light" : "Go Dark"}
					<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--foreground)]" />
				</div>
			</div>
		</nav>
	);
}
