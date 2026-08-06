"use client";

import { ArrowUpRight, GitFork, LayoutGrid, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useCapsuleMorph } from "@/hooks/use-capsule-morph";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/byronwade";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Every product under the byronwade umbrella — the launcher is the cross-app switcher. */
const PRODUCTS: { name: string; desc: string; href: string; mark: string }[] = [
	{
		name: "byronwade/ui",
		desc: "Design system & morph chrome",
		href: "https://ui.byronwade.com",
		mark: "U",
	},
	{ name: "GoodMarks", desc: "Reviews & reputation", href: "https://goodmarks.io", mark: "G" },
	{
		name: "SignalRoute",
		desc: "AI business phone",
		href: "https://getsignalroute.com",
		mark: "S",
	},
	{
		name: "Fakebase",
		desc: "Mock backend for prototyping",
		href: "https://fakebase.byronwade.com",
		mark: "F",
	},
	{ name: "Thorbis", desc: "Service-business platform", href: "https://thorbis.com", mark: "T" },
	{ name: "Dits", desc: "Lightweight notes", href: "https://dits.byronwade.com", mark: "D" },
	{
		name: "Wormhole",
		desc: "Instant file transfer",
		href: "https://wormhole.byronwade.com",
		mark: "W",
	},
];

/**
 * Top-left launcher — a slim, horizontal identity pill (the inverse-material twin
 * of the floating dock), ported from the byronwade-ui design-system chrome.
 * Collapsed it's a dark `--dock`-toned pill (the byronwade mark + an app-switcher
 * grid). The pill morphs in place into a browse panel: every product under the
 * byronwade umbrella, with the theme toggle + GitHub link in the footer.
 */
export function AppLauncher() {
	const [open, setOpen] = React.useState(false);

	const rootRef = React.useRef<HTMLDivElement>(null);
	const morphRef = React.useRef<HTMLDivElement>(null);
	const compactRef = React.useRef<HTMLDivElement>(null);
	const panelRef = React.useRef<HTMLDivElement>(null);

	const panelId = React.useId();

	// The launcher is an overlay-in-a-slot: the absolutely-positioned morph blooms
	// right + down. The slot reserves the collapsed pill's footprint (seeded with
	// the exact collapsed box) so nothing jumps on first paint.
	const [slot, setSlot] = React.useState<{ w: number; h: number }>({ w: 76, h: 40 });

	useIsoLayoutEffect(() => {
		const compact = compactRef.current;
		const morph = morphRef.current;
		if (!(compact && morph)) {
			return;
		}
		const sync = () => {
			if (morph.style.width) {
				return; // morphed open — leave the slot alone
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
		durationMs: 200,
		openDelayMs: 30,
		closeDelayMs: 70,
		onOpened: () => panelRef.current?.focus({ preventScroll: true }),
	});

	// Esc + click-away close.
	React.useEffect(() => {
		if (!open) {
			return;
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
			}
		};
		const onDown = (e: PointerEvent) => {
			const target = e.target as Element | null;
			if (!rootRef.current || rootRef.current.contains(target)) {
				return;
			}
			setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("pointerdown", onDown);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("pointerdown", onDown);
		};
	}, [open]);

	const { toggleTheme } = useThemeToggle();

	return (
		<div
			ref={rootRef}
			style={{
				width: slot.w,
				height: slot.h,
				transition: "width 200ms cubic-bezier(.22,1,.36,1)",
			}}
			className="relative z-10 shrink-0"
		>
			<div
				ref={morphRef}
				className={cn(
					"pointer-events-auto absolute top-0 left-0 inline-flex transform-gpu overflow-hidden border border-white/5 bg-dock text-dock-foreground shadow-float [will-change:width,height]",
					open ? "rounded-2xl" : "rounded-3xl"
				)}
			>
				{/* COMPACT — the collapsed (natural) size. */}
				<div
					ref={compactRef}
					className={cn(
						"flex flex-row items-center gap-1 p-[3px] transition-opacity duration-150",
						open && "pointer-events-none"
					)}
				>
					<Link
						href="/"
						aria-label="Byron Wade — home"
						className={cn(
							"font-signature",
							"flex h-8 shrink-0 items-center whitespace-nowrap px-2 text-dock-active-foreground text-lg leading-none transition-colors [-webkit-text-stroke:0.6px_currentColor] hover:text-brand"
						)}
					>
						Byron Wade
					</Link>
					<button
						type="button"
						aria-haspopup="dialog"
						aria-expanded={open}
						aria-controls={panelId}
						onClick={() => setOpen(true)}
						title="All products"
						className="flex size-8 items-center justify-center rounded-full text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
					>
						<LayoutGrid className="size-4" strokeWidth={2} />
					</button>
				</div>

				{/* BROWSE PANEL */}
				<div
					ref={panelRef}
					id={panelId}
					role="dialog"
					aria-label="All products"
					aria-hidden={!open}
					tabIndex={-1}
					className={cn(
						"absolute top-0 left-0 w-80 opacity-0 outline-none transition-opacity duration-150",
						open ? "pointer-events-auto" : "pointer-events-none"
					)}
				>
					<div className="flex items-center justify-between p-3.5 pb-2">
						<span className="font-semibold text-[10px] text-dock-foreground/70 uppercase tracking-wider">
							Switch product
						</span>
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Close menu"
							className="flex size-7 items-center justify-center rounded-lg text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
						>
							<X className="size-4" />
						</button>
					</div>

					<div className="flex flex-col gap-0.5 px-2 pb-2">
						{/* Current product — the site you're on. */}
						<Link
							href="/"
							onClick={() => setOpen(false)}
							className="group flex items-center gap-3 rounded-xl bg-brand/10 p-2 transition-colors hover:bg-brand/15"
						>
							<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dock-active-foreground">
								<span className="size-2 rounded-full bg-brand" />
							</span>
							<div className="min-w-0 leading-tight">
								<div className="truncate font-semibold text-[13px] text-dock-active-foreground">
									byronwade<span className="text-dock-foreground">.com</span>
								</div>
								<div className="truncate text-[11px] text-dock-foreground">
									Portfolio & developer
								</div>
							</div>
							<span className="ml-auto shrink-0 rounded-full bg-brand/15 px-2 py-0.5 font-medium text-[10px] text-brand">
								Current
							</span>
						</Link>

						{PRODUCTS.map((p) => (
							<a
								key={p.href}
								href={p.href}
								target="_blank"
								rel="noreferrer"
								className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-dock-active"
							>
								<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 font-bold text-[13px] text-dock-active-foreground">
									{p.mark}
								</span>
								<div className="min-w-0 leading-tight">
									<div className="truncate font-semibold text-[13px] text-dock-active-foreground">
										{p.name}
									</div>
									<div className="truncate text-[11px] text-dock-foreground">{p.desc}</div>
								</div>
								<ArrowUpRight className="ml-auto size-4 shrink-0 text-dock-foreground/40 transition-colors group-hover:text-dock-foreground" />
							</a>
						))}
					</div>

					<div className="flex items-center gap-2 border-white/5 border-t bg-black/25 p-3">
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noreferrer"
							className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-dock-active font-semibold text-[13px] text-dock-active-foreground transition-colors hover:bg-white/15"
						>
							<GitFork className="size-4" /> GitHub
						</a>
						<button
							type="button"
							onClick={toggleTheme}
							aria-label="Toggle theme"
							className="flex size-9 items-center justify-center rounded-xl text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
						>
							<Moon className="size-4 dark:hidden" />
							<Sun className="hidden size-4 dark:block" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
