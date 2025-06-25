"use client";

import * as React from "react";
import { Link } from "@/components/ui/link";
import { usePathname } from "next/navigation";
import { Menu, X, SunMoon, Contrast, ChevronDown, Code, Wrench, Palette, TrendingUp, MapPin, Phone, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { customFont } from "@/lib/fonts";
import { useTheme } from "next-themes";
import CodedText from "@/components/ui/coded-text";

const plumbingServicesLinks = [
	{
		name: "Wade's Plumbing & Septic (Santa Cruz, CA)",
		href: "/plumbing-santa-cruz",
		description: "Professional plumbing services in Santa Cruz",
		icon: MapPin,
	},
	{
		name: "Virtual Consultations",
		href: "/virtual-plumbing",
		description: "Expert plumbing advice online",
		icon: Phone,
	},
	{
		name: "Our Work",
		href: "/our-work",
		description: "See our completed plumbing projects",
		icon: Wrench,
	},
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

	const isPortfolioPage = pathname.startsWith("/portfolio");
	const headerClasses = cn(
		"sticky top-0 left-0 right-0 z-50 transition-all duration-300",
		{
			"border-b border-border/50 backdrop-blur-xl bg-background/80": isPortfolioPage || isScrolled,
			"bg-transparent": !isScrolled,
		},
		className
	);

	return (
		<header role="banner" aria-label="Site header" className={headerClasses}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link prefetch={true} href="/" className="flex items-center space-x-3 group">
						<span className={`text-2xl lg:text-3xl font-bold ${customFont.className} hover:text-yellow-400 transition-colors duration-300`}>Byron Wade</span>
					</Link>

					<nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-1">
						<Button asChild variant="ghost" className="text-sm font-medium px-4 py-2 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 rounded-lg">
							<Link prefetch={true} href="/tools">
								<Code className="w-4 h-4 mr-2" />
								<CodedText>Tools</CodedText>
							</Link>
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="text-sm font-medium px-4 py-2 hover:text-yellow-400 hover:bg-yellow-400/10 data-[state=open]:text-yellow-400 data-[state=open]:bg-yellow-400/10 transition-all duration-300 rounded-lg">
									<Wrench className="w-4 h-4 mr-2" />
									<CodedText>Plumbing Services</CodedText>
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="center" className="w-80 p-2 bg-background/95 backdrop-blur-xl border border-border/50">
								<div className="px-3 py-2 mb-2">
									<h3 className="font-semibold text-foreground mb-1">Plumbing Solutions</h3>
									<p className="text-xs text-muted-foreground">Professional plumbing services and consultations</p>
								</div>
								<DropdownMenuSeparator />
								{plumbingServicesLinks.map((item) => (
									<DropdownMenuItem key={item.name} asChild className="p-0">
										<Link prefetch={true} href={item.href} className="flex items-start gap-3 p-3 rounded-md hover:bg-yellow-400/10 transition-colors duration-200">
											<div className="p-2 bg-yellow-400/10 rounded-lg mt-0.5">
												<item.icon className="w-4 h-4 text-yellow-600" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="font-medium text-foreground text-sm">{item.name}</div>
												<div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
											</div>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					<div className="flex items-center space-x-3">
						<Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-secondary/80 hover:text-yellow-400 transition-all duration-300 rounded-lg">
							<ThemeIcon />
							<span className="sr-only">Toggle theme</span>
						</Button>

						<Button variant="ghost" size="icon" className="lg:hidden hover:bg-secondary/80 transition-all duration-300 rounded-lg" onClick={toggleMobileMenu}>
							{isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
							<span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
						</Button>

						<div className="hidden lg:flex items-center space-x-3">
							<Button asChild variant="outline" className="border-border/50 hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-300 rounded-lg">
								<Link prefetch={true} href="/resume">
									<Users className="w-4 h-4 mr-2" />
									<CodedText>My Resume</CodedText>
								</Link>
							</Button>
							<Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl">
								<Link prefetch={true} href="/work-with-me">
									<Calendar className="w-4 h-4 mr-2" />
									<CodedText>Work With Me</CodedText>
								</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="lg:hidden border-t border-border/50 mt-2 pt-4 pb-4 bg-background/95 backdrop-blur-xl">
						<div className="space-y-2">
							<Button asChild variant="ghost" className="w-full justify-start text-left hover:bg-yellow-400/10 hover:text-yellow-400 transition-all duration-300">
								<Link prefetch={true} href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
									<Code className="w-4 h-4 mr-3" />
									Tools
								</Link>
							</Button>

							<div className="px-3 py-2">
								<p className="text-sm font-medium text-muted-foreground mb-2">Plumbing Services</p>
								<div className="space-y-1 ml-4">
									{plumbingServicesLinks.map((item) => (
										<Button key={item.name} asChild variant="ghost" className="w-full justify-start text-left text-sm hover:bg-yellow-400/10 hover:text-yellow-400 transition-all duration-300">
											<Link prefetch={true} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
												<item.icon className="w-4 h-4 mr-3" />
												{item.name}
											</Link>
										</Button>
									))}
								</div>
							</div>

							<div className="border-t border-border/50 pt-4 mt-4 space-y-2">
								<Button asChild variant="outline" className="w-full justify-start border-border/50 hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-300">
									<Link prefetch={true} href="/resume" onClick={() => setIsMobileMenuOpen(false)}>
										<Users className="w-4 h-4 mr-3" />
										My Resume
									</Link>
								</Button>
								<Button asChild className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-all duration-300">
									<Link prefetch={true} href="/work-with-me" onClick={() => setIsMobileMenuOpen(false)}>
										<Calendar className="w-4 h-4 mr-3" />
										Work With Me
									</Link>
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}