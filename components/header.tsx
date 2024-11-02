"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CodedText } from "@/components/CodedText";

const navItems = [
	{ name: "Design", href: "/design" },
	{ name: "Development", href: "/development" },
	{ name: "Marketing", href: "/marketing" },
	{ name: "Tools", href: "/tools" },
	{ name: "Shop", href: "/shop" },
];

export default function Navbar() {
	const [isScrolled, setIsScrolled] = React.useState(false);
	const [theme, setTheme] = React.useState<"light" | "dark">("dark");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
		document.documentElement.classList.toggle("dark");
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header className={cn("sticky top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled ? "bg-black/50 backdrop-blur-sm" : "bg-transparent", "text-white")}>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="flex items-center space-x-3">
						<span className="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10">
							<img className="aspect-square h-full w-full" alt="Byron Wade" src="https://placehold.co/40x40" />
						</span>
						<span className="text-lg font-bold text-white">Byron Wade</span>
					</Link>

					<nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-4">
						{navItems.map((item, index) => {
							return (
								<Link key={item.name} href={item.href} className={cn("text-sm font-medium transition-colors px-3 py-2", pathname.startsWith(item.href) ? "text-gold-400" : "text-white hover:text-gold-400")}>
									<CodedText>{item.name}</CodedText>
								</Link>
							);
						})}
					</nav>

					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-white/10">
							{theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
							<span className="sr-only">Toggle theme</span>
						</Button>

						<Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={toggleMobileMenu}>
							{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
							<span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
						</Button>

						<Button asChild variant="default" className="bg-white text-black hover:bg-primary hover:text-white">
							<Link href="/contact">
								<CodedText>Work with me</CodedText>
							</Link>
						</Button>
					</div>
				</div>
			</div>
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-black">
					<nav className="px-4 pt-2 pb-4 space-y-2">
						{navItems.map((item) => {
							return (
								<Link key={item.name} href={item.href} className={cn("block py-2 text-sm font-medium transition-colors", pathname.startsWith(item.href) ? "text-gold-400" : "text-white hover:text-gold-400")} onClick={() => setIsMobileMenuOpen(false)}>
									{item.name}
								</Link>
							);
						})}
						<Link href="/contact" className="block py-2 text-sm font-medium text-white hover:text-gold-400" onClick={() => setIsMobileMenuOpen(false)}>
							Work with me
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
