import { FileText, FolderGit2, Home, type IconComponent, LayoutGrid, PenLine } from "@/lib/icons";

/** Primary destinations surfaced in the floating nav dock. */
export interface NavItem {
	href: string;
	icon: IconComponent;
	label: string;
	/** Custom active matcher; defaults to exact / prefix match on `href`. */
	match?: (pathname: string) => boolean;
}

export const navItems: NavItem[] = [
	{ label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
	{ label: "Projects", href: "/projects", icon: FolderGit2 },
	{ label: "Portfolio", href: "/portfolio", icon: LayoutGrid },
	{ label: "Blog", href: "/blog", icon: PenLine },
	{ label: "Resume", href: "/resume", icon: FileText },
];

export function isActive(item: NavItem, pathname: string): boolean {
	if (item.match) {
		return item.match(pathname);
	}
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
