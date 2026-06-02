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

	// resolvedTheme is undefined on the server and may differ on first client paint
	// (system preference / localStorage). Keep SSR + hydration markup identical until
	// mounted, then swap icon + label to the resolved theme.
	const isDark = mounted && resolvedTheme === "dark";

	return (
		<button
			type="button"
			aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className={cn(
				"inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring",
				className
			)}
		>
			{mounted ? (
				isDark ? (
					<Sun className="size-[1.1rem]" strokeWidth={2} aria-hidden="true" />
				) : (
					<Moon className="size-[1.1rem]" strokeWidth={2} aria-hidden="true" />
				)
			) : (
				<span className="size-[1.1rem]" aria-hidden="true" />
			)}
		</button>
	);
}
