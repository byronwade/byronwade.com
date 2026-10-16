"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";
import { useCapsuleMorph } from "@/hooks/use-capsule-morph";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { cn } from "@/lib/utils";

const CapsulePanel = dynamic(
	() => import("./capsule-panel").then((module) => module.CapsulePanel),
	{ ssr: false }
);

const GITHUB_URL = "https://github.com/byronwade";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Every product under the byronwade umbrella, the launcher is the cross-app switcher. */
const PRODUCTS: { name: string; desc: string; href: string; mark: string }[] = [
	{
		name: "Thorbis Design",
		desc: "Interface guidelines & components",
		href: "https://design.thorbis.com",
		mark: "T",
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
 * Thorbis panel/neutral surfaces adapt the existing product launcher. It opens
 * from its trigger and preserves the site product links, theme and GitHub tools.
 */
export function AppLauncherClient({
	icons,
}: {
	icons: {
		products: React.ReactNode;
		close: React.ReactNode;
		external: React.ReactNode;
		github: React.ReactNode;
		theme: React.ReactNode;
	};
}) {
	const [open, setOpen] = React.useState(false);

	const rootRef = React.useRef<HTMLDivElement>(null);
	const morphRef = React.useRef<HTMLDivElement>(null);
	const compactRef = React.useRef<HTMLDivElement>(null);
	const [panel, setPanel] = React.useState<HTMLDivElement | null>(null);
	const expanded = open && panel !== null;

	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const panelId = React.useId();

	// The launcher is an overlay-in-a-slot: the absolutely-positioned morph blooms
	// right + down. The slot reserves the collapsed pill's footprint (seeded with
	// the exact collapsed box) so nothing jumps on first paint.

	useIsoLayoutEffect(() => {
		const compact = compactRef.current;
		const morph = morphRef.current;
		const slot = rootRef.current;
		if (!(compact && morph && slot)) {
			return;
		}
		const sync = () => {
			if (morph.style.width) {
				return; // morphed open, leave the slot alone
			}
			// Geometry belongs to the observer; it does not require a React render.
			slot.style.width = `${morph.offsetWidth}px`;
			slot.style.height = `${morph.offsetHeight}px`;
		};
		const ro = new ResizeObserver(sync);
		ro.observe(compact);
		return () => ro.disconnect();
	}, []);

	useCapsuleMorph({
		open,
		morphRef,
		compactRef,
		panel,
		onOpened: () => panel?.focus({ preventScroll: true }),
	});

	const { toggleTheme } = useThemeToggle();

	return (
		<div
			ref={rootRef}
			style={{
				width: 76,
				height: 58,
				transition: "width var(--motion-base) var(--motion-ease-drawer)",
			}}
			className={cn("relative shrink-0", expanded ? "z-[60]" : "z-10")}
		>
			<div
				ref={morphRef}
				className={cn(
					"pointer-events-auto absolute top-0 left-0 inline-flex transform-gpu overflow-hidden border border-dock-border bg-dock text-dock-foreground [will-change:width,height]",
					expanded ? "rounded-xl shadow-float" : "rounded-full"
				)}
			>
				{/* COMPACT, the collapsed (natural) size. */}
				<div
					ref={compactRef}
					inert={expanded}
					className={cn(
						"flex flex-row items-center gap-1 p-1.5 transition-opacity duration-(--motion-fast)",
						expanded && "pointer-events-none"
					)}
				>
					<Link
						prefetch={false}
						href="/"
						aria-label="Byron Wade, home"
						className={cn(
							"font-sans",
							"hidden h-11 shrink-0 items-center whitespace-nowrap px-2 font-medium text-copy-14 text-dock-active-foreground leading-none transition-colors hover:text-brand min-[380px]:flex"
						)}
					>
						Byron Wade
					</Link>
					<button
						type="button"
						aria-haspopup="dialog"
						aria-expanded={expanded}
						aria-busy={open && !panel}
						aria-controls={panel ? panelId : undefined}
						onClick={() => setOpen(true)}
						ref={triggerRef}
						title="All products"
						className="flex size-11 items-center justify-center rounded-full text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
					>
						{icons.products}
					</button>
				</div>

				{/* BROWSE PANEL */}
				{(open || panel) && (
					<CapsulePanel
						morphRef={morphRef}
						panelRef={setPanel}
						finalFocus={triggerRef}
						id={panelId}
						label="All products"
						open={open}
						onOpenChange={setOpen}
						className="left-0 w-[min(20rem,calc(100vw-3rem))]"
					>
						{(Close) =>
							open && (
								<>
									<div className="flex items-center justify-between p-3.5 pb-2">
										<span className="text-[11px] text-dock-foreground">Switch product</span>
										<Close
											type="button"
											aria-label="Close menu"
											className="flex size-11 items-center justify-center rounded-lg text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
										>
											{icons.close}
										</Close>
									</div>

									<div className="flex flex-col gap-0.5 px-2 pb-2">
										{/* Current product, the site you're on. */}
										<Link
											prefetch={false}
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
											<span className="ml-auto shrink-0 rounded-full bg-dock-active px-2 py-0.5 font-medium text-[10px] text-dock-active-foreground">
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
												<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dock-muted font-bold text-[13px] text-dock-active-foreground">
													{p.mark}
												</span>
												<div className="min-w-0 leading-tight">
													<div className="truncate font-semibold text-[13px] text-dock-active-foreground">
														{p.name}
													</div>
													<div className="truncate text-[11px] text-dock-foreground">{p.desc}</div>
												</div>
												{icons.external}
											</a>
										))}
									</div>

									<div className="flex items-center gap-2 border-dock-border border-t bg-dock-muted p-3">
										<a
											href={GITHUB_URL}
											target="_blank"
											rel="noreferrer"
											className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-dock-active font-semibold text-[13px] text-dock-active-foreground transition-colors hover:bg-dock-muted"
										>
											{icons.github} GitHub
										</a>
										<button
											type="button"
											onClick={toggleTheme}
											aria-label="Toggle theme"
											className="flex size-11 items-center justify-center rounded-xl text-dock-foreground transition-colors hover:bg-dock-active hover:text-dock-active-foreground"
										>
											{icons.theme}
										</button>
									</div>
								</>
							)
						}
					</CapsulePanel>
				)}
			</div>
		</div>
	);
}
