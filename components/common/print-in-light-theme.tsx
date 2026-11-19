"use client";

import { useEffect } from "react";

/**
 * Paper is light, on every page. Browsers drop backgrounds when printing, so a
 * reader in the dark theme would otherwise print pale text on white. For the duration of a
 * print (Ctrl+P), swap back to the light tokens instead of duplicating them as
 * print CSS; next-themes owns the `dark` class and is restored afterwards.
 */
export function PrintInLightTheme() {
	useEffect(() => {
		const root = document.documentElement;
		let restore: (() => void) | undefined;

		const beforePrint = () => {
			if (restore || !root.classList.contains("dark")) {
				return;
			}
			const colorScheme = root.style.colorScheme;
			root.classList.remove("dark");
			root.style.colorScheme = "light";
			restore = () => {
				root.classList.add("dark");
				root.style.colorScheme = colorScheme;
			};
		};
		const afterPrint = () => {
			restore?.();
			restore = undefined;
		};

		window.addEventListener("beforeprint", beforePrint);
		window.addEventListener("afterprint", afterPrint);
		return () => {
			window.removeEventListener("beforeprint", beforePrint);
			window.removeEventListener("afterprint", afterPrint);
			afterPrint();
		};
	}, []);

	return null;
}
