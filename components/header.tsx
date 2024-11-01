"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
	{ name: "Design", href: "/design" },
	{ name: "Development", href: "/development" },
	{ name: "Marketing", href: "/marketing" },
	{ name: "Tools", href: "/tools" },
	{ name: "Shop", href: "/shop" },
];

const ANIMATION_DURATION = 500; // Animation duration in milliseconds
const EXTRA_WIDTH = 10; // Extra width in pixels to add to each menu item

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

	React.useEffect(() => {
		const elements = document.querySelectorAll(".codedText");
		elements.forEach((element) => {
			element.addEventListener("mouseenter", handleMouseEnter);
			element.addEventListener("mouseleave", handleMouseLeave);
		});

		// Set initial widths
		setFixedWidths();

		return () => {
			elements.forEach((element) => {
				element.removeEventListener("mouseenter", handleMouseEnter);
				element.removeEventListener("mouseleave", handleMouseLeave);
			});
		};
	}, []);

	const setFixedWidths = () => {
		const elements = document.querySelectorAll(".codedText");
		elements.forEach((element) => {
			const text = element.textContent || "";
			const tempSpan = document.createElement("span");
			tempSpan.style.visibility = "hidden";
			tempSpan.style.position = "absolute";
			tempSpan.style.whiteSpace = "nowrap";
			tempSpan.textContent = text;
			document.body.appendChild(tempSpan);
			const width = tempSpan.offsetWidth;
			document.body.removeChild(tempSpan);

			const el = element as HTMLElement;
			el.style.width = `${width + EXTRA_WIDTH}px`;
			el.style.display = "inline-flex";
			el.style.justifyContent = "center";
			el.style.alignItems = "center";
		});
	};

	const handleMouseEnter = (event: Event) => {
		const target = event.target as HTMLElement;
		const text = target.dataset.originalText || "";
		const startTime = performance.now();

		clearInterval(target.dataset.interval as unknown as number);

		target.dataset.interval = setInterval(() => {
			const elapsedTime = performance.now() - startTime;
			const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

			target.innerText = text
				.split("")
				.map((letter, index) => {
					if (index < text.length * progress) {
						return text[index];
					}
					if (letter.match(/[a-zA-Z0-9]/)) {
						return String.fromCharCode(65 + Math.floor(Math.random() * 26));
					}
					return letter;
				})
				.join("");

			if (progress >= 1) {
				clearInterval(target.dataset.interval as unknown as number);
			}
		}, 16) as unknown as string; // Run at approximately 60fps
	};

	const handleMouseLeave = (event: Event) => {
		const target = event.target as HTMLElement;
		clearInterval(target.dataset.interval as unknown as number);
		target.innerText = target.dataset.originalText || target.innerText;
	};

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
						{navItems.map((item) => (
							<Link key={item.name} href={item.href} className={cn("codedText text-sm font-medium transition-colors px-3 py-2", pathname.startsWith(item.href) ? "text-gold-400" : "text-white hover:text-gold-400")} data-original-text={item.name}>
								{item.name}
							</Link>
						))}
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
							<Link href="/contact">Work with me</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-black">
					<nav className="px-4 pt-2 pb-4 space-y-2">
						{navItems.map((item) => (
							<Link key={item.name} href={item.href} className={cn("codedText block py-2 text-sm font-medium transition-colors", pathname.startsWith(item.href) ? "text-gold-400" : "text-white hover:text-gold-400")} onClick={() => setIsMobileMenuOpen(false)} data-original-text={item.name}>
								{item.name}
							</Link>
						))}
						<Link href="/contact" className="block py-2 text-sm font-medium text-white hover:text-gold-400" onClick={() => setIsMobileMenuOpen(false)}>
							Work with me
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
