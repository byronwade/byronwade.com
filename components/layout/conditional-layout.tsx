import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/common";
import Footer from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSearch } from "@/components/layout/site-search";
import { buildSearchIndex } from "@/lib/search-index";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();

	return (
		<>
			<SiteHeader />
			<div className="relative flex min-h-screen flex-col">
				<main id="main-content" className="flex-1">
					{children}
				</main>
				<Footer />
			</div>
			<SiteSearch entries={searchEntries} />
			{/* Floating theme control — keeps dark/light available without dock chrome */}
			<div className="pointer-events-none fixed right-3 bottom-3 z-40 print:hidden sm:right-5 sm:bottom-5">
				<div className="pointer-events-auto rounded-xl border border-border bg-card/95 p-1 shadow-[var(--shadow-panel)] backdrop-blur-sm">
					<ThemeToggle className="rounded-lg text-foreground hover:bg-muted" />
				</div>
			</div>
		</>
	);
}
