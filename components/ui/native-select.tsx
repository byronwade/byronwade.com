// Thorbis Design port: "a select is a well" (rules/page Forms) @ 46b6654.
// The Input recipe on the platform select, so the picker stays native on phones.
import type * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<select
			data-slot="native-select"
			className={cn(
				"h-11 w-full min-w-0 rounded-lg border border-muted-foreground bg-field px-3 text-copy-16 shadow-(--shadow-field) outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-copy-14 dark:aria-invalid:ring-destructive/40",
				className
			)}
			{...props}
		/>
	);
}

export { NativeSelect };
