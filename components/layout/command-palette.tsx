"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { LucideIcon } from "lucide-react";
import { Box, CornerDownLeft, Hash, PenLine, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { SearchEntry, SearchKind } from "@/lib/search-types";
import { cn } from "@/lib/utils";

const KIND_ORDER: SearchKind[] = ["Page", "Project", "Writing"];
const KIND_LABEL: Record<SearchKind, string> = {
	Page: "Pages",
	Project: "Projects",
	Writing: "Writing",
};
const KIND_ICON: Record<SearchKind, LucideIcon> = { Page: Hash, Project: Box, Writing: PenLine };

function matches(entry: SearchEntry, q: string): boolean {
	if (!q) return true;
	const hay = `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return q
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((tok) => hay.includes(tok));
}

/** Navigate, resolving same-page hash targets to a smooth scroll instead of a push. */
function go(href: string, router: ReturnType<typeof useRouter>) {
	const hash = href.indexOf("#");
	if (hash === -1) return router.push(href);
	const path = href.slice(0, hash) || "/";
	const id = href.slice(hash + 1);
	const here = typeof window !== "undefined" ? window.location.pathname : "";
	const el = here === path && typeof document !== "undefined" ? document.getElementById(id) : null;
	if (el) {
		el.scrollIntoView({ behavior: "smooth" });
		history.replaceState(null, "", href);
	} else {
		router.push(href);
	}
}

/**
 * ⌘K spotlight — a centered, focus-trapped search over the site index.
 *
 * Shares the header's `--dock` chrome material so opening it reads as the
 * header expanding into the page rather than a foreign modal.
 */
export function CommandPalette({
	entries,
	open,
	onOpenChange,
}: {
	entries: SearchEntry[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const router = useRouter();
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(0);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLDivElement>(null);

	const groups = React.useMemo(() => {
		const results = entries.filter((e) => matches(e, query));
		return KIND_ORDER.map((kind) => ({
			kind,
			items: results.filter((e) => e.kind === kind),
		})).filter((g) => g.items.length > 0);
	}, [entries, query]);
	const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

	// Reset the query each time the palette opens so it never reopens mid-search.
	React.useEffect(() => {
		if (open) {
			setQuery("");
			setActive(0);
		}
	}, [open]);

	React.useEffect(() => {
		if (active > flat.length - 1) setActive(flat.length ? flat.length - 1 : 0);
	}, [flat.length, active]);

	React.useEffect(() => {
		listRef.current
			?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [active]);

	const run = React.useCallback(
		(href: string) => {
			onOpenChange(false);
			go(href, router);
		},
		[onOpenChange, router]
	);

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const hit = flat[active];
			if (hit) run(hit.href);
		}
	};

	let cursor = 0;

	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop className="fixed inset-0 z-[60] bg-black/40 duration-150 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
				<DialogPrimitive.Popup
					initialFocus={inputRef}
					className="chrome-surface fixed top-[12vh] left-1/2 z-[60] flex w-[min(38rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl text-dock-foreground duration-150 outline-none data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-4 data-closed:animate-out data-closed:fade-out-0"
				>
					<DialogPrimitive.Title className="sr-only">Search this site</DialogPrimitive.Title>

					<div className="flex items-center gap-2.5 px-4 py-3.5">
						<Search className="size-4 shrink-0 text-dock-foreground/70" aria-hidden="true" />
						<input
							ref={inputRef}
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								setActive(0);
							}}
							onKeyDown={onKeyDown}
							placeholder="Search projects, writing, pages…"
							aria-label="Search"
							className="h-6 flex-1 bg-transparent text-[15px] text-dock-active-foreground outline-none placeholder:text-dock-foreground/50"
						/>
						<kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-dock-foreground/70">
							esc
						</kbd>
					</div>

					<div className="h-px bg-white/5" aria-hidden="true" />

					<div ref={listRef} className="max-h-[min(24rem,52vh)] overflow-y-auto p-2 scrollbar-thin">
						{flat.length === 0 ? (
							<p className="px-3 py-10 text-center text-[13px] text-dock-foreground/60">
								Nothing matches “{query}”.
							</p>
						) : (
							groups.map((group) => (
								<div className="mb-1.5 last:mb-0" key={group.kind}>
									<div className="px-2.5 pt-1.5 pb-1 text-[10px] font-semibold tracking-[0.12em] text-dock-foreground/45 uppercase">
										{KIND_LABEL[group.kind]}
									</div>
									{group.items.map((entry) => {
										const idx = cursor++;
										const Icon = KIND_ICON[entry.kind];
										return (
											<button
												key={entry.href}
												type="button"
												data-idx={idx}
												onMouseMove={() => setActive(idx)}
												onClick={() => run(entry.href)}
												className={cn(
													"flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] outline-none transition-colors",
													idx === active
														? "bg-dock-active text-dock-active-foreground"
														: "text-dock-foreground"
												)}
											>
												<Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
												<span className="flex-1 truncate">{entry.label}</span>
												{entry.meta && (
													<span className="shrink-0 text-[11px] text-dock-foreground/55">
														{entry.meta}
													</span>
												)}
											</button>
										);
									})}
								</div>
							))
						)}
					</div>

					<div className="flex items-center gap-3 border-t border-white/5 bg-black/25 px-4 py-2.5 text-[11px] text-dock-foreground/70">
						<span className="flex items-center gap-1.5">
							<kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">↑↓</kbd>
							navigate
						</span>
						<span className="flex items-center gap-1.5">
							<kbd className="flex items-center rounded border border-white/10 bg-white/5 px-1 font-mono">
								<CornerDownLeft className="size-3" />
							</kbd>
							open
						</span>
						<span className="ml-auto tabular-nums">
							{flat.length} {flat.length === 1 ? "result" : "results"}
						</span>
					</div>
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
