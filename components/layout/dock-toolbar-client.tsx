"use client";
import { usePathname } from "next/navigation";
import { lazy, type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
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
	// A shortcut open returns focus to where the visitor was; trigger opens, and origins
	// that have since closed or disappeared, return to the trigger.
	const shortcutOrigin = useRef<HTMLElement | null>(null);
	const finalFocus = useMemo(
		() => ({
			get current() {
				const origin = shortcutOrigin.current;
				return origin?.isConnected &&
					origin.getClientRects().length > 0 &&
					!origin.closest("[inert], [data-header-menu]")
					? origin
					: triggerRef.current;
			},
		}),
		[]
	);
	const panelId = useId();
	useEffect(() => {
		if (previousPath.current !== pathname) {
			previousPath.current = pathname;
			setOpen(false);
		}
	}, [pathname]);
	useEffect(() => {
		const rememberOrigin = () => {
			const active = document.activeElement;
			if (!active?.closest("[data-header-search]")) {
				shortcutOrigin.current =
					active instanceof HTMLElement && active !== document.body ? active : null;
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				rememberOrigin();
				setOpen((value) => !value);
			} else if (event.key === "Escape" && !inputRef.current) {
				setOpen(false);
			}
		};
		const onOpen = () => {
			rememberOrigin();
			setOpen(true);
		};
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
				onOpenChange={(next) => {
					if (next) {
						shortcutOrigin.current = null;
					}
					setOpen(next);
				}}
				anchor={() => triggerRef.current?.closest("header") ?? null}
				initialFocus={inputRef}
				finalFocus={finalFocus}
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
