import {
	Box,
	CornerDownLeft,
	Github,
	Hash,
	Heart,
	Moon,
	PenLine,
	Search,
	Sun,
	Twitter,
	X,
} from "@/lib/icons";
import type { SearchEntry } from "@/lib/search-types";
import { DockToolbarClient } from "./dock-toolbar-client";

/** Server-rendered slots avoid shipping glyph definitions with the toolbar. */
export function DockToolbar({ entries }: { entries: SearchEntry[] }) {
	return (
		<DockToolbarClient
			entries={entries}
			icons={{
				search: <Search className="size-4" />,
				searchField: <Search className="size-4 shrink-0 text-dock-foreground" />,
				github: <Github className="size-4" />,
				twitter: <Twitter className="size-3.5" />,
				theme: (
					<>
						<Moon className="size-4 dark:hidden" />
						<Sun className="hidden size-4 dark:block" />
					</>
				),
				heart: <Heart className="size-4" />,
				heartAccent: <Heart className="size-4 fill-brand text-brand" />,
				heartDonate: <Heart className="size-4 fill-current" />,
				close: <X aria-hidden="true" className="size-4" />,
				enter: <CornerDownLeft className="size-3" />,
				kinds: {
					Page: <Hash className="size-4 shrink-0 opacity-70" />,
					Project: <Box className="size-4 shrink-0 opacity-70" />,
					Writing: <PenLine className="size-4 shrink-0 opacity-70" />,
				},
			}}
		/>
	);
}
