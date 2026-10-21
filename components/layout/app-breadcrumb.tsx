"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { BreadcrumbTrail } from "./breadcrumb-trail-view";

// The trail itself is small and ships with the layout: a separate chunk made
// every xl page exceed the 10-script budget. Its popover/positioning graph stays
// lazy in BreadcrumbOverflow and loads only when a long trail collapses.

export function AppBreadcrumb({ labels }: { labels: Record<string, string> }) {
	const pathname = usePathname();
	return pathname === "/" ? null : <WideBreadcrumb labels={labels} />;
}

// Match the shell's xl visibility before downloading the optional popover graph.
const WIDE_HEADER = "(min-width: 80rem)";
function subscribeToHeader(onChange: () => void) {
	const media = window.matchMedia(WIDE_HEADER);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}

function WideBreadcrumb({ labels }: { labels: Record<string, string> }) {
	const wide = useSyncExternalStore(
		subscribeToHeader,
		() => window.matchMedia(WIDE_HEADER).matches,
		() => false
	);
	return wide ? <BreadcrumbTrail labels={labels} /> : null;
}
