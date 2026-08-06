import type { ReactNode } from "react";
import { buildSearchIndex } from "@/lib/search-index";
import { AppBreadcrumb } from "./app-breadcrumb";
import { AppLauncher } from "./app-launcher";
import Background from "./background";
import { DockToolbar } from "./dock-toolbar";
import Footer from "./footer";
import { NavDock } from "./nav-dock";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();
	// href → label map for the chrome breadcrumb pill (dynamic project/blog titles
	// come from the same source as ⌘K search).
	const pathLabels = Object.fromEntries(searchEntries.map((e) => [e.href, e.label]));

	return (
		<>
			<Background />

			{/* Top-left header group: identity launcher + breadcrumb pill. */}
			<div className="pointer-events-none fixed top-3 left-3 z-50 flex items-start gap-2 print:hidden">
				<AppLauncher />
				<AppBreadcrumb labels={pathLabels} />
			</div>

			{/* Far-right utility toolbar: search · GitHub · theme · donate. */}
			<DockToolbar entries={searchEntries} />

			<div className="relative flex min-h-screen flex-col">
				<NavDock />
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
