// Thorbis Design port: src/components/ui/input.tsx @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.
import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
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
