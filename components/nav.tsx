"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Blog", href: "/blog" },
	{ name: "Analysis", href: "/analysis" },
	{ name: "Shop", href: "/shop" },
];

export function Navigation() {
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<nav className="flex space-x-4">
				<Link href="/" className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", pathname === "/" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
					Home
				</Link>
			</nav>
		);
	}

	return (
		<nav className="flex space-x-4">
			{navigation.map((item) => (
				<Link key={item.href} href={item.href} className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
					{item.name}
				</Link>
			))}
		</nav>
	);
}
