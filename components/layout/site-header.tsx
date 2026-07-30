import Image from "next/image";
import Link from "next/link";
import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 text-foreground backdrop-blur-2xl supports-backdrop-filter:bg-background/55">
			{/* Relative shell so mega-menu viewports span the full header width */}
			<div className="relative">
				<div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
					<Link
						className="flex min-w-0 items-center gap-2.5 sm:gap-3"
						href="/"
						aria-label={`${siteConfig.name} home`}
						prefetch
					>
						<span className="relative size-9 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/70 sm:size-10">
							<Image
								alt={`${siteConfig.name} portrait`}
								className="size-full object-cover"
								height={40}
								priority
								src="/avatar.avif"
								width={40}
							/>
						</span>
						<span className="leading-none">
							<span className="block truncate text-[0.9375rem] leading-tight font-medium tracking-[-0.02em] text-foreground sm:text-base">
								{siteConfig.name}
							</span>
							<span className="mt-1 block text-[0.6875rem] leading-none font-normal text-muted-foreground">
								{siteConfig.tagline}
							</span>
						</span>
					</Link>

					<SiteHeaderNav />
				</div>
			</div>
		</header>
	);
}
