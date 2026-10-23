// Thorbis site-header / site-shell.stylex: single surface, fixed chrome, 42rem measure.
import { DockToolbar } from "@/components/layout/dock-toolbar";
import { NavDock } from "@/components/layout/nav-dock";
import { Box, FileText, Home, Layers, PenLine } from "@/lib/icons";
import type { SearchEntry } from "@/lib/search-types";

/** Static navigation glyphs stay outside the client bundle. */
export function SiteHeader({ entries }: { entries: SearchEntry[] }) {
	return (
		<NavDock
			tools={<DockToolbar entries={entries} />}
			icons={{
				"/": <Home weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-olive)" />,
				"/projects": <Box weight="regular" aria-hidden="true" className="size-4 text-brand" />,
				"/portfolio": (
					<Layers weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-forest)" />
				),
				"/blog": (
					<PenLine
						weight="regular"
						aria-hidden="true"
						className="size-4 text-(--thorbis-pumpkin)"
					/>
				),
				"/resume": (
					<FileText weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-burnt)" />
				),
			}}
		/>
	);
}
