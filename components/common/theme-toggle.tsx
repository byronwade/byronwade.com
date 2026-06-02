"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={cn(
				"inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring",
				className
			)}
		>
			{mounted ? (
				isDark ? (
					<Sun className="size-[1.1rem]" strokeWidth={2} />
				) : (
					<Moon className="size-[1.1rem]" strokeWidth={2} />
				)
			) : (
				<span className="size-[1.1rem]" />
			)}
		</button>
	);
}
