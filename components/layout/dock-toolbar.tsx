"use client";

import type { LucideIcon } from "lucide-react";
import { Box, CornerDownLeft, Github, Hash, Heart, Moon, PenLine, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCapsuleMorph } from "@/hooks/use-capsule-morph";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import type { SearchEntry, SearchKind } from "@/lib/search-types";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/byronwade";
/** Hoisted so it is compiled once rather than on every keystroke. */
const WHITESPACE = /\s+/;
const X_URL = "https://x.com/byron_c_wade";
const SPONSOR_URL = "https://github.com/sponsors/byronwade";

/** X (formerly Twitter) brand glyph, lucide's `X` is the close icon, not the logo. */
function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

const ITEM =
	"relative flex size-8 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";
const ITEM_IDLE = "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const KIND_ORDER: SearchKind[] = ["Page", "Project", "Writing"];
const KIND_LABEL: Record<SearchKind, string> = {
	Page: "Pages",
	Project: "Projects",
	Writing: "Writing",
};
const KIND_ICON: Record<SearchKind, LucideIcon> = { Page: Hash, Project: Box, Writing: PenLine };

type Mode = "search" | "donate" | null;

function score(entry: SearchEntry, q: string): boolean {
	if (!q) {
		return true;
	}
	const hay = `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return q
		.toLowerCase()
		.split(WHITESPACE)
		.filter(Boolean)
		.every((tok) => hay.includes(tok));
}

function go(href: string, router: ReturnType<typeof useRouter>) {
	const hash = href.indexOf("#");
	if (hash === -1) {
		return router.push(href);
	}
	const path = href.slice(0, hash) || "/";
	const id = href.slice(hash + 1);
	const here = typeof window === "undefined" ? "" : window.location.pathname;
	const el = here === path && typeof document !== "undefined" ? document.getElementById(id) : null;
	if (el) {
		el.scrollIntoView({ behavior: "smooth" });
		history.replaceState(null, "", href);
	} else {
		router.push(href);
	}
}

/**
 * Far-right utility toolbar: search · GitHub · theme · donate. Shares the
 * `--dock` capsule material with the nav dock and launcher. The capsule **morphs
 * in place** into one of two panels: the ⌘K search spotlight, or a donation ask
 * (the pink heart). Ported from the byronwade-ui dock morph; right-anchored so the
 * panels bloom down-and-left and never leave the viewport.
 */
export function DockToolbar({ entries }: { entries: SearchEntry[] }) {
	const router = useRouter();
	const { toggleTheme } = useThemeToggle();

	const [mode, setMode] = React.useState<Mode>(null);
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(0);
	const open = mode !== null;

	const rootRef = React.useRef<HTMLDivElement>(null);
	const morphRef = React.useRef<HTMLDivElement>(null);
	const compactRef = React.useRef<HTMLDivElement>(null);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLDivElement>(null);
	const panelId = React.useId();

	const results = React.useMemo(() => entries.filter((e) => score(e, query)), [entries, query]);
	const groups = React.useMemo(
		() =>
			KIND_ORDER.map((kind) => ({ kind, items: results.filter((e) => e.kind === kind) })).filter(
				(g) => g.items.length > 0
			),
		[results]
	);
	const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

	const close = React.useCallback(() => {
		setMode(null);
		setQuery("");
		setActive(0);
	}, []);

	const run = React.useCallback(
		(href: string) => {
			close();
			go(href, router);
		},
		[close, router]
	);

	/*, slot sizing: keep the reserved footprint synced to the compact pill ,  */
	const [slot, setSlot] = React.useState<{ w: number; h: number }>({ w: 0, h: 40 });
	useIsoLayoutEffect(() => {
		const compact = compactRef.current;
		const morph = morphRef.current;
		if (!(compact && morph)) {
			return;
		}
		const sync = () => {
			if (morph.style.width) {
				return;
			}
			setSlot({ w: morph.offsetWidth, h: morph.offsetHeight });
		};
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(compact);
		return () => ro.disconnect();
	}, []);

	useCapsuleMorph({
		open,
		morphRef,
		compactRef,
		panelRef,
		durationMs: 240,
		openDelayMs: 40,
		closeDelayMs: 80,
		onOpened: () => {
			if (mode === "search") {
				inputRef.current?.focus({ preventScroll: true });
			}
		},
		deps: [mode],
	});

	/*, follow the panel's live size while open (results filtering, mode swap) ,  */
	useIsoLayoutEffect(() => {
		const morph = morphRef.current;
		const panel = panelRef.current;
		if (!(morph && panel && open)) {
			return;
		}
		const ro = new ResizeObserver(() => {
			if (!morph.style.width) {
				return;
			}
			morph.style.height = `${panel.offsetHeight}px`;
			morph.style.width = `${panel.offsetWidth}px`;
		});
		ro.observe(panel);
		return () => ro.disconnect();
	}, [open]);

	React.useEffect(() => {
		if (active > flat.length - 1) {
			setActive(flat.length ? flat.length - 1 : 0);
		}
	}, [flat.length, active]);
	React.useEffect(() => {
		if (mode !== "search") {
			return;
		}
		listRef.current
			?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [active, mode]);

	/*, global ⌘K toggles search ,  */
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setMode((m) => (m === "search" ? null : "search"));
			}
		};
		const onOpen = () => setMode("search");
		window.addEventListener("keydown", onKey);
		window.addEventListener("open-command-palette", onOpen);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("open-command-palette", onOpen);
		};
	}, []);

	/*. Esc + click-away close ,  */
	React.useEffect(() => {
		if (!open) {
			return;
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				close();
			}
		};
		const onDown = (e: PointerEvent) => {
			const t = e.target as Element | null;
			if (!rootRef.current || rootRef.current.contains(t)) {
				return;
			}
			close();
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onDown);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onDown);
		};
	}, [open, close]);

	const onInputKey = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, flat.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const hit = flat[active];
			if (hit) {
				run(hit.href);
			}
		}
	};

	const Row = (entry: SearchEntry, idx: number) => {
		const Icon = KIND_ICON[entry.kind];
		return (
			<button
				key={entry.href}
				type="button"
				data-idx={idx}
				onMouseMove={() => setActive(idx)}
				onClick={() => run(entry.href)}
				className={cn(
					"flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] outline-none transition-colors",
					idx === active ? "bg-dock-active text-dock-active-foreground" : "text-dock-foreground"
				)}
			>
				<Icon className="size-4 shrink-0 opacity-70" />
				<span className="flex-1 truncate">{entry.label}</span>
				{entry.meta && (
					<span className="shrink-0 text-[11px] text-dock-foreground/60">{entry.meta}</span>
				)}
			</button>
		);
	};

	let cursor = 0;
	const panelWidth =
		mode === "donate" ? "w-[min(22rem,calc(100vw-1.5rem))]" : "w-[min(34rem,calc(100vw-1.5rem))]";

	return (
		<TooltipProvider delay={350}>
			<div className="pointer-events-none fixed top-3 right-3 z-50 print:hidden">
				{/* SLOT, reserves the collapsed pill's footprint so nothing reflows. */}
				<div
					ref={rootRef}
					style={{ width: slot.w || undefined, height: slot.h }}
					className="pointer-events-none relative"
				>
					{/* MORPH CAPSULE, right-anchored; blooms down and to the left. */}
					<div
						ref={morphRef}
						className={cn(
							"pointer-events-auto absolute top-0 right-0 transform-gpu overflow-hidden border border-dock-border bg-dock text-dock-foreground shadow-float [will-change:width,height]",
							open ? "rounded-2xl" : "rounded-3xl"
						)}
					>
						{/* COMPACT, the toolbar. */}
						<div
							ref={compactRef}
							className={cn(
								"flex items-center gap-1 p-[3px] transition-opacity duration-150",
								open && "pointer-events-none"
							)}
						>
							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type="button"
											onClick={() => setMode("search")}
											aria-label="Search (⌘K)"
											className={cn(ITEM, ITEM_IDLE)}
										/>
									}
								>
									<Search className="size-4 shrink-0" strokeWidth={2} />
								</TooltipTrigger>
								<TooltipContent sideOffset={10}>Search · ⌘K</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger
									render={
										<a
											href={GITHUB_URL}
											target="_blank"
											rel="noreferrer"
											aria-label="GitHub"
											className={cn(ITEM, ITEM_IDLE)}
										>
											<Github className="size-4 shrink-0" strokeWidth={2} />
										</a>
									}
								/>
								<TooltipContent sideOffset={10}>GitHub</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger
									render={
										<a
											href={X_URL}
											target="_blank"
											rel="noreferrer"
											aria-label="X (@byron_c_wade)"
											className={cn(ITEM, ITEM_IDLE)}
										>
											<XIcon className="size-3.5 shrink-0" />
										</a>
									}
								/>
								<TooltipContent sideOffset={10}>X · @byron_c_wade</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type="button"
											onClick={toggleTheme}
											aria-label="Toggle theme"
											className={cn(ITEM, ITEM_IDLE)}
										/>
									}
								>
									<Moon className="size-4 shrink-0 dark:hidden" strokeWidth={2} />
									<Sun className="hidden size-4 shrink-0 dark:block" strokeWidth={2} />
								</TooltipTrigger>
								<TooltipContent sideOffset={10}>Toggle theme</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type="button"
											onClick={() => setMode("donate")}
											aria-label="Support open source"
											className={cn(ITEM, ITEM_IDLE)}
										/>
									}
								>
									{/* Resting chrome inherits dock colour like its neighbours. A filled
									    pink heart here was the most saturated thing on every page and the
									    only off-palette colour in persistent chrome (§5.1). The Sponsors
									    pink stays inside the panel, where donating is the subject. */}
									<Heart className="size-4 shrink-0" strokeWidth={2} />
								</TooltipTrigger>
								<TooltipContent sideOffset={10}>Support open source</TooltipContent>
							</Tooltip>
						</div>

						{/* PANEL, the morph target (search spotlight or donation ask). */}
						<div
							ref={panelRef}
							id={panelId}
							role="dialog"
							aria-label={mode === "donate" ? "Support open source" : "Search"}
							aria-hidden={!open}
							className={cn(
								"absolute top-0 right-0 opacity-0 outline-none transition-opacity duration-150",
								panelWidth,
								open ? "pointer-events-auto" : "pointer-events-none"
							)}
						>
							{mode === "donate" ? (
								<div className="flex flex-col gap-3 p-4">
									<div className="flex items-center gap-2.5">
										<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-pink-500/15">
											<Heart className="size-4 fill-pink-500 text-pink-500" />
										</span>
										<div className="leading-tight">
											<div className="font-semibold text-[13px] text-dock-active-foreground">
												Support my open source
											</div>
											<div className="text-[11px] text-dock-foreground">Pretty please 💖</div>
										</div>
									</div>
									<p className="text-[13px] text-dock-foreground leading-relaxed">
										Donations keep my open-source projects free and maintained. And every month I
										give <span className="font-semibold text-dock-active-foreground">20%</span> of
										what I receive to a non-profit of my choice, so a little goes a long way.
									</p>
									<a
										href={SPONSOR_URL}
										target="_blank"
										rel="noreferrer"
										className="flex h-9 items-center justify-center gap-2 rounded-xl bg-pink-500 font-semibold text-[13px] text-white transition-colors hover:bg-pink-500/90"
									>
										<Heart className="size-4 fill-white" />
										Donate via GitHub Sponsors
									</a>
									<button
										type="button"
										onClick={close}
										className="text-[11px] text-dock-foreground transition-colors hover:text-dock-active-foreground"
									>
										Maybe later
									</button>
								</div>
							) : (
								<>
									<div className="flex items-center gap-2.5 px-3.5 py-3">
										<Search className="size-4 shrink-0 text-dock-foreground/70" />
										<input
											ref={inputRef}
											value={query}
											onChange={(e) => {
												setQuery(e.target.value);
												setActive(0);
											}}
											onKeyDown={onInputKey}
											placeholder="Search projects, writing, pages…"
											aria-label="Search"
											className="h-6 flex-1 bg-transparent text-dock-active-foreground text-sm outline-none placeholder:text-dock-foreground/60"
										/>
										<kbd className="rounded border border-dock-border bg-dock-muted px-1.5 py-0.5 font-mono text-[10px] text-dock-foreground/70">
											esc
										</kbd>
									</div>
									<div className="h-px bg-dock-border" aria-hidden="true" />
									<div ref={listRef} className="scrollbar-thin max-h-80 overflow-y-auto p-1.5">
										{flat.length === 0 ? (
											<div className="px-2.5 py-8 text-center text-[13px] text-dock-foreground/70">
												No results for “{query}”.
											</div>
										) : (
											groups.map((g) => (
												<div className="mb-1 last:mb-0" key={g.kind}>
													<div className="px-2.5 pt-1.5 pb-1 text-[11px] text-dock-foreground/60">
														{KIND_LABEL[g.kind]}
													</div>
													{g.items.map((e) => Row(e, cursor++))}
												</div>
											))
										)}
									</div>
									<div className="flex items-center gap-3 border-dock-border border-t bg-dock-muted px-3.5 py-2 text-[11px] text-dock-foreground/70">
										<span className="flex items-center gap-1">
											<kbd className="rounded border border-dock-border bg-dock-muted px-1 font-mono">
												↑↓
											</kbd>
											navigate
										</span>
										<span className="flex items-center gap-1">
											<kbd className="flex items-center rounded border border-dock-border bg-dock-muted px-1 font-mono">
												<CornerDownLeft className="size-3" />
											</kbd>
											open
										</span>
										<span className="ml-auto tabular-nums">{flat.length} results</span>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
