"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

type ThemeProviderProps = {
	children: React.ReactNode;
} & Omit<NextThemesProviderProps, "children">;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="dark">{children}</div>;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
