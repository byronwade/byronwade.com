export interface Crumb {
	href: string;
	label: string;
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
 * Leaves named by server data the header doesn't load, keyed by parent path. A
 * plain noun beats title-casing an opaque identifier like a Figma file key.
 */
const LEAF_LABELS: Record<string, string> = {
	"/portfolio/figma": "Design file",
};

/**
 * Breadcrumb trail derived purely from the pathname so it's stable from SSR (no
 * hydration pop). A root "Home" crumb, a crumb per parent segment that is a real
 * page, and the current page. Labels come from the supplied map (built
 * server-side from the search index, which lists every page, so dynamic `[slug]`
 * leaves get real titles). Parents missing from it, like `/portfolio/figma`, have
 * no page to link to and are skipped.
 *
 * An unknown leaf is not a page, so it gets the bare root (which hides the trail).
 * The static 404 is prerendered at `/_not-found` but hydrates at the visitor's
 * URL; naming either path here would make server and client text disagree.
 */
export function resolveTrail(pathname: string, labels: Record<string, string>): Crumb[] {
	const root: Crumb = { label: labels["/"] ?? "Home", href: "/" };
	if (pathname === "/") {
		return [root];
	}

	const trail: Crumb[] = [root];
	const segments = pathname.split("/").filter(Boolean);
	let acc = "";
	for (const [i, seg] of segments.entries()) {
		const parent = acc;
		acc += `/${seg}`;
		const label = labels[acc];
		if (i === segments.length - 1) {
			const leaf = label ?? LEAF_LABELS[parent];
			if (!leaf) {
				return [root];
			}
			trail.push({ label: leaf, href: acc });
		} else if (label) {
			trail.push({ label, href: acc });
		}
	}
	return dedupe(trail);
}
