import { SiteShell } from "@/components/layout/site-shell";
import { buttonVariants } from "@/components/ui/button";

/**
 * The one failure surface (DESIGN.md §8): what failed, what is still safe, and
 * the next move. Used by the route error boundary and by the root boundary
 * when the shell itself could not render.
 */
export function ErrorNotice({
	title,
	description,
	reference,
	onRetry,
}: {
	title: string;
	description: string;
	/** Server error digest, so a report can be matched to a log line. */
	reference?: string;
	onRetry: () => void;
}) {
	return (
		<SiteShell profile="shared">
			<div className="flex flex-col gap-3" role="alert">
				<h1 className="text-balance font-medium text-heading-32 tracking-tight">{title}</h1>
				<p className="text-body text-copy-16 leading-relaxed">{description}</p>
				{reference && (
					<p className="font-mono text-copy-12 text-muted-foreground">Reference {reference}</p>
				)}
				<p className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3">
					{/* A native button with the commit recipe: Next loads this boundary on
					    every route, so it stays off the Base UI button code. */}
					<button className={buttonVariants()} onClick={onRetry} type="button">
						Try again
					</button>
					{/* A full navigation, so a broken client bundle cannot trap the visitor. */}
					<a className="link-action" href="/">
						Go to the homepage
					</a>
				</p>
			</div>
		</SiteShell>
	);
}
