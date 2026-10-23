// Thorbis Design port: src/components/ui/input.tsx @ 46b6654.
// Native-element adapter; see docs/THORBIS-DESIGN-PORT.md.
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Hookless, so a server component renders it as plain HTML and a client component
 * ships only this function: the native input already labels, validates and submits.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"h-11 w-full min-w-0 rounded-lg border border-muted-foreground bg-field px-3 py-1 text-copy-16 shadow-(--shadow-field) outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-copy-14 file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-copy-14 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
				className
			)}
			{...props}
		/>
	);
}

export { Input };
