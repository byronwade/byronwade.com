"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/common";
import { Link } from "@/components/ui/link";
import { customFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const navLinks = [
	{ name: "Projects", href: "/projects" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Blog", href: "/blog" },
	{ name: "Resume", href: "/resume" },
];

export default function Header() {
	const [isScrolled, setIsScrolled] = React.useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();

	React.useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 8);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-colors duration-300",
				isScrolled
					? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
					: "border-b border-transparent bg-transparent"
			)}
		>
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					href="/"
					aria-label="Byron Wade — home"
					className={cn(
						customFont.className,
						"text-2xl leading-none text-foreground transition-colors hover:text-accent focus-ring rounded-sm"
					)}
				>
					Byron Wade
				</Link>

				<nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"rounded-md px-3 py-2 text-sm font-medium transition-colors focus-ring",
								isActive(link.href)
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							{link.name}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1.5">
					<ThemeToggle />
					<Link
						href="/contact"
						className="hidden rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-ring sm:inline-flex"
					>
						Get in touch
					</Link>
					<button
						type="button"
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen((v) => !v)}
						className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring md:hidden"
					>
						{isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
					</button>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
					<nav
						aria-label="Mobile"
						className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4 sm:px-6"
					>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									"rounded-md px-3 py-2.5 text-base font-medium transition-colors focus-ring",
									isActive(link.href)
										? "bg-muted text-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								)}
							>
								{link.name}
							</Link>
						))}
						<Link
							href="/contact"
							onClick={() => setIsMobileMenuOpen(false)}
							className="mt-2 rounded-md bg-foreground px-3 py-2.5 text-center text-base font-medium text-background transition-opacity hover:opacity-90 focus-ring"
						>
							Get in touch
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
