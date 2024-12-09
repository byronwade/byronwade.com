"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, SunMoon, Contrast, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { customFont } from "@/lib/fonts";
import { useTheme } from "next-themes";

// Dynamically import and memoize the CodedText component
const CodedText = dynamic(() => import("@/components/ui/coded-text"));

const navItems = [
	{ name: "Design", href: "/design" },
	{ name: "Development", href: "/development" },
	{ name: "Marketing", href: "/marketing" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Analysis", href: "/analysis" },
	{ name: "Blog", href: "/blog" },
	{ name: "Shop", href: "/shop" },
];

export default function Navbar({ className }: { className?: string }) {
	const [isScrolled, setIsScrolled] = React.useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// Move theme icon rendering to a separate component
	const ThemeIcon = () => {
		const mounted = React.useRef(false);
		const [icon, setIcon] = React.useState<React.ReactNode>(<Contrast className="h-4 w-4" />);

		React.useEffect(() => {
			mounted.current = true;
			const currentTheme = theme;
			setIcon(currentTheme === "light" ? <Contrast className="h-4 w-4" /> : <SunMoon className="h-4 w-4" />);
		}, []);

		if (!mounted.current) {
			return <Contrast className="h-4 w-4" />;
		}

		return icon;
	};

	return (
		<header className={cn("sticky top-0 left-0 right-0 z-50 transition-all duration-200", isScrolled ? "bg-zinc-50 dark:bg-black border-b-4 border-zinc-100 dark:border-zinc-800" : "bg-transparent", className)}>
			<div className="px-4">
				<div className="flex items-center justify-between h-16">
					<Link prefetch={true} href="/" className="flex items-center space-x-3">
						<span className={`text-3xl font-bold ${customFont.className} hover:text-yellow-400 hover:underline`}>Byron Wade</span>
					</Link>

					<nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-4">
						{navItems.map((item) => (
							<Link prefetch={true} key={item.name} href={item.href} className={cn("text-sm font-medium transition-colors px-3 py-2", pathname.startsWith(item.href) ? "text-yellow-400 underline" : "hover:text-yellow-400")}>
								<CodedText>{item.name}</CodedText>
							</Link>
						))}
					</nav>

					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-neutral-200 dark:hover:bg-neutral-900">
							<ThemeIcon />
							<span className="sr-only">Toggle theme</span>
						</Button>

						<Button variant="ghost" size="icon" className="hover:bg-neutral-200 dark:hover:bg-neutral-900">
							<ShoppingCart className="h-4 w-4" />
							<span className="sr-only">Cart</span>
						</Button>

						<Button variant="ghost" size="icon" className="lg:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800" onClick={toggleMobileMenu}>
							{isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
							<span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
						</Button>

						<Button asChild variant="default" className="bg-black text-white dark:bg-zinc-50 dark:text-black hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-400 dark:hover:text-black">
							<Link prefetch={true} href="/contact">
								<CodedText>Work with me</CodedText>
							</Link>
						</Button>
					</div>
				</div>
			</div>
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-zinc-50 dark:bg-black">
					<nav className="px-4 pt-2 pb-4 space-y-2">
						{navItems.map((item) => (
							<Link prefetch={true} key={item.name} href={item.href} className={cn("block py-2 text-sm font-medium transition-colors", pathname.startsWith(item.href) ? "text-yellow-400" : "hover:text-yellow-400")} onClick={() => setIsMobileMenuOpen(false)}>
								{item.name}
							</Link>
						))}
						<Link prefetch={true} href="/contact" className="block py-2 text-sm font-medium hover:text-yellow-400" onClick={() => setIsMobileMenuOpen(false)}>
							Work with me
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}