"use client";

import { Image as ImageIcon, Monitor } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FigmaInteractiveViewerProps {
	fileKey: string;
	fileName: string;
	imageUrl: string | null;
}

export function FigmaInteractiveViewer({
	fileKey,
	fileName,
	imageUrl,
}: FigmaInteractiveViewerProps) {
	const [viewMode, setViewMode] = useState<"interactive" | "static">("interactive");

	return (
		<div className="space-y-6">
			{/* View Mode Toggle */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="mb-2 font-bold text-white text-xl">DESIGN VIEWER</h3>
					<p className="text-muted-foreground text-sm">
						{viewMode === "interactive"
							? "Interactive Figma embed - zoom, pan, and explore the design"
							: "High-resolution static preview of the design"}
					</p>
				</div>
				<div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted p-1">
					<Button
						size="sm"
						variant={viewMode === "interactive" ? "default" : "ghost"}
						onClick={() => setViewMode("interactive")}
						className="h-8 px-3 text-xs"
					>
						<Monitor className="mr-1 h-3 w-3" />
						Interactive
					</Button>
					<Button
						size="sm"
						variant={viewMode === "static" ? "default" : "ghost"}
						onClick={() => setViewMode("static")}
						className="h-8 px-3 text-xs"
					>
						<ImageIcon className="mr-1 h-3 w-3" />
						Preview
					</Button>
				</div>
			</div>

			{/* Interactive Figma Embed */}
			{viewMode === "interactive" && (
				<div className="group relative">
					<div className="relative overflow-hidden rounded-2xl border border-border bg-card">
						<div className="relative h-[700px] w-full sm:h-[800px] md:h-[900px] lg:h-[1000px] xl:h-[1100px] 2xl:h-[1400px]">
							<iframe
								sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
								style={{ border: "none" }}
								width="100%"
								height="100%"
								src={`https://www.figma.com/embed?embed_host=share&url=https%3A//www.figma.com/file/${fileKey}`}
								allowFullScreen
								className="rounded-xl"
								title={`Interactive ${fileName} Figma Design`}
								loading="lazy"
							/>
						</div>
					</div>
				</div>
			)}

			{/* Static Image Preview */}
			{viewMode === "static" && imageUrl && (
				<div className="group relative">
					<div className="relative overflow-hidden rounded-2xl border border-border bg-card">
						<div className="relative aspect-[16/9] w-full">
							<Image
								src={imageUrl}
								alt={fileName}
								fill
								sizes="(min-width: 1280px) 1200px, 100vw"
								className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
								priority
							/>
						</div>
					</div>
				</div>
			)}

			{/* Fallback message if no static image */}
			{viewMode === "static" && !imageUrl && (
				<div className="group relative">
					<div className="relative overflow-hidden rounded-2xl border border-border bg-card p-12 text-center">
						<ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
						<p className="text-muted-foreground">No static preview available for this design.</p>
						<p className="mt-2 text-muted-foreground/70 text-sm">
							Switch to Interactive mode to view the design.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
