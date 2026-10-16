"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

// Home has no breadcrumb. Keep its popover/positioning graph off the initial
// homepage; other routes load the optional trail after the pathname is known.
const BreadcrumbTrail = dynamic(
	() => import("./breadcrumb-trail-view").then((module) => module.BreadcrumbTrail),
	// A prerendered 404 knows /_not-found, not the visitor's requested pathname.
	// Render that optional trail on the client to avoid mismatched links/text.
	{ ssr: false }
);

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
