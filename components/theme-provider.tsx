"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// @ts-ignore
export function ThemeProvider({ children, ...props }) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
