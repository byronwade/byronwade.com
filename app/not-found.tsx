import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

/**
 * 404. Shared profile.
 *
 * Rebuilt to the same grammar as the rest of the site. The previous version used
 * gradient text on the numeral and a decorative rule-star-rule ornament, both of
 * which DESIGN.md §5.1 and §13 reject; it also centred everything while every
 * other page on the site is left-aligned to the shell edge.
 */
export default function NotFound() {
	return (
		<SiteShell>
			<div className="flex min-h-[60vh] flex-col justify-center gap-6">
				<p className="font-mono text-muted-foreground text-sm tabular-nums">404</p>

				<div className="flex flex-col gap-3">
					<h1 className="font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
						Page not found
					</h1>
					<p className="max-w-md text-muted-foreground leading-relaxed">
						This URL doesn&rsquo;t exist, or the page that lived here has moved.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-border border-t pt-6">
					<Button render={<Link href="/" />} size="lg" variant="outline">
						Return home
					</Button>
					<Link className="link-underline text-sm" href="/projects">
						See selected work
					</Link>
				</div>
			</div>
		</SiteShell>
	);
}
