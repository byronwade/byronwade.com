/** Primary destinations shared by the header and footer. */
interface NavItem {
	description: string;
	href: string;
	label: string;
	/** Custom active matcher; defaults to exact / prefix match on `href`. */
	match?: (pathname: string) => boolean;
}

export const navItems = [
	{ label: "Home", href: "/", description: "Who I am and what I do", match: (p) => p === "/" },
	{ label: "Projects", href: "/projects", description: "Work and case studies" },
	{ label: "Portfolio", href: "/portfolio", description: "Code, design and experiments" },
	{ label: "Blog", href: "/blog", description: "Writing on products and business" },
	{ label: "Resume", href: "/resume", description: "Experience and background" },
] as const satisfies readonly NavItem[];

export function isActive(item: NavItem, pathname: string): boolean {
	if (item.match) {
		return item.match(pathname);
	}
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
