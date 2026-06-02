import type { ReactNode } from "react";
import Background from "@/components/sections/background";
import { buildSearchIndex } from "@/lib/search-index";
import { AppLauncher } from "./app-launcher";
import Footer from "./footer";
import { NavDock } from "./nav-dock";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();

	return (
		<>
			<Background />

			{/* Top-left identity launcher (cross-app switcher). */}
			<div className="pointer-events-none fixed top-3 left-3 z-50 flex items-start gap-2 print:hidden">
				<AppLauncher />
			</div>

			<div className="relative flex min-h-screen flex-col">
				<NavDock entries={searchEntries} />
				{/* Top padding clears the floating chrome (launcher + nav dock) so it
				    never sits on top of page content. */}
				<main id="main-content" className="flex-1 pt-14 sm:pt-20">
					{children}
				</main>
				<Footer />
				{/* Clearance for the floating dock, which sits at the bottom on phones. */}
				<div aria-hidden="true" className="h-24 shrink-0 sm:hidden" />
			</div>
		</>
	);
}
