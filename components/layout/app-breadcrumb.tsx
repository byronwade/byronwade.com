"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

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
	return pathname === "/" ? null : <BreadcrumbTrail labels={labels} />;
}
