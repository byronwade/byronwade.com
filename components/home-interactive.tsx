"use client";

import { customFont } from "@/lib/fonts";
import { Check, Github, Globe, Linkedin, Mail, Moon, Sun, Twitter } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeInteractive() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [copiedButton, setCopiedButton] = useState<string | null>(null);
	const email = "byron@byronwade.com";

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		if (theme === "system") {
			setTheme("light");
		} else if (theme === "light") {
			setTheme("dark");
		} else {
			setTheme("system");
		}
	};

	const copyEmail = async (buttonId: string) => {
		try {
			await navigator.clipboard.writeText(email);
			setCopiedButton(buttonId);
			setTimeout(() => setCopiedButton(null), 2000);
		} catch (err) {
			console.error("Failed to copy email:", err);
		}
	};

	return (
		<>
			{/* Header Section */}
			<div className="animate-in w-full">
				<div className="flex flex-col gap-6 items-start w-full">
					{/* Profile Picture with enhanced styling */}
					<Link
						className="group flex items-center justify-start w-full touch-target"
						aria-label="Go to home"
						href="/"
					>
						<div className="relative">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent blur-xl group-hover:blur-2xl transition-all duration-500" />
							<div className="relative rounded-full size-16 sm:size-20 md:size-24 ring-2 ring-yellow-600/20 dark:ring-yellow-500/30 group-hover:ring-yellow-600/40 dark:group-hover:ring-yellow-500/50 transition-all duration-300 overflow-hidden profile-hover">
								<Image
									alt="Byron Wade - Full Stack Developer and Web Performance Expert"
									className="object-cover rounded-full size-full"
									src="/avatar.avif"
									width={96}
									height={96}
									loading="eager"
									priority
								/>
							</div>
						</div>
					</Link>

					{/* Name with signature font - enhanced */}
					<div className="flex flex-col gap-3 sm:gap-4 w-full">
						<Link
							className="group flex items-center gap-2 w-full touch-target"
							aria-label="Byron Wade home"
							href="/"
						>
							<h1
								className={`${customFont.className} text-2xl sm:text-3xl font-medium leading-tight text-[var(--foreground)] group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300 mobile-text`}
							>
								Byron Wade
							</h1>
						</Link>

						{/* Navigation - enhanced */}
						<nav
							className="flex flex-wrap gap-4 sm:gap-6 items-center"
							aria-label="Main navigation"
						>
							<Link
								href="/projects"
								className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
							>
								Projects
							</Link>
							<Link
								href="/blog"
								className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
							>
								Blog
							</Link>
							<Link
								href="/resume"
								className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 touch-target py-1"
							>
								Resume
							</Link>
							<button
								type="button"
								onClick={() => copyEmail("nav")}
								className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200 cursor-pointer bg-transparent border-none p-1 button-press focus-ring touch-target"
								aria-label="Copy email to clipboard"
							>
								<span className={copiedButton === "nav" ? "bounce-subtle" : ""}>
									{copiedButton === "nav" ? "Copied!" : "Contact"}
								</span>
							</button>
							<div className="group/tooltip relative inline-block">
								<button
									type="button"
									className="relative cursor-pointer bg-transparent border-none p-2 sm:p-1.5 rounded-md transition-all duration-200 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 theme-toggle button-press focus-ring touch-target"
									aria-label={
										mounted
											? resolvedTheme === "dark"
												? "Switch to system mode"
												: resolvedTheme === "light"
													? "Switch to dark mode"
													: "Switch to light mode"
											: "Toggle theme"
									}
									onClick={toggleTheme}
								>
									<div className="size-5 sm:size-4">
										{mounted && resolvedTheme === "dark" ? (
											<Sun className="block size-full" />
										) : (
											<Moon className="block size-full" />
										)}
									</div>
								</button>
								<div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
									{mounted
										? resolvedTheme === "dark"
											? "Use System"
											: resolvedTheme === "light"
												? "Go Dark"
												: "Go Light"
										: "Toggle theme"}
									<div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--foreground)]" />
								</div>
							</div>
						</nav>
					</div>
				</div>
			</div>

			{/* Main Content - enhanced typography and spacing */}
			<div className="font-normal min-w-full relative shrink-0 text-[var(--foreground)] text-base flex flex-col gap-5">
				<p className="leading-relaxed relative animate-in animate-delay-1">
					I'm a full stack developer and designer based in Jasper, Georgia. I grew a plumbing
					company to <span className="text-green-600 dark:text-green-500 font-semibold">$2.4M</span>{" "}
					in revenue during my second year of business in Santa Cruz, California, before moving to
					Georgia due to some complications.
				</p>

				<p className="leading-relaxed animate-in animate-delay-2">
					I'm currently working on{" "}
					<a
						href="https://thorbis.com"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						Thorbis
					</a>
					, a field management system for service professionals. Built with modern JavaScript
					frameworks like{" "}
					<a
						href="https://nextjs.org"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						Next.js
					</a>{" "}
					and{" "}
					<a
						href="https://react.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						React
					</a>
					, it bridges the gap between field work and digital management.
				</p>

				<p className="leading-relaxed animate-in animate-delay-3">
					My experience scaling a service business from the ground up gives me unique insight into
					the challenges service professionals face daily. I'm building tools that solve real
					problems I've encountered firsthand.
				</p>

				<p className="leading-relaxed animate-in animate-delay-4">
					Always open to interesting conversations about development, design, and building software
					for service businesses.{" "}
					<button
						type="button"
						onClick={() => copyEmail("say-hello")}
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-base"
						aria-label="Copy email to clipboard"
					>
						<span className={copiedButton === "say-hello" ? "bounce-subtle" : ""}>
							{copiedButton === "say-hello" ? "Copied!" : "Say hello"}
						</span>
					</button>{" "}
					or follow me on{" "}
					<a
						href="https://github.com/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						GitHub
					</a>
					,{" "}
					<a
						href="https://linkedin.com/in/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						LinkedIn
					</a>
					, or{" "}
					<a
						href="https://twitter.com/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
					>
						X
					</a>
					.
				</p>
			</div>

			{/* Social Links - new section */}
			<div className="animate-in animate-delay-7 w-full">
				<div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center py-4 sm:py-6">
					<a
						href="https://github.com/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/30 hover:border-yellow-300/50 dark:hover:border-yellow-700/40 transition-all duration-300 social-button focus-ring touch-target"
						aria-label="GitHub"
					>
						<Github className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors" />
						<span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 transition-colors">
							GitHub
						</span>
					</a>
					<a
						href="https://linkedin.com/in/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/30 hover:border-yellow-300/50 dark:hover:border-yellow-700/40 transition-all duration-300 social-button focus-ring touch-target"
						aria-label="LinkedIn"
					>
						<Linkedin className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors" />
						<span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 transition-colors">
							LinkedIn
						</span>
					</a>
					<a
						href="https://twitter.com/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/30 hover:border-yellow-300/50 dark:hover:border-yellow-700/40 transition-all duration-300 social-button focus-ring touch-target"
						aria-label="X (Twitter)"
					>
						<Twitter className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors" />
						<span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 transition-colors">
							X
						</span>
					</a>
					<button
						type="button"
						onClick={() => copyEmail("social")}
						className="group flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/30 hover:border-yellow-300/50 dark:hover:border-yellow-700/40 transition-all duration-300 cursor-pointer social-button button-press focus-ring touch-target"
						aria-label="Copy email to clipboard"
					>
						{copiedButton === "social" ? (
							<Check className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors bounce-subtle" />
						) : (
							<Mail className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors" />
						)}
						<span
							className={`text-xs font-medium text-yellow-700 dark:text-yellow-400 transition-colors ${copiedButton === "social" ? "bounce-subtle" : ""}`}
						>
							{copiedButton === "social" ? "Copied!" : "Email"}
						</span>
					</button>
					<a
						href="https://thorbis.com"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/30 hover:border-yellow-300/50 dark:hover:border-yellow-700/40 transition-all duration-300 social-button focus-ring touch-target"
						aria-label="Thorbis"
					>
						<Globe className="size-3 text-yellow-700 dark:text-yellow-400 transition-colors" />
						<span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 transition-colors">
							Thorbis
						</span>
					</a>
				</div>
			</div>
		</>
	);
}
