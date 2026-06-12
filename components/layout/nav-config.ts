import {
	FileText,
	Folder as FolderGit2,
	House as Home,
	type Icon as LucideIcon,
	PencilSimpleLine as PenLine,
} from "@/lib/icons";

/** Primary destinations surfaced in the floating nav dock. */
export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	/** Custom active matcher; defaults to exact / prefix match on `href`. */
	match?: (pathname: string) => boolean;
}

export const navItems: NavItem[] = [
	{ label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
	{ label: "Projects", href: "/projects", icon: FolderGit2 },
	{ label: "Blog", href: "/blog", icon: PenLine },
	{ label: "Resume", href: "/resume", icon: FileText },
];

export function isActive(item: NavItem, pathname: string): boolean {
	if (item.match) return item.match(pathname);
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
