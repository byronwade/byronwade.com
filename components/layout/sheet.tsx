// Thorbis Design port: guidelines/specimen-styles frame/sheet/note @ 46b6654.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A piece of real work, set on a sheet with a caption under it.
 *
 * This is the one framed object Thorbis allows on a page: a rimmed panel with
 * the source 14px radius and panel elevation, and a 12px marker caption that
 * says what the reader is looking at. It is not a card for spacing or for a
 * number. Below 40rem the sheet bleeds to the screen edge and drops its side
 * rims, radius and shadow, exactly as the source specimen does, so the work
 * gets the full phone width instead of a box inside a box.
 */
export function Sheet({
	caption,
	children,
	className,
	label,
}: {
	caption?: ReactNode;
	children: ReactNode;
	className?: string;
	/** Accessible name for the framed region when it has no visible heading. */
	label?: string;
}) {
	return (
		<figure aria-label={label} className={cn("-mx-4 flex flex-col gap-4 sm:mx-0", className)}>
			<div
				className="overflow-hidden border-border border-y bg-card p-2.5 sm:rounded-lg sm:border sm:shadow-card"
				data-slot="sheet"
			>
				{children}
			</div>
			{caption && (
				<figcaption className="px-4 text-copy-12 text-muted-foreground sm:px-0">
					{caption}
				</figcaption>
			)}
		</figure>
	);
}
