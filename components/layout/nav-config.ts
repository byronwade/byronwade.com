import {
	FileText,
	FolderGit2,
	Home,
	LayoutGrid,
	type LucideIcon,
	Mail,
	PenLine,
} from "lucide-react";

/** A destination in the floating header (and its mobile panel). */
export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	/** Custom active matcher; defaults to exact / prefix match on `href`. */
	match?: (pathname: string) => boolean;
}

/** Home lives on the wordmark, so it is only surfaced in the mobile panel. */
export const homeItem: NavItem = { label: "Home", href: "/", icon: Home, match: (p) => p === "/" };

/** Primary destinations: the centred row in the header island. */
export const navItems: NavItem[] = [
	{ label: "Projects", href: "/projects", icon: FolderGit2 },
	{ label: "Portfolio", href: "/portfolio", icon: LayoutGrid },
	{ label: "Blog", href: "/blog", icon: PenLine },
	{ label: "Resume", href: "/resume", icon: FileText },
];

/** The one call to action, rendered as a distinct button, not a nav link. */
export const contactItem: NavItem = { label: "Contact", href: "/contact", icon: Mail };

/** Full list for the mobile panel, where everything is one flat menu. */
export const mobileNavItems: NavItem[] = [homeItem, ...navItems, contactItem];

export function isActive(item: NavItem, pathname: string): boolean {
	if (item.match) return item.match(pathname);
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
