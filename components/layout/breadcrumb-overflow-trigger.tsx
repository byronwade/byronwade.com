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
			className="flex size-6 items-center justify-center rounded-md text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-ring"
			type="button"
			{...props}
		>
			<MoreHorizontal className="size-4" />
		</button>
	);
}
