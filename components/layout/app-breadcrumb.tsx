"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useSyncExternalStore } from "react";
import { BreadcrumbTrail } from "./breadcrumb-trail-view";

// The trail itself is small and ships with the layout: a separate chunk made
// every xl page exceed the 10-script budget. Its popover graph stays lazy and
// loads on the first open. The dots glyph is a server slot on this boundary.

export function AppBreadcrumb({
	labels,
	overflowIcon,
}: {
	labels: Record<string, string>;
	overflowIcon: ReactNode;
}) {
	const pathname = usePathname();
	return pathname === "/" ? null : <WideBreadcrumb labels={labels} overflowIcon={overflowIcon} />;
}

// Match the shell's xl visibility before downloading the optional popover graph.
const WIDE_HEADER = "(min-width: 80rem)";
function subscribeToHeader(onChange: () => void) {
	const media = window.matchMedia(WIDE_HEADER);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

function WideBreadcrumb({
	labels,
	overflowIcon,
}: {
	labels: Record<string, string>;
	overflowIcon: ReactNode;
}) {
	const wide = useSyncExternalStore(
		subscribeToHeader,
		() => window.matchMedia(WIDE_HEADER).matches,
		() => false
	);
	return wide ? <BreadcrumbTrail labels={labels} overflowIcon={overflowIcon} /> : null;
}
