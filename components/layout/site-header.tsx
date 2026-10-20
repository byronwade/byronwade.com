// Thorbis site-header / site-shell.stylex: single surface, fixed chrome, 42rem measure.
import Image from "next/image";
import Link from "next/link";
import { DockToolbar } from "@/components/layout/dock-toolbar";
import { NavDock } from "@/components/layout/nav-dock";
import { Box, FileText, Home, Layers, PenLine } from "@/lib/icons";
import type { SearchEntry } from "@/lib/search-types";

/** Static identity and navigation glyphs stay outside the client bundle. */
export function SiteHeader({ entries }: { entries: SearchEntry[] }) {
	return (
		<NavDock
			brand={
				<Link
					href="/"
					prefetch={false}
					className="flex min-h-11 min-w-11 items-center gap-2 text-foreground outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
				>
					<Image
						src="/icon.png"
						alt=""
						width={22}
						height={22}
						unoptimized
						className="size-5.5 shrink-0 object-contain"
					/>
					<span className="@max-[16rem]/site-header:sr-only grid min-w-0 gap-[0.05rem] leading-[1.15]">
						<span className="whitespace-nowrap font-medium text-copy-13 leading-[1.15] tracking-[-0.03em]">
							Byron Wade
						</span>
						<span className="hidden truncate font-medium text-copy-12 text-muted-foreground leading-[1.15] tracking-[-0.015em] sm:inline">
							Design & engineering
						</span>
					</span>
				</Link>
			}
			tools={<DockToolbar entries={entries} />}
			icons={{
				"/": <Home weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-olive)" />,
				"/projects": <Box weight="regular" aria-hidden="true" className="size-4 text-brand" />,
				"/portfolio": (
					<Layers weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-forest)" />
				),
				"/blog": (
					<PenLine
						weight="regular"
						aria-hidden="true"
						className="size-4 text-(--thorbis-pumpkin)"
					/>
				),
				"/resume": (
					<FileText weight="regular" aria-hidden="true" className="size-4 text-(--thorbis-burnt)" />
				),
			}}
		/>
	);
}
