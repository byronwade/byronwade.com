import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<SiteShell>
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-12 text-center">
				<p className="spec-label">Error</p>
				<h1 className="type-display text-foreground">404</h1>

				<div className="space-y-4">
					<h2 className="type-subtitle text-foreground">Page not found</h2>
					<p className="type-lead mx-auto max-w-xs">
						The page you&apos;re looking for doesn&apos;t exist or has moved.
					</p>

					<Button variant="default" size="lg" render={<Link href="/" />}>
						Return home →
					</Button>
				</div>
			</div>
		</SiteShell>
	);
}
