"use client";
import { usePathname } from "next/navigation";
import { lazy, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { HeaderPopover } from "@/components/layout/header-popover";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import type { SearchEntry, SearchKind } from "@/lib/search-types";

const SearchPanel = lazy(() => import("@/components/layout/header-search-panel"));
const TOOL =
	"inline-flex size-11 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";

/** Bare Thorbis utility targets; search code loads on the first intentional open. */
export function DockToolbarClient({
	entries,
	icons,
}: {
	entries: SearchEntry[];
	icons: {
		search: ReactNode;
		theme: ReactNode;
		close: ReactNode;
		kinds: Record<SearchKind, ReactNode>;
	};
}) {
	const pathname = usePathname();
	const previousPath = useRef(pathname);
	const { toggleTheme } = useThemeToggle();
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const panelId = useId();
	useEffect(() => {
		if (previousPath.current !== pathname) {
			previousPath.current = pathname;
			setOpen(false);
		}
	}, [pathname]);
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
			} else if (event.key === "Escape" && !inputRef.current) {
				setOpen(false);
			}
		};
		const onOpen = () => setOpen(true);
		window.addEventListener("keydown", onKey);
		window.addEventListener("open-command-palette", onOpen);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("open-command-palette", onOpen);
		};
	}, []);
	return (
		<>
			<HeaderPopover
				kind="search"
				id={panelId}
				label="Search"
				closedLabel="Search (⌘K)"
				open={open}
				onOpenChange={setOpen}
				anchor={() => triggerRef.current?.closest("header") ?? null}
				initialFocus={inputRef}
				finalFocus={triggerRef}
				trigger={
					<button
						type="button"
						ref={triggerRef}
						aria-label="Search (⌘K)"
						title="Search · Command K"
						className={TOOL}
					>
						{icons.search}
					</button>
				}
			>
				<SearchPanel
					entries={entries}
					icons={icons}
					inputRef={inputRef}
					onClose={() => setOpen(false)}
				/>
			</HeaderPopover>
			<button
				type="button"
				aria-label="Toggle theme"
				title="Toggle theme"
				className={TOOL}
				onClick={() => toggleTheme()}
			>
				{icons.theme}
			</button>
		</>
	);
}
