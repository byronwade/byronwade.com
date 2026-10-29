import { Orbit } from "@/components/common/orbit";
import { ledeClass, pageTitleClass } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

/**
 * 404. Shared profile, the Thorbis not-found grammar: say what is missing,
 * then offer the places a visitor most likely meant, start-aligned on the
 * page edge like every other route. The one figure is the space theme's
 * Orbit, beside the copy and never under it. No gradient numeral or
 * viewport-height spacer.
 */
export default function NotFound() {
	return (
		<SiteShell profile="shared">
			<div className="flex flex-col gap-3 sm:pt-8">
				<Orbit className="mb-2 size-24" />
				<p className="font-mono text-copy-13 text-muted-foreground tabular-nums">404</p>
				<h1 className={pageTitleClass}>Page not found</h1>
				<p className={ledeClass}>
					This page has drifted out of orbit. The URL doesn&rsquo;t exist, or the page that lived
					here has moved. The rest of the site is fine: start at the homepage, read the{" "}
					<Link className="link-underline" href="/blog">
						writing
					</Link>
					, or{" "}
					<Link className="link-underline" href="/search">
						search for it
					</Link>
					.
				</p>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3">
					{/* The commit recipe on the shared link, not the Base UI Button: Next sends
					    this boundary in every page's payload, so a Button here made the Figma
					    file page download the /portfolio page chunk (docs/PERFORMANCE.md). */}
					<Link className={cn(buttonVariants())} href="/">
						Return home
					</Link>
					<Link className="link-action" href="/projects">
						See selected work
					</Link>
				</div>
			</div>
		</SiteShell>
	);
}
