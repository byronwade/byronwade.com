import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

/**
 * 404. Shared profile, the Thorbis not-found grammar: say what is missing,
 * then offer the places a visitor most likely meant, start-aligned on the
 * page edge like every other route. No gradient numeral, ornament, or
 * viewport-height spacer.
 */
export default function NotFound() {
	return (
		<SiteShell profile="shared">
			<div className="flex flex-col gap-3 sm:pt-8">
				<p className="font-mono text-copy-13 text-muted-foreground tabular-nums">404</p>
				<h1 className="text-balance font-heading font-medium text-heading-32 tracking-tight">
					Page not found
				</h1>
				<p className="text-body text-copy-16 leading-relaxed">
					This URL doesn&rsquo;t exist, or the page that lived here has moved. The rest of the site
					is fine: start at the homepage, read the{" "}
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
					<Button render={<Link href="/" />}>Return home</Button>
					<Link className="link-action" href="/projects">
						See selected work
					</Link>
				</div>
			</div>
		</SiteShell>
	);
}
