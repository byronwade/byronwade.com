// Thorbis Design port: src/components/ui/textarea.tsx @ 46b6654.
// Base UI/Next.js adapter; see docs/THORBIS-DESIGN-PORT.md.
import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"field-sizing-content flex min-h-16 w-full rounded-lg border border-muted-foreground bg-field px-3 py-2 text-copy-16 shadow-(--shadow-field) outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-copy-14 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
