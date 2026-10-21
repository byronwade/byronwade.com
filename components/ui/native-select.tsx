// Thorbis Design port: "a select is a well" (rules/page Forms) @ 46b6654.
// The Input recipe on the platform select, so the picker stays native on phones.
import type * as React from "react";
import { CaretDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * WebKit paints a native select as a light system button, ignoring the field
 * fill, so on an iPhone it read as a different control from the wells beside
 * it. `appearance-none` keeps the well; the caret replaces the platform arrow
 * and the options list stays the platform picker.
 */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<span className="relative flex w-full min-w-0" data-slot="field-target">
			<select
				data-slot="native-select"
				className={cn(
					"h-11 w-full min-w-0 appearance-none rounded-lg border border-muted-foreground bg-field pr-9 pl-3 text-copy-16 text-foreground shadow-(--shadow-field) outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-copy-14 dark:aria-invalid:ring-destructive/40",
					className
				)}
				{...props}
			/>
			<CaretDown
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
				weight="regular"
			/>
		</span>
	);
}

export { NativeSelect };
