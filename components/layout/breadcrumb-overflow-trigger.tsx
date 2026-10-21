import type { ComponentProps } from "react";
import { MoreHorizontal } from "@/lib/icons";

/**
 * The collapsed-trail control. It renders alone until its first activation, so
 * a long trail does not download the popover graph on page load. The loaded
 * popover reuses it as its trigger, keeping one appearance and one name.
 */
export function BreadcrumbOverflowTrigger(props: ComponentProps<"button">) {
	return (
		<button
			aria-label="Show hidden breadcrumb levels"
			className="flex size-11 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
			type="button"
			{...props}
		>
			<MoreHorizontal className="size-4" />
		</button>
	);
}
