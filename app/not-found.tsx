import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<SiteShell>
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-12 text-center">
				<div className="relative">
					<h1 className="text-gradient select-none font-heading text-8xl font-semibold tracking-tight">
						404
					</h1>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-center gap-3">
						<span className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
						<span className="text-brand">✦</span>
						<span className="h-px w-8 bg-gradient-to-l from-transparent to-border" />
					</div>

					<h2 className="text-lg font-medium text-foreground sm:text-xl">Page not found</h2>
					<p className="mx-auto max-w-xs text-sm text-muted-foreground sm:text-base">
						The page you're looking for doesn't exist or has moved.
					</p>

					<Button variant="outline" size="lg" render={<Link href="/" />}>
						Return home →
					</Button>
				</div>
			</div>
		</SiteShell>
	);
}
