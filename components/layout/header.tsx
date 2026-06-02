"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ThemeToggle } from "@/components/common";
import { Button } from "@/components/ui/button";
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
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header className="sticky top-0 z-50 w-full px-4 pt-3 sm:pt-4 print:hidden">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-border bg-background/80 px-2.5 py-2 shadow-card backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
				<Link
					href="/"
					aria-label="Byron Wade — home"
					className={cn(
						customFont.className,
						"shrink-0 rounded-full px-2 text-2xl leading-none text-foreground transition-colors hover:text-brand"
					)}
				>
					Byron Wade
				</Link>

				<nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							aria-current={isActive(link.href) ? "page" : undefined}
							className={cn(
								"rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
								isActive(link.href)
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:bg-brand/5 hover:text-foreground"
							)}
						>
							{link.name}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-1">
					<ThemeToggle />
					<Button render={<Link href="/contact" />} size="sm" className="hidden sm:inline-flex">
						Get in touch
					</Button>
					<button
						type="button"
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen((v) => !v)}
						className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
					>
						{isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
					</button>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-border bg-background/95 p-2 shadow-float backdrop-blur-xl md:hidden">
					<nav aria-label="Mobile" className="flex flex-col gap-0.5">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className={cn(
									"rounded-xl px-3 py-2.5 text-base font-medium transition-colors",
									isActive(link.href)
										? "bg-muted text-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								)}
							>
								{link.name}
							</Link>
						))}
						<Button
							render={<Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} />}
							className="mt-1 w-full"
						>
							Get in touch
						</Button>
					</nav>
				</div>
			)}
		</header>
	);
}
