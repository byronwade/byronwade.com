import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

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
			<div className="flex flex-col gap-6 py-8 sm:py-12">
				<p className="font-mono text-muted-foreground text-sm tabular-nums">404</p>

				<PageHeader
					lede="This URL doesn’t exist, or the page that lived here has moved."
					title="Page not found"
				/>

				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Button render={<Link href="/" />} size="lg">
						Return home
					</Button>
					<Link
						className="link-underline inline-flex min-h-11 items-center text-sm"
						href="/projects"
					>
						See selected work
					</Link>
				</div>
			</div>
		</SiteShell>
	);
}
