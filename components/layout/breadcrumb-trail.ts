export interface Crumb {
	href: string;
	label: string;
}

function titleCase(seg: string): string {
	return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function dedupe(crumbs: Crumb[]): Crumb[] {
	const seen = new Set<string>();
	return crumbs.filter((c) => {
		if (seen.has(c.href)) {
			return false;
		}
		seen.add(c.href);
		return true;
	});
}

/**
 * Breadcrumb trail derived from the resolved browser pathname. A root "Home"
 * crumb plus known route ancestors and the current leaf, with labels
 * resolved from the supplied map (built server-side from the search index, so
 * dynamic `[slug]` leaves get real titles); unknown segments fall back to title case.
 */
export function resolveTrail(pathname: string, labels: Record<string, string>): Crumb[] {
	const root: Crumb = { label: labels["/"] ?? "Home", href: "/" };
	if (pathname === "/") {
		return [root];
	}

	const trail: Crumb[] = [root];
	const segments = pathname.split("/").filter(Boolean);
	let acc = "";
	for (const [index, seg] of segments.entries()) {
		acc += `/${seg}`;
		// A URL segment need not be a page (for example, /portfolio/figma).
		if (labels[acc] !== undefined || index === segments.length - 1) {
			trail.push({ label: labels[acc] ?? titleCase(seg), href: acc });
		}
	}
	return dedupe(trail);
}
