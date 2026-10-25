// Thorbis Design port: site/site-header + site-shell.stylex @ 46b6654.
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { MoreHorizontal } from "@/lib/icons";
import { buildSearchIndex } from "@/lib/search-index";
import { AppBreadcrumb } from "./app-breadcrumb";
import Footer from "./footer";
import { Starfield } from "./starfield";

export default async function SiteLayout({ children }: { children: ReactNode }) {
	const searchEntries = await buildSearchIndex();
	const pathLabels = Object.fromEntries(searchEntries.map((e) => [e.href, e.label]));
	return (
		<div className="relative flex min-h-screen flex-col">
			<Starfield />
			<SiteHeader entries={searchEntries} />
			<div className="fixed top-2 left-5 z-(--z-chrome) hidden xl:block print:hidden">
				<AppBreadcrumb
					labels={pathLabels}
					overflowIcon={<MoreHorizontal aria-hidden="true" className="size-4" />}
				/>
			</div>
			<main id="main-content" className="min-w-0 flex-1">
				{children}
			</main>
			<Footer />
		</div>
	);
}
