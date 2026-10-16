// Thorbis Design port: site/site-header + site-shell.stylex @ 46b6654.
import type { ReactNode } from "react";
import { buildSearchIndex } from "@/lib/search-index";
import { AppBreadcrumb } from "./app-breadcrumb";
import { AppLauncher } from "./app-launcher";
import { DockToolbar } from "./dock-toolbar";
import Footer from "./footer";
import { NavDock } from "./nav-dock";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();
	const pathLabels = Object.fromEntries(searchEntries.map((e) => [e.href, e.label]));
	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="relative z-50 mx-auto mt-3 grid w-[calc(100%-2rem)] max-w-5xl grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 rounded-lg border border-border bg-card p-2 shadow-card lg:grid-cols-[1fr_auto_1fr] print:hidden">
				<div className="flex min-w-0 items-center gap-2">
					<AppLauncher />
					<span className="hidden xl:inline">
						<AppBreadcrumb labels={pathLabels} />
					</span>
				</div>
				<div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
					<NavDock />
				</div>
				<div className="col-start-2 row-start-1 justify-self-end lg:col-start-3">
					<DockToolbar entries={searchEntries} />
				</div>
			</header>
			<main id="main-content" className="min-w-0 flex-1">
				{children}
			</main>
			<Footer />
		</div>
	);
}
