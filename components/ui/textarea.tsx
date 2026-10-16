// Thorbis Design port: src/components/ui/textarea.tsx @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.
import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"field-sizing-content flex min-h-16 w-full rounded-lg border border-input bg-field px-3 py-2 text-base shadow-(--shadow-field) outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
