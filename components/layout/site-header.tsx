"use client";

import { Github, Heart, Menu, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { flushSync } from "react-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { customFont } from "@/lib/fonts";
import type { SearchEntry } from "@/lib/search-types";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";
import { contactItem, isActive, mobileNavItems, navItems } from "./nav-config";
import { ProductMenu } from "./product-menu";

const GITHUB_URL = "https://github.com/byronwade";
const X_URL = "https://x.com/byron_c_wade";
const SPONSOR_URL = "https://github.com/sponsors/byronwade";

const EASE = "cubic-bezier(.22,1,.36,1)";
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const ICON_BUTTON =
	"flex size-8 items-center justify-center rounded-full text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-white/30";

/** X (formerly Twitter) brand glyph: lucide's `X` is the close icon, not the logo. */
function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

/**
 * The floating header: one island holding everything.
 *
 * Identity and product switcher on the left, destinations in the middle behind a
 * sliding active pill, utilities and the contact CTA on the right. It condenses
 * on scroll (tighter width, denser shadow) and carries a hairline reading
 * progress bar along its bottom edge. Below `md` the same island expands
 * downward into a full menu instead of spawning a separate surface, so the site
 * only ever shows one piece of chrome.
 */
export function SiteHeader({ entries }: { entries: SearchEntry[] }) {
	const pathname = usePathname();
	const [scrolled, setScrolled] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [paletteOpen, setPaletteOpen] = React.useState(false);

	/* Condense once the page has moved off the top. */
	React.useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/* A route change always closes the mobile panel. */
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not a value we read
	React.useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	/* ⌘K anywhere opens search; other surfaces can dispatch the same event. */
	React.useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPaletteOpen((v) => !v);
			}
		};
		const onOpen = () => setPaletteOpen(true);
		window.addEventListener("keydown", onKey);
		window.addEventListener("open-command-palette", onOpen);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("open-command-palette", onOpen);
		};
	}, []);

	return (
		<TooltipProvider delay={350}>
			<header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 print:hidden">
				<div
					className={cn(
						"pointer-events-auto w-full transition-[max-width] duration-500",
						scrolled ? "max-w-3xl" : "max-w-4xl"
					)}
					style={{ transitionTimingFunction: EASE }}
				>
					<div
						data-scrolled={scrolled}
						className="chrome-surface relative overflow-hidden rounded-[1.375rem] transition-[background-color,box-shadow] duration-300"
					>
						<div className="flex h-12 items-center gap-1 pr-1.5 pl-2.5">
							{/* IDENTITY */}
							<Link
								href="/"
								aria-label="Byron Wade, home"
								className={cn(
									customFont.className,
									"flex h-8 shrink-0 items-center whitespace-nowrap px-1 text-lg leading-none text-dock-active-foreground transition-colors [-webkit-text-stroke:0.6px_currentColor] hover:text-brand"
								)}
							>
								Byron Wade
							</Link>
							<ProductMenu />

							{/* DESTINATIONS */}
							<NavRow pathname={pathname} />

							{/* UTILITIES */}
							<div className="ml-auto flex items-center gap-0.5">
								<button
									type="button"
									onClick={() => setPaletteOpen(true)}
									aria-label="Search"
									className="hidden h-8 items-center gap-2 rounded-full pr-1.5 pl-3 text-[13px] text-dock-foreground outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-white/30 lg:flex"
								>
									<Search className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
									<span>Search</span>
									<kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-dock-foreground/70">
										⌘K
									</kbd>
								</button>
								<Tooltip>
									<TooltipTrigger
										render={
											<button
												type="button"
												onClick={() => setPaletteOpen(true)}
												aria-label="Search"
												className={cn(ICON_BUTTON, "lg:hidden")}
											/>
										}
									>
										<Search className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
									</TooltipTrigger>
									<TooltipContent sideOffset={10}>Search · ⌘K</TooltipContent>
								</Tooltip>

								<span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" aria-hidden="true" />

								<Tooltip>
									<TooltipTrigger
										render={
											<a
												href={GITHUB_URL}
												target="_blank"
												rel="noreferrer"
												aria-label="GitHub"
												className={cn(ICON_BUTTON, "hidden sm:flex")}
											>
												<Github className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
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
												aria-label="X, @byron_c_wade"
												className={cn(ICON_BUTTON, "hidden sm:flex")}
											>
												<XIcon className="size-3.5 shrink-0" />
											</a>
										}
									/>
									<TooltipContent sideOffset={10}>X · @byron_c_wade</TooltipContent>
								</Tooltip>

								<ThemeToggle />
								<SponsorButton />

								{/* CTA: the one filled control in the chrome. */}
								<Link
									href={contactItem.href}
									className="ml-1 hidden h-8 items-center rounded-full bg-dock-active-foreground px-3.5 text-[13px] font-semibold text-dock transition-opacity hover:opacity-85 md:inline-flex"
								>
									{contactItem.label}
								</Link>

								{/* Mobile: the island itself becomes the menu. */}
								<button
									type="button"
									onClick={() => setMenuOpen((v) => !v)}
									aria-expanded={menuOpen}
									aria-controls="site-menu"
									aria-label={menuOpen ? "Close menu" : "Open menu"}
									className={cn(
										ICON_BUTTON,
										"md:hidden",
										menuOpen && "bg-dock-active text-dock-active-foreground"
									)}
								>
									{menuOpen ? (
										<X className="size-4" strokeWidth={2} aria-hidden="true" />
									) : (
										<Menu className="size-4" strokeWidth={2} aria-hidden="true" />
									)}
								</button>
							</div>
						</div>

						{/* MOBILE PANEL: grows the island rather than opening a new surface. */}
						<div
							id="site-menu"
							className={cn(
								// Opaque, unlike the bar above it: a menu has to be readable over
								// whatever it covers, glass or not.
								"grid bg-dock transition-[grid-template-rows] duration-300 md:hidden",
								menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
							)}
							style={{ transitionTimingFunction: EASE }}
						>
							<div className="overflow-hidden">
								<nav
									aria-label="Mobile"
									className="flex flex-col gap-0.5 border-t border-white/5 p-2"
								>
									{mobileNavItems.map((item) => {
										const active = isActive(item, pathname);
										return (
											<Link
												key={item.href}
												href={item.href}
												aria-current={active ? "page" : undefined}
												className={cn(
													"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
													active
														? "bg-dock-active text-dock-active-foreground"
														: "text-dock-foreground hover:bg-white/5 hover:text-dock-active-foreground"
												)}
											>
												<item.icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
												{item.label}
											</Link>
										);
									})}
								</nav>
								<div className="flex items-center gap-1 border-t border-white/5 bg-black/20 px-2 py-2 sm:hidden">
									<a
										href={GITHUB_URL}
										target="_blank"
										rel="noreferrer"
										className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 text-[13px] font-semibold text-dock-active-foreground transition-colors hover:bg-white/10"
									>
										<Github className="size-4" aria-hidden="true" /> GitHub
									</a>
									<a
										href={X_URL}
										target="_blank"
										rel="noreferrer"
										className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 text-[13px] font-semibold text-dock-active-foreground transition-colors hover:bg-white/10"
									>
										<XIcon className="size-3.5" /> X
									</a>
								</div>
							</div>
						</div>

						{/* Reading progress: a lit hairline riding the island's bottom edge. */}
						<span
							aria-hidden="true"
							className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-brand to-transparent"
						/>
					</div>
				</div>
			</header>

			<CommandPalette entries={entries} open={paletteOpen} onOpenChange={setPaletteOpen} />
		</TooltipProvider>
	);
}

/** Centred destinations with a pill that slides between the active item. */
function NavRow({ pathname }: { pathname: string }) {
	const listRef = React.useRef<HTMLElement>(null);
	const [pill, setPill] = React.useState<{ left: number; width: number } | null>(null);

	useIsoLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const measure = () => {
			const el = list.querySelector<HTMLElement>('[data-active="true"]');
			setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
		};
		measure();
		// Re-measure once webfonts settle and whenever the row is resized.
		const ro = new ResizeObserver(measure);
		ro.observe(list);
		document.fonts?.ready.then(measure).catch(() => undefined);
		return () => ro.disconnect();
	}, [pathname]);

	return (
		<nav
			ref={listRef}
			className="relative ml-2 hidden items-center gap-0.5 md:flex"
			aria-label="Primary"
		>
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-y-1 rounded-full bg-dock-active transition-[left,width,opacity] duration-300",
					pill ? "opacity-100" : "opacity-0"
				)}
				style={{
					left: pill?.left ?? 0,
					width: pill?.width ?? 0,
					transitionTimingFunction: EASE,
				}}
			/>
			{navItems.map((item) => {
				const active = isActive(item, pathname);
				return (
					<Link
						key={item.href}
						href={item.href}
						data-active={active}
						aria-current={active ? "page" : undefined}
						className={cn(
							"relative z-10 flex h-8 items-center rounded-full px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30",
							active
								? "text-dock-active-foreground"
								: "text-dock-foreground hover:text-dock-active-foreground"
						)}
					>
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}

/** Light/dark swap that blooms out of the button via the View Transitions API. */
function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggle = React.useCallback(
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
						{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
						{ duration: 480, easing: EASE, pseudoElement: "::view-transition-new(root)" }
					);
				});
		},
		[resolvedTheme, setTheme]
	);

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<button
						type="button"
						onClick={toggle}
						aria-label="Toggle theme"
						className={ICON_BUTTON}
					/>
				}
			>
				<Moon className="size-4 shrink-0 dark:hidden" strokeWidth={2} aria-hidden="true" />
				<Sun className="hidden size-4 shrink-0 dark:block" strokeWidth={2} aria-hidden="true" />
			</TooltipTrigger>
			<TooltipContent sideOffset={10}>Toggle theme</TooltipContent>
		</Tooltip>
	);
}

/** The sponsor ask, kept to a small popover so the chrome stays quiet. */
function SponsorButton() {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<button
						type="button"
						aria-label="Support open source"
						className={cn(ICON_BUTTON, open && "bg-dock-active")}
					>
						<Heart className="size-4 shrink-0 fill-pink-500 text-pink-500" strokeWidth={2} />
					</button>
				}
			/>
			<PopoverContent
				align="end"
				sideOffset={12}
				className="chrome-surface w-[min(22rem,calc(100vw-1.5rem))] gap-3 rounded-2xl p-4 text-dock-foreground ring-0"
			>
				<div className="flex items-center gap-2.5">
					<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-pink-500/15">
						<Heart className="size-4 fill-pink-500 text-pink-500" aria-hidden="true" />
					</span>
					<span className="leading-tight">
						<span className="block text-[13px] font-semibold text-dock-active-foreground">
							Support my open source
						</span>
						<span className="block text-[11px] text-dock-foreground">Pretty please 💖</span>
					</span>
				</div>
				<p className="text-[13px] leading-relaxed text-dock-foreground">
					Donations keep my open-source projects free and maintained. And every month I give{" "}
					<span className="font-semibold text-dock-active-foreground">20%</span> of what I receive
					to a non-profit of my choice, so a little goes a long way.
				</p>
				<a
					href={SPONSOR_URL}
					target="_blank"
					rel="noreferrer"
					className="flex h-9 items-center justify-center gap-2 rounded-xl bg-pink-500 text-[13px] font-semibold text-white transition-colors hover:bg-pink-500/90"
				>
					<Heart className="size-4 fill-white" aria-hidden="true" />
					Donate via GitHub Sponsors
				</a>
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="text-[11px] text-dock-foreground transition-colors hover:text-dock-active-foreground"
				>
					Maybe later
				</button>
			</PopoverContent>
		</Popover>
	);
}
