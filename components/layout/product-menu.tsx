"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Every product under the byronwade umbrella — this menu is the cross-app switcher. */
const PRODUCTS: { name: string; desc: string; href: string; mark: string }[] = [
	{
		name: "byronwade/ui",
		desc: "Design system & morph chrome",
		href: "https://ui.byronwade.com",
		mark: "U",
	},
	{ name: "Thorbis", desc: "Service-business platform", href: "https://thorbis.com", mark: "T" },
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
	{ name: "Dits", desc: "Lightweight notes", href: "https://dits.byronwade.com", mark: "D" },
	{
		name: "Wormhole",
		desc: "Instant file transfer",
		href: "https://wormhole.byronwade.com",
		mark: "W",
	},
];

/**
 * Product switcher — a quiet chevron beside the wordmark that opens the full
 * byronwade catalogue. Styled on the header's `--dock` material so the panel
 * reads as an extension of the floating island.
 */
export function ProductMenu() {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<button
						type="button"
						aria-label="Switch product"
						className={cn(
							"flex size-7 items-center justify-center rounded-full text-dock-foreground/70 outline-none transition-colors hover:bg-dock-active hover:text-dock-active-foreground focus-visible:ring-2 focus-visible:ring-white/30",
							open && "bg-dock-active text-dock-active-foreground"
						)}
					/>
				}
			>
				<ChevronDown
					className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
					strokeWidth={2.5}
					aria-hidden="true"
				/>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				sideOffset={12}
				className="chrome-surface w-[min(21rem,calc(100vw-1.5rem))] gap-0 rounded-2xl p-0 text-dock-foreground ring-0"
			>
				<div className="px-3.5 pt-3.5 pb-2 text-[10px] font-semibold tracking-[0.12em] text-dock-foreground/50 uppercase">
					Switch product
				</div>

				<div className="flex flex-col gap-0.5 px-2 pb-2">
					<Link
						href="/"
						onClick={() => setOpen(false)}
						className="flex items-center gap-3 rounded-xl bg-brand/10 p-2 transition-colors hover:bg-brand/15"
					>
						<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dock-active-foreground">
							<span className="size-2 rounded-full bg-brand" />
						</span>
						<span className="min-w-0 leading-tight">
							<span className="block truncate text-[13px] font-semibold text-dock-active-foreground">
								byronwade<span className="text-dock-foreground">.com</span>
							</span>
							<span className="block truncate text-[11px] text-dock-foreground">
								Portfolio & developer
							</span>
						</span>
						<span className="ml-auto shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-medium text-brand">
							Current
						</span>
					</Link>

					{PRODUCTS.map((product) => (
						<a
							key={product.href}
							href={product.href}
							target="_blank"
							rel="noreferrer"
							className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-dock-active"
						>
							<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[13px] font-bold text-dock-active-foreground">
								{product.mark}
							</span>
							<span className="min-w-0 leading-tight">
								<span className="block truncate text-[13px] font-semibold text-dock-active-foreground">
									{product.name}
								</span>
								<span className="block truncate text-[11px] text-dock-foreground">
									{product.desc}
								</span>
							</span>
							<ArrowUpRight
								className="ml-auto size-4 shrink-0 text-dock-foreground/35 transition-colors group-hover:text-dock-foreground"
								aria-hidden="true"
							/>
						</a>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
