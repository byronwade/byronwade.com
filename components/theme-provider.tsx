"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
	children: React.ReactNode;
	attribute?: string;
	defaultTheme?: string;
	enableSystem?: boolean;
	storageKey?: string;
	forcedTheme?: string;
	disableTransitionOnChange?: boolean;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
