/** Primary destinations shared by the header and footer. */
interface NavItem {
	href: string;
	label: string;
	/** Custom active matcher; defaults to exact / prefix match on `href`. */
	match?: (pathname: string) => boolean;
}

export const navItems: NavItem[] = [
	{ label: "Home", href: "/", match: (p) => p === "/" },
	{ label: "Projects", href: "/projects" },
	{ label: "Portfolio", href: "/portfolio" },
	{ label: "Blog", href: "/blog" },
	{ label: "Resume", href: "/resume" },
];

export function isActive(item: NavItem, pathname: string): boolean {
	if (item.match) {
		return item.match(pathname);
	}
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
