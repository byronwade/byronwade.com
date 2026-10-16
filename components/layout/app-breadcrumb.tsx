"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Home has no breadcrumb. Keep its popover/positioning graph off the initial
// homepage; other routes preserve the existing server-rendered breadcrumb API.
const BreadcrumbTrail = dynamic(() =>
	import("./breadcrumb-trail-view").then((module) => module.BreadcrumbTrail)
);

export function AppBreadcrumb({ labels }: { labels: Record<string, string> }) {
	const pathname = usePathname();
	return pathname === "/" ? null : <BreadcrumbTrail labels={labels} />;
}
