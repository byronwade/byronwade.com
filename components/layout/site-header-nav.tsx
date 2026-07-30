"use client";

import {
	ArrowRight,
	Code2,
	FileText,
	FolderGit2,
	Github,
	Globe,
	LayoutGrid,
	Mail,
	Menu,
	PenLine,
	Search,
	Sparkles,
	Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ComponentType, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	aboutNavLinks,
	type MegaNavItem,
	midNavLinks,
	workMegaHighlights,
	workNavLinks,
} from "@/lib/navigation";
import { openSiteSearch } from "@/lib/search-events";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const SiteHeaderMobileMenu = dynamic(
	() =>
		import("@/components/layout/site-header-mobile-menu").then((mod) => mod.SiteHeaderMobileMenu),
	{ ssr: false }
);

const megaIcons: Record<MegaNavItem["icon"], ComponentType<{ className?: string }>> = {
	folder: FolderGit2,
	layout: LayoutGrid,
	pen: PenLine,
	file: FileText,
	mail: Mail,
	github: Github,
	globe: Globe,
	spark: Sparkles,
	code: Code2,
	users: Users,
};

const triggerClassName =
	"bg-transparent text-white hover:bg-transparent hover:text-primary-bright focus:bg-transparent focus:text-primary-bright data-[active]:bg-transparent data-[active]:text-primary-bright data-[state=open]:bg-transparent data-[state=open]:text-primary-bright";

function MegaLink({ href, label, description, icon }: MegaNavItem) {
	const Icon = megaIcons[icon];
	const external = href.startsWith("http");

	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					className="group relative flex items-start gap-3.5 rounded-lg p-3 outline-none transition-colors hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
					href={href}
					prefetch={!external}
					{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
				>
					<span className="surface-raised grid size-9 shrink-0 place-items-center rounded-md text-primary-bright transition-colors group-hover:bg-[color-mix(in_srgb,var(--primary)_30%,var(--dark-3))]">
						<Icon className="size-[1.125rem]" aria-hidden="true" />
					</span>
					<span className="min-w-0">
						<span className="block text-sm font-bold tracking-[-0.01em] text-white transition-colors group-hover:text-primary-bright">
							{label}
						</span>
						{description ? (
							<span className="mt-1 block text-[0.8125rem] leading-snug text-on-dark-subtle">
								{description}
							</span>
						) : null}
					</span>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

function MegaFooter({ action, actionLabel }: { action: string; actionLabel: string }) {
	return (
		<div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
			<p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] tracking-[0.08em] text-on-dark-subtle uppercase">
				<span>{siteConfig.location}</span>
				<span>{siteConfig.availability}</span>
			</p>
			<div className="flex shrink-0 items-center gap-2">
				<NavigationMenuLink asChild>
					<a
						className={buttonVariants({ variant: "default", size: "sm" })}
						href={siteConfig.social.github}
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
						<Github aria-hidden="true" />
					</a>
				</NavigationMenuLink>
				<NavigationMenuLink asChild>
					<Link
						className={buttonVariants({ variant: "inverse", size: "sm" })}
						href={action}
						prefetch
					>
						{actionLabel}
						<ArrowRight aria-hidden="true" />
					</Link>
				</NavigationMenuLink>
			</div>
		</div>
	);
}

function WorkMegaMenu() {
	return (
		<div className="container-shell py-7 lg:py-8">
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
				<div>
					<p className="spec-label mb-3">Browse work</p>
					<ul className="grid gap-0.5 sm:grid-cols-2">
						{workNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
				</div>

				<div className="rounded-lg bg-black/20 p-3 lg:p-4">
					<p className="spec-label mb-3 px-1">Featured</p>
					<ul className="space-y-0.5">
						{workMegaHighlights.map((item) => (
							<li key={item.href}>
								<NavigationMenuLink asChild>
									<Link
										className="group block rounded-md p-2.5 outline-none transition-colors hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
										href={item.href}
										prefetch
									>
										<span className="flex items-center justify-between gap-3 text-sm font-bold tracking-[-0.01em] text-white transition-colors group-hover:text-primary-bright">
											{item.label}
											<ArrowRight
												aria-hidden="true"
												className="size-4 shrink-0 -translate-x-1 text-primary-bright opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
											/>
										</span>
										<span className="mt-1 block text-[0.8125rem] leading-snug text-on-dark-subtle">
											{item.description}
										</span>
									</Link>
								</NavigationMenuLink>
							</li>
						))}
					</ul>
				</div>
			</div>

			<MegaFooter action="/projects" actionLabel="All projects" />
		</div>
	);
}

function AboutMegaMenu() {
	return (
		<div className="container-shell py-7 lg:py-8">
			<div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
				<div>
					<p className="spec-label mb-3">About</p>
					<ul className="grid gap-0.5 sm:grid-cols-2">
						{aboutNavLinks.map((item) => (
							<MegaLink key={item.href} {...item} />
						))}
					</ul>
				</div>
				<div className="relative overflow-hidden rounded-lg bg-black/20 p-5 lg:p-6">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,color-mix(in_srgb,var(--primary)_35%,transparent),transparent_60%)]"
					/>
					<div className="relative">
						<p className="spec-label mb-3">Now building</p>
						<p className="font-display text-xl font-extrabold tracking-[-0.03em] text-white">
							Thorbis
						</p>
						<p className="mt-2 max-w-sm text-sm leading-relaxed text-on-dark-muted">
							Field management software for service professionals — real problems from the field,
							solved in code.
						</p>
						<a
							href={siteConfig.social.thorbis}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-bright transition-colors hover:text-white"
						>
							Visit thorbis.com
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>
			<MegaFooter action="/contact" actionLabel="Get in touch" />
		</div>
	);
}

export function SiteHeaderNav() {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			<nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
				<NavigationMenu>
					<NavigationMenuList>
						{midNavLinks.map((item) => (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuLink asChild>
									<Link
										href={item.href}
										prefetch
										className={cn(navigationMenuTriggerStyle(), triggerClassName)}
									>
										{item.label}
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}

						<NavigationMenuItem>
							<NavigationMenuTrigger className={triggerClassName}>Work</NavigationMenuTrigger>
							<NavigationMenuContent>
								<WorkMegaMenu />
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger className={triggerClassName}>About</NavigationMenuTrigger>
							<NavigationMenuContent>
								<AboutMegaMenu />
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<button
					type="button"
					onClick={() => openSiteSearch()}
					aria-label="Search (⌘K)"
					className="ml-1 inline-flex size-10 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-primary-bright focus-visible:ring-2 focus-visible:ring-ring"
				>
					<Search className="size-4" aria-hidden="true" />
				</button>

				<Link
					href="/contact"
					prefetch
					className={cn(buttonVariants({ variant: "default", size: "sm" }), "ml-1")}
				>
					Contact
				</Link>
			</nav>

			<div className="flex items-center gap-1 lg:hidden">
				<button
					type="button"
					onClick={() => openSiteSearch()}
					aria-label="Search"
					className="inline-flex size-10 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/10 hover:text-primary-bright"
				>
					<Search className="size-5" aria-hidden="true" />
				</button>
				<button
					type="button"
					onClick={() => setMobileOpen(true)}
					aria-label="Open menu"
					aria-expanded={mobileOpen}
					className="inline-flex size-10 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/10 hover:text-primary-bright"
				>
					<Menu className="size-5" aria-hidden="true" />
				</button>
			</div>

			{mobileOpen ? <SiteHeaderMobileMenu open={mobileOpen} onOpenChange={setMobileOpen} /> : null}
		</>
	);
}
