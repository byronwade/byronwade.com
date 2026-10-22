import type { ComponentProps, ReactNode } from "react";

/**
 * The collapsed-trail control. It renders alone until its first activation, so
 * a long trail does not download the popover graph on page load. The loaded
 * popover reuses it as its trigger, keeping one appearance and one name.
 * The dots glyph arrives as a server slot, so its definition stays out of the
 * layout chunk. The loading fallback can render the same slot.
 */
export function BreadcrumbOverflowTrigger({
	icon,
	...props
}: ComponentProps<"button"> & { icon: ReactNode }) {
	return (
		<button
			aria-label="Show hidden breadcrumb levels"
			className="flex size-11 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
			type="button"
			{...props}
		>
			{icon}
		</button>
	);
}
