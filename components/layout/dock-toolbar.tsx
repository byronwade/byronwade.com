import { Box, Hash, Moon, PenLine, Search, Sun, X } from "@/lib/icons";
import type { SearchEntry } from "@/lib/search-types";
import { DockToolbarClient } from "./dock-toolbar-client";

/** Server-rendered slots avoid shipping glyph definitions with the toolbar. */
export function DockToolbar({ entries }: { entries: SearchEntry[] }) {
	return (
		<DockToolbarClient
			entries={entries}
			icons={{
				search: <Search weight="regular" className="size-4" />,
				theme: (
					<>
						<Sun weight="regular" className="size-4 dark:hidden" />
						<Moon weight="regular" className="hidden size-4 dark:block" />
					</>
				),
				close: <X weight="regular" aria-hidden="true" className="size-4" />,
				kinds: {
					Page: <Hash className="size-4 shrink-0 opacity-70" />,
					Project: <Box className="size-4 shrink-0 opacity-70" />,
					Writing: <PenLine className="size-4 shrink-0 opacity-70" />,
				},
			}}
		/>
	);
}
