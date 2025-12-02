"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
	Download,
	Maximize,
	Minimize,
	Move,
	RefreshCw,
	RotateCcw,
	RotateCw,
	Share2,
	X,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface InteractiveImageViewerProps {
	src: string;
	alt: string;
	title?: string;
	className?: string;
	downloadUrl?: string;
}

export function InteractiveImageViewer({
	src,
	alt,
	title,
	className,
	downloadUrl,
}: InteractiveImageViewerProps) {
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [showControls, _setShowControls] = useState(true);

	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);

	const handleZoomIn = useCallback(() => {
		setScale((prev) => Math.min(prev * 1.2, 5));
	}, []);

	const handleZoomOut = useCallback(() => {
		setScale((prev) => Math.max(prev / 1.2, 0.1));
	}, []);

	const handleRotateRight = useCallback(() => {
		setRotation((prev) => (prev + 90) % 360);
	}, []);

	const handleRotateLeft = useCallback(() => {
		setRotation((prev) => (prev - 90 + 360) % 360);
	}, []);

	const handleReset = useCallback(() => {
		setScale(1);
		setRotation(0);
		setPosition({ x: 0, y: 0 });
	}, []);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (e.button === 0) {
				// Left mouse button
				setIsDragging(true);
				setDragStart({
					x: e.clientX - position.x,
					y: e.clientY - position.y,
				});
			}
		},
		[position]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (isDragging) {
				setPosition({
					x: e.clientX - dragStart.x,
					y: e.clientY - dragStart.y,
				});
			}
		},
		[isDragging, dragStart]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleWheel = useCallback((e: React.WheelEvent) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
	}, []);

	const handleFullscreen = useCallback(() => {
		setIsFullscreen((prev) => !prev);
	}, []);

	const handleDownload = useCallback(async () => {
		try {
			const response = await fetch(downloadUrl || src);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = title || "design-image";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Download failed:", error);
		}
	}, [downloadUrl, src, title]);

	const handleShare = useCallback(async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: title || "Design",
					url: window.location.href,
				});
			} catch (error) {
				console.error("Share failed:", error);
			}
		} else {
			// Fallback: copy URL to clipboard
			navigator.clipboard.writeText(window.location.href);
		}
	}, [title]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			switch (e.key) {
				case "+":
				case "=":
					e.preventDefault();
					handleZoomIn();
					break;
				case "-":
					e.preventDefault();
					handleZoomOut();
					break;
				case "r":
					e.preventDefault();
					handleRotateRight();
					break;
				case "R":
					e.preventDefault();
					handleRotateLeft();
					break;
				case "0":
					e.preventDefault();
					handleReset();
					break;
				case "f":
					e.preventDefault();
					handleFullscreen();
					break;
				case "Escape":
					if (isFullscreen) {
						e.preventDefault();
						setIsFullscreen(false);
					}
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		handleZoomIn,
		handleZoomOut,
		handleRotateRight,
		handleRotateLeft,
		handleReset,
		handleFullscreen,
		isFullscreen,
	]);

	const controlsContent = (
		<div className="flex flex-wrap items-center gap-2 p-3 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
			<div className="flex items-center gap-1">
				<Button
					size="sm"
					variant="outline"
					onClick={handleZoomOut}
					disabled={scale <= 0.1}
					className="h-8 w-8 p-0"
				>
					<ZoomOut className="h-4 w-4" />
				</Button>

				<div className="w-20 mx-2">
					<Slider
						value={[scale]}
						onValueChange={([value]) => setScale(value)}
						min={0.1}
						max={5}
						step={0.1}
						className="w-full"
					/>
				</div>

				<Button
					size="sm"
					variant="outline"
					onClick={handleZoomIn}
					disabled={scale >= 5}
					className="h-8 w-8 p-0"
				>
					<ZoomIn className="h-4 w-4" />
				</Button>

				<span className="text-xs text-muted-foreground ml-1 min-w-[3rem]">
					{Math.round(scale * 100)}%
				</span>
			</div>

			<div className="h-4 w-px bg-border" />

			<div className="flex items-center gap-1">
				<Button size="sm" variant="outline" onClick={handleRotateLeft} className="h-8 w-8 p-0">
					<RotateCcw className="h-4 w-4" />
				</Button>
				<Button size="sm" variant="outline" onClick={handleRotateRight} className="h-8 w-8 p-0">
					<RotateCw className="h-4 w-4" />
				</Button>
				<Button size="sm" variant="outline" onClick={handleReset} className="h-8 w-8 p-0">
					<RefreshCw className="h-4 w-4" />
				</Button>
			</div>

			<div className="h-4 w-px bg-border" />

			<div className="flex items-center gap-1">
				<Button size="sm" variant="outline" onClick={handleFullscreen} className="h-8 w-8 p-0">
					{isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
				</Button>
				<Button size="sm" variant="outline" onClick={handleDownload} className="h-8 w-8 p-0">
					<Download className="h-4 w-4" />
				</Button>
				<Button size="sm" variant="outline" onClick={handleShare} className="h-8 w-8 p-0">
					<Share2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);

	return (
		<>
			<div
				ref={containerRef}
				className={cn(
					"relative overflow-hidden bg-secondary/50 border border-border rounded-lg group",
					isFullscreen && "fixed inset-0 z-50 bg-background rounded-none",
					className
				)}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onWheel={handleWheel}
			>
				{/* Image Container */}
				<div
					ref={imageRef}
					className={cn(
						"relative w-full h-full flex items-center justify-center cursor-grab",
						isDragging && "cursor-grabbing",
						!isFullscreen && "aspect-[4/3]",
						isFullscreen && "min-h-screen"
					)}
					onMouseDown={handleMouseDown}
					style={{
						transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
						transition: isDragging ? "none" : "transform 0.2s ease-out",
					}}
				>
					<Image
						src={src}
						alt={alt}
						fill
						className="object-contain pointer-events-none select-none"
						sizes={
							isFullscreen ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
						}
						priority
					/>
				</div>

				{/* Controls */}
				<div
					className={cn(
						"absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-200",
						showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
					)}
				>
					{controlsContent}
				</div>

				{/* Fullscreen Close Button */}
				{isFullscreen && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => setIsFullscreen(false)}
						className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/95 backdrop-blur-sm"
					>
						<X className="h-4 w-4" />
					</Button>
				)}

				{/* Instructions */}
				<div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<div>Drag to pan • Scroll to zoom</div>
					<div>+ - to zoom • R to rotate • F for fullscreen</div>
				</div>
			</div>
		</>
	);
}
