import { SiteShell } from "@/components/layout/site-shell";

/**
 * The Figma detail is the one route rendered on request from a third-party
 * API, so it can be slow. This mirrors the loaded page's identity block and
 * sheet so nothing jumps when the file arrives, and says what is happening.
 */
export default function FigmaDetailLoading() {
	return (
		<SiteShell profile="evidence" width="wide">
			<div aria-busy="true" className="flex animate-pulse flex-col gap-12">
				<p className="sr-only" role="status">
					Loading the design file from Figma…
				</p>
				<div className="flex max-w-2xl flex-col gap-3">
					<div className="h-4 w-32 rounded-sm bg-muted" />
					<div className="h-9 w-3/4 rounded-sm bg-muted" />
					<div className="h-4 w-1/2 rounded-sm bg-muted" />
					<div className="flex gap-10 pt-3">
						<div className="h-10 w-16 rounded-sm bg-muted" />
						<div className="h-10 w-16 rounded-sm bg-muted" />
						<div className="h-10 w-16 rounded-sm bg-muted" />
					</div>
				</div>
				<div className="-mx-4 aspect-4/3 bg-muted sm:mx-0 sm:aspect-video sm:rounded-lg" />
			</div>
		</SiteShell>
	);
}
