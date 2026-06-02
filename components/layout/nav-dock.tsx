"use client";

import type { LucideIcon } from "lucide-react";
import { Box, CornerDownLeft, Github, Hash, Moon, PenLine, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { flushSync } from "react-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SearchEntry, SearchKind } from "@/lib/search-types";
import { cn } from "@/lib/utils";
import { isActive, type NavItem, navItems } from "./nav-config";

const GITHUB_URL = "https://github.com/byronwade";

const ITEM =
	"relative flex size-8 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30";
const ITEM_IDLE = "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground";
const ITEM_ACTIVE = "bg-dock-active text-dock-active-foreground";

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const EASE = "cubic-bezier(.22,1,.36,1)";
const MORPH = `width 240ms ${EASE}, height 240ms ${EASE}, border-radius 240ms ${EASE}`;

const KIND_ORDER: SearchKind[] = ["Page", "Project", "Writing"];
const KIND_LABEL: Record<SearchKind, string> = {
	Page: "Pages",
	Project: "Projects",
	Writing: "Writing",
};
const KIND_ICON: Record<SearchKind, LucideIcon> = { Page: Hash, Project: Box, Writing: PenLine };

function score(entry: SearchEntry, q: string): boolean {
	if (!q) return true;
	const hay = `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return q
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((tok) => hay.includes(tok));
}

/** Hash-aware navigation (smooth-scroll if the anchor is on the current page). */
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

function NavDockItem({ item, pathname }: { item: NavItem; pathname: string }) {
	const active = isActive(item, pathname);
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Link
						href={item.href}
						aria-label={item.label}
						aria-current={active ? "page" : undefined}
						className={cn(
							"relative flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 sm:px-3",
							active ? ITEM_ACTIVE : ITEM_IDLE
						)}
					/>
				}
			>
				<item.icon className="size-4 shrink-0" strokeWidth={2} />
				<span className="hidden sm:inline">{item.label}</span>
			</TooltipTrigger>
			<TooltipContent className="sm:hidden" sideOffset={10}>
				{item.label}
			</TooltipContent>
		</Tooltip>
	);
}

/**
 * Floating navigation dock that morphs into search. Collapsed, it's the primary
 * nav pill (destinations · search · GitHub · theme). Triggering search (the ⌕
 * button or ⌘K) blooms the same `--dock`-toned capsule in place into a Spotlight
 * panel over byronwade.com's pages, projects, and writing. Ported from the
 * byronwade-ui design-system header.
 */
export function NavDock({ entries }: { entries: SearchEntry[] }) {
	const pathname = usePathname();
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();

	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(0);

	const rootRef = React.useRef<HTMLDivElement>(null);
	const morphRef = React.useRef<HTMLDivElement>(null);
	const compactRef = React.useRef<HTMLDivElement>(null);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLDivElement>(null);
	const collapsedRef = React.useRef<{ w: number; h: number } | null>(null);
	const panelId = React.useId();

	const results = React.useMemo(() => entries.filter((e) => score(e, query)), [entries, query]);
	const groups = React.useMemo(
		() =>
			KIND_ORDER.map((kind) => ({ kind, items: results.filter((e) => e.kind === kind) })).filter(
				(g) => g.items.length > 0
			),
		[results]
	);
	// Flat order must match render order for ↑↓ to line up.
	const flat = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

	const close = React.useCallback(() => {
		setOpen(false);
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

	// Theme swap as a morph: the incoming theme blooms via an expanding clip-path
	// circle anchored on the toggle button (View Transitions API), so the change
	// radiates from the trigger like the dock/launcher morphs.
	const toggleTheme = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const next = resolvedTheme === "dark" ? "light" : "dark";
			const doc = document as Document & {
				startViewTransition?: (cb: () => void) => { ready: Promise<void> };
			};
			const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			if (!doc.startViewTransition || reduce) {
				setTheme(next);
				return;
			}
			const rect = e.currentTarget.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
			doc
				.startViewTransition(() => flushSync(() => setTheme(next)))
				.ready.then(() => {
					document.documentElement.animate(
						{
							clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
						},
						{ duration: 480, easing: EASE, pseudoElement: "::view-transition-new(root)" }
					);
				});
		},
		[resolvedTheme, setTheme]
	);

	/* — slot sizing: keep the reserved footprint synced to the compact pill — */
	const [slot, setSlot] = React.useState<{ w: number; h: number }>({ w: 0, h: 40 });
	useIsoLayoutEffect(() => {
		const compact = compactRef.current;
		const morph = morphRef.current;
		if (!compact || !morph) return;
		const sync = () => {
			if (morph.style.width) return; // morphed open — leave the slot alone
			setSlot({ w: morph.offsetWidth, h: morph.offsetHeight });
		};
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(compact);
		return () => ro.disconnect();
	}, []);

	/* — the morph: animate the shared capsule between pill and panel — */
	useIsoLayoutEffect(() => {
		const morph = morphRef.current;
		const compact = compactRef.current;
		const panel = panelRef.current;
		if (!morph || !compact || !panel) return;

		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const release = () => {
			morph.style.transition = "none";
			morph.style.width = "";
			morph.style.height = "";
			void morph.offsetWidth;
			morph.style.transition = "";
		};

		if (open) {
			if (!collapsedRef.current) {
				collapsedRef.current = { w: morph.offsetWidth, h: morph.offsetHeight };
			}
			const sw = morph.offsetWidth;
			const sh = morph.offsetHeight;
			const ew = panel.offsetWidth;
			const eh = panel.offsetHeight;
			compact.style.transitionDelay = "0ms";
			compact.style.opacity = "0";
			panel.style.transitionDelay = reduce ? "0ms" : "40ms";
			panel.style.opacity = "1";
			if (reduce) {
				morph.style.transition = "none";
				morph.style.width = `${ew}px`;
				morph.style.height = `${eh}px`;
			} else {
				morph.style.transition = "none";
				morph.style.width = `${sw}px`;
				morph.style.height = `${sh}px`;
				void morph.offsetWidth; // reflow → real "from" state
				morph.style.transition = MORPH;
				morph.style.width = `${ew}px`;
				morph.style.height = `${eh}px`;
			}
			inputRef.current?.focus({ preventScroll: true });
		} else if (collapsedRef.current && morph.style.width) {
			const { w: cw, h: ch } = collapsedRef.current;
			panel.style.transitionDelay = "0ms";
			panel.style.opacity = "0";
			compact.style.transitionDelay = reduce ? "0ms" : "80ms";
			compact.style.opacity = "1";
			if (reduce) {
				release();
				return;
			}
			morph.style.transition = MORPH;
			morph.style.width = `${cw}px`;
			morph.style.height = `${ch}px`;
			const onEnd = (ev: TransitionEvent) => {
				if (ev.propertyName !== "height") return;
				release();
				morph.removeEventListener("transitionend", onEnd);
			};
			morph.addEventListener("transitionend", onEnd);
			return () => morph.removeEventListener("transitionend", onEnd);
		}
	}, [open]);

	/* — follow the panel's live height as results filter while open — */
	useIsoLayoutEffect(() => {
		const morph = morphRef.current;
		const panel = panelRef.current;
		if (!morph || !panel || !open) return;
		const ro = new ResizeObserver(() => {
			if (!morph.style.width) return;
			morph.style.height = `${panel.offsetHeight}px`;
			morph.style.width = `${panel.offsetWidth}px`;
		});
		ro.observe(panel);
		return () => ro.disconnect();
	}, [open]);

	/* — keep the active result clamped + scrolled into view — */
	React.useEffect(() => {
		if (active > flat.length - 1) setActive(flat.length ? flat.length - 1 : 0);
	}, [flat.length, active]);
	React.useEffect(() => {
		if (!open) return;
		listRef.current
			?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [active, open]);

	/* — global ⌘K toggle + legacy open event — */
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((p) => !p);
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

	/* — Esc + click-away close — */
	React.useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				close();
			}
		};
		const onDown = (e: PointerEvent) => {
			const t = e.target as Element | null;
			if (!rootRef.current || rootRef.current.contains(t)) return;
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
			if (hit) run(hit.href);
		}
	};

	// Render a result row; `idx` is the flat keyboard index.
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

	return (
		<TooltipProvider delay={350}>
			<div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:top-3 sm:bottom-auto print:hidden">
				{/* SLOT — reserves the collapsed pill's footprint so nothing reflows. */}
				<div
					ref={rootRef}
					style={{ width: slot.w || undefined, height: slot.h }}
					className="pointer-events-none relative"
				>
					{/* MORPH CAPSULE — centered; blooms down on sm+, up on phones. */}
					<div
						ref={morphRef}
						className={cn(
							"pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2 transform-gpu overflow-hidden border border-white/5 bg-dock text-dock-foreground shadow-float [will-change:width,height] sm:top-0 sm:bottom-auto",
							open ? "rounded-2xl" : "rounded-3xl"
						)}
					>
						{/* COMPACT — the nav. */}
						<div
							ref={compactRef}
							className={cn(
								"flex items-center gap-1 p-[3px] transition-opacity duration-150",
								open && "pointer-events-none"
							)}
						>
							<nav aria-label="Primary" className="flex items-center gap-1">
								{navItems.map((item) => (
									<NavDockItem key={item.href} item={item} pathname={pathname} />
								))}
							</nav>

							<span className="mx-1.5 h-5 w-px shrink-0 self-center bg-white/10" aria-hidden />

							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type="button"
											onClick={() => setOpen(true)}
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
						</div>

						{/* SEARCH PANEL — the morph target. */}
						<div
							ref={panelRef}
							id={panelId}
							role="dialog"
							aria-label="Search"
							aria-hidden={!open}
							className={cn(
								"absolute bottom-0 left-1/2 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 opacity-0 outline-none transition-opacity duration-150 sm:top-0 sm:bottom-auto",
								open ? "pointer-events-auto" : "pointer-events-none"
							)}
						>
							{/* Query field */}
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
									className="h-6 flex-1 bg-transparent text-sm text-dock-active-foreground outline-none placeholder:text-dock-foreground/60"
								/>
								<kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-dock-foreground/70">
									esc
								</kbd>
							</div>

							<div className="h-px bg-white/5" aria-hidden />

							{/* Results */}
							<div ref={listRef} className="max-h-80 overflow-y-auto p-1.5 scrollbar-thin">
								{flat.length === 0 ? (
									<div className="px-2.5 py-8 text-center text-[13px] text-dock-foreground/70">
										No results for “{query}”.
									</div>
								) : (
									groups.map((g) => (
										<div className="mb-1 last:mb-0" key={g.kind}>
											<div className="px-2.5 pt-1.5 pb-1 text-[10px] font-semibold tracking-wider text-dock-foreground/50 uppercase">
												{KIND_LABEL[g.kind]}
											</div>
											{g.items.map((e) => Row(e, cursor++))}
										</div>
									))
								)}
							</div>

							{/* Footer hints */}
							<div className="flex items-center gap-3 border-t border-white/5 bg-black/20 px-3.5 py-2 text-[11px] text-dock-foreground/70">
								<span className="flex items-center gap-1">
									<kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">↑↓</kbd>
									navigate
								</span>
								<span className="flex items-center gap-1">
									<kbd className="flex items-center rounded border border-white/10 bg-white/5 px-1 font-mono">
										<CornerDownLeft className="size-3" />
									</kbd>
									open
								</span>
								<span className="ml-auto tabular-nums">{flat.length} results</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
