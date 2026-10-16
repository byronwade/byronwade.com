import { ArrowUpRight, GitFork, LayoutGrid, Moon, Sun, X } from "@/lib/icons";
import { AppLauncherClient } from "./app-launcher-client";

/** Static glyphs stay on the server; the client owns the capsule interaction. */
export function AppLauncher() {
	return (
		<AppLauncherClient
			icons={{
				products: <LayoutGrid className="size-4" />,
				close: <X className="size-4" />,
				external: (
					<ArrowUpRight className="ml-auto size-4 shrink-0 text-dock-foreground transition-colors group-hover:text-dock-foreground" />
				),
				github: <GitFork className="size-4" />,
				theme: (
					<>
						<Moon className="size-4 dark:hidden" />
						<Sun className="hidden size-4 dark:block" />
					</>
				),
			}}
		/>
	);
}
