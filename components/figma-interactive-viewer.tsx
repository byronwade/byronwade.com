"use client";

import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Monitor } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-white mb-2">DESIGN VIEWER</h3>
					<p className="text-gray-400 text-sm">
						{viewMode === "interactive"
							? "Interactive Figma embed - zoom, pan, and explore the design"
							: "High-resolution static preview of the design"}
					</p>
				</div>
				<div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 shrink-0">
					<Button
						size="sm"
						variant={viewMode === "interactive" ? "default" : "ghost"}
						onClick={() => setViewMode("interactive")}
						className="h-8 px-3 text-xs"
					>
						<Monitor className="w-3 h-3 mr-1" />
						Interactive
					</Button>
					<Button
						size="sm"
						variant={viewMode === "static" ? "default" : "ghost"}
						onClick={() => setViewMode("static")}
						className="h-8 px-3 text-xs"
					>
						<ImageIcon className="w-3 h-3 mr-1" />
						Preview
					</Button>
				</div>
			</div>

			{/* Interactive Figma Embed */}
			{viewMode === "interactive" && (
				<div className="relative group">
					<div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
					<div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
						<div className="relative w-full h-[700px] sm:h-[800px] md:h-[900px] lg:h-[1000px] xl:h-[1100px] 2xl:h-[1400px]">
							<iframe
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
				<div className="relative group">
					<div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
					<div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
						<div className="relative aspect-[16/9] w-full">
							<Image
								src={imageUrl}
								alt={fileName}
								fill
								className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
								priority
							/>
						</div>
					</div>
				</div>
			)}

			{/* Fallback message if no static image */}
			{viewMode === "static" && !imageUrl && (
				<div className="relative group">
					<div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
					<div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 p-12 text-center">
						<ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
						<p className="text-gray-400">No static preview available for this design.</p>
						<p className="text-gray-500 text-sm mt-2">
							Switch to Interactive mode to view the design.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
