"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Monitor } from "@/lib/icons";

interface FigmaInteractiveViewerProps {
	fileKey: string;
	fileName: string;
	imageUrl: string | null;
}

const MODES = [
	{ id: "interactive", label: "Interactive", icon: Monitor },
	{ id: "static", label: "Preview", icon: ImageIcon },
] as const;

type ViewMode = (typeof MODES)[number]["id"];

/**
 * Two representations of one design file (DESIGN.md §8 tabs): the live embed
 * and the exported thumbnail. The toggle is a pair of native pressed buttons;
 * the active one is filled, so the state is not carried by colour alone.
 */
export function FigmaInteractiveViewer({
	fileKey,
	fileName,
	imageUrl,
}: FigmaInteractiveViewerProps) {
	const [viewMode, setViewMode] = useState<ViewMode>("interactive");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 px-1.5 pt-1 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-0.5">
					<h3 className="font-medium text-copy-14 text-foreground">Design viewer</h3>
					<p className="text-copy-13 text-muted-foreground">
						{viewMode === "interactive"
							? "Live Figma embed. Zoom, pan, and click through the frames."
							: "The exported thumbnail, for a quick look without loading Figma."}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-1">
					{MODES.map(({ id, label, icon: Icon }) => (
						<Button
							aria-pressed={viewMode === id}
							className="rounded-full"
							key={id}
							onClick={() => setViewMode(id)}
							size="lg"
							type="button"
							variant={viewMode === id ? "secondary" : "ghost"}
						>
							<Icon aria-hidden="true" className="size-4" />
							{label}
						</Button>
					))}
				</div>
			</div>

			{viewMode === "interactive" && (
				<div className="aspect-4/3 min-h-96 w-full overflow-hidden rounded-md bg-muted sm:aspect-video">
					<iframe
						allowFullScreen
						className="size-full border-0"
						height="100%"
						loading="lazy"
						sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
						src={`https://www.figma.com/embed?embed_host=share&url=https%3A//www.figma.com/file/${fileKey}`}
						title={`Interactive ${fileName} Figma Design`}
						width="100%"
					/>
				</div>
			)}

			{viewMode === "static" && imageUrl && (
				<div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
					<Image
						alt={fileName}
						className="object-contain"
						fill
						priority
						sizes="(min-width: 1024px) 64rem, 100vw"
						src={imageUrl}
					/>
				</div>
			)}

			{viewMode === "static" && !imageUrl && (
				<div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md bg-muted px-6 text-center">
					<ImageIcon aria-hidden="true" className="size-6 text-muted-foreground" />
					<p className="font-medium text-copy-14 text-foreground">No exported preview</p>
					<p className="max-w-sm text-copy-13 text-muted-foreground">
						Figma didn’t return a thumbnail for this file. Switch to Interactive to see the design
						itself.
					</p>
				</div>
			)}
		</div>
	);
}
