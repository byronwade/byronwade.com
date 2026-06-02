import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

export default function NotFound() {
	return (
		<SiteShell>
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-12 text-center">
				<div className="relative">
					<h1 className="select-none bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text font-display text-8xl font-normal text-transparent">
						404
					</h1>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-center gap-3">
						<span className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
						<span className="text-accent">✦</span>
						<span className="h-px w-8 bg-gradient-to-l from-transparent to-border" />
					</div>

					<h2 className="text-lg font-medium text-foreground sm:text-xl">Page not found</h2>
					<p className="mx-auto max-w-xs text-sm text-muted-foreground sm:text-base">
						The page you're looking for doesn't exist or has moved.
					</p>

					<Link
						href="/"
						className="touch-target inline-flex items-center gap-2 rounded-lg bg-accent/10 px-5 py-2.5 font-medium text-accent transition-all duration-300 hover:bg-accent/20"
					>
						Return home →
					</Link>
				</div>
			</div>
		</SiteShell>
	);
}
