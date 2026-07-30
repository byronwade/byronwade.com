import type { ReactNode } from "react";
import Background from "@/components/sections/background";
import { buildSearchIndex } from "@/lib/search-index";
import SiteFooter from "./site-footer";
import { SiteHeader } from "./site-header";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();

	return (
		<>
			<Background />

			{/* One piece of chrome: the floating header island (⌘K search lives in it). */}
			<SiteHeader entries={searchEntries} />

			<div className="relative flex min-h-screen flex-col">
				{/* Top padding clears the floating island so it never sits on content —
				    but the island is `print:hidden`, so print reclaims the space. */}
				<main id="main-content" className="flex-1 pt-20 sm:pt-24 print:pt-0">
					{children}
				</main>
				<SiteFooter />
			</div>
		</>
	);
}
