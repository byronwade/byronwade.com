import Image from "next/image";
import Link from "next/link";
import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 bg-ink text-white shadow-[0_1px_0_0_rgba(0,0,0,0.45)]">
			<div className="hidden bg-ink-soft sm:block">
				<div className="container-shell flex items-center justify-between gap-4 py-2 text-xs font-bold text-on-dark-muted">
					<span>{siteConfig.tagline}</span>
					<span className="inline-flex items-center gap-2">
						<span className="size-1.5 rounded-full bg-primary-bright" aria-hidden="true" />
						{siteConfig.availability}
					</span>
				</div>
			</div>

			{/* Relative shell so mega-menu viewports span the full header width */}
			<div className="relative">
				<div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-[4.5rem]">
					<Link
						className="flex min-w-0 items-center gap-2.5 sm:gap-3"
						href="/"
						aria-label={`${siteConfig.name} home`}
						prefetch
					>
						<span className="relative size-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15 sm:size-11">
							<Image
								alt={`${siteConfig.name} portrait`}
								className="size-full object-cover"
								height={44}
								priority
								src="/avatar.avif"
								width={44}
							/>
						</span>
						<span className="leading-none">
							<span className="font-display block truncate text-[0.9375rem] leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-lg">
								{siteConfig.name}
							</span>
							<span className="mt-1 block font-mono text-[0.625rem] leading-none font-semibold tracking-[0.18em] text-primary-bright uppercase">
								Studio
							</span>
						</span>
					</Link>

					<SiteHeaderNav />
				</div>
			</div>
		</header>
	);
}
