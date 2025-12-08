"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Simple in-memory cache to avoid duplicate requests per URL/size
const previewCache = new Map<string, Promise<string>>();

interface ProjectPreviewProps {
	href: string;
	title: string;
	url: string;
	children: React.ReactNode;
	className?: string;
}

export function ProjectPreview({ href, title, url, children, className }: ProjectPreviewProps) {
	const [screenshotError, setScreenshotError] = useState(false);
	const [screenshotLoading, setScreenshotLoading] = useState(true);
	const [staticUrl, setStaticUrl] = useState<string | null>(null);
	const [animatedUrl, setAnimatedUrl] = useState<string | null>(null);
	const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
	const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLAnchorElement>(null);

	const VIRTUAL_WIDTH = 1920;
	const VIRTUAL_HEIGHT = 1080;
	// Request a single canonical size to avoid multiple network calls
	const REQUEST_WIDTH = 1920;
	const REQUEST_HEIGHT = 1080;

	// Fetch static first, then scrolling (background) when preview opens
	useEffect(() => {
		if (!isOpen) return;

		const staticKey = `${href}|${REQUEST_WIDTH}x${REQUEST_HEIGHT}|static`;
		// always reset any previous animation when reopening
		setAnimatedUrl(null);

		const loadStatic = async () => {
			const loader = async () => {
				const resp = await fetch(
					`/api/screenshot?mode=static&url=${encodeURIComponent(
						href
					)}&width=${REQUEST_WIDTH}&height=${REQUEST_HEIGHT}&format=jpg&quality=88`
				);
				if (!resp.ok) throw new Error("static request failed");
				const data = await resp.json();
				if (!data?.url || typeof data.url !== "string" || data.url.trim() === "") {
					throw new Error("static request returned empty url");
				}
				return data.url as string;
			};
			const promise = previewCache.get(staticKey) ?? loader();
			if (!previewCache.has(staticKey)) previewCache.set(staticKey, promise);
			return promise;
		};

		let mounted = true;
		(async () => {
			try {
				setScreenshotLoading(true);
				setScreenshotError(false);
				const staticUrlValue = await loadStatic();
				if (mounted) setStaticUrl(staticUrlValue);
			} catch (error) {
				console.error("Error fetching screenshot:", error);
				if (mounted) setScreenshotError(true);
			} finally {
				if (mounted) setScreenshotLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [isOpen, href]);

	// Track global mouse position
	useEffect(() => {
		if (!isOpen) return;

		const handleDocumentMouseMove = (e: MouseEvent) => {
			// Use clientX/clientY which are relative to viewport
			setCursorPosition({
				x: Math.max(0, Math.min(e.clientX, window.innerWidth)),
				y: Math.max(0, Math.min(e.clientY, window.innerHeight)),
			});
		};

		document.addEventListener("mousemove", handleDocumentMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleDocumentMouseMove);
		};
	}, [isOpen]);

	// Handle trigger hover
	useEffect(() => {
		const handleTriggerMouseMove = (e: MouseEvent) => {
			// Update cursor position when moving over trigger
			setCursorPosition({ x: e.clientX, y: e.clientY });
		};

		const handleTriggerMouseEnter = () => {
			setIsOpen(true);
		};

		const handleTriggerMouseLeave = (e: MouseEvent) => {
			// Don't close if moving to the preview
			const relatedTarget = e.relatedTarget as HTMLElement;
			const trigger = triggerRef.current;
			if (!relatedTarget || !previewRef.current?.contains(relatedTarget)) {
				// Add a small delay to allow mouse to move to preview
				setTimeout(() => {
					if (!previewRef.current?.matches(":hover") && !trigger?.matches(":hover")) {
						setIsOpen(false);
					}
				}, 100);
			}
		};

		const trigger = triggerRef.current;
		if (trigger) {
			trigger.addEventListener("mousemove", handleTriggerMouseMove);
			trigger.addEventListener("mouseenter", handleTriggerMouseEnter);
			trigger.addEventListener("mouseleave", handleTriggerMouseLeave);
		}

		return () => {
			if (trigger) {
				trigger.removeEventListener("mousemove", handleTriggerMouseMove);
				trigger.removeEventListener("mouseenter", handleTriggerMouseEnter);
				trigger.removeEventListener("mouseleave", handleTriggerMouseLeave);
			}

		};
	}, []);

	// Track mouse position inside preview for cursor indicator
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (imageContainerRef.current) {
				const rect = imageContainerRef.current.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				// Only show cursor if it's within the image container bounds
				if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
					setMousePosition({ x, y });
				} else {
					setMousePosition(null);
				}
			}
		};

		const handleMouseLeave = () => {
			setMousePosition(null);
		};

		const container = imageContainerRef.current;
		if (container) {
			container.addEventListener("mousemove", handleMouseMove);
			container.addEventListener("mouseleave", handleMouseLeave);
		}

		return () => {
			if (container) {
				container.removeEventListener("mousemove", handleMouseMove);
				container.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}, [isOpen]);

	return (
		<>
			<a
				ref={triggerRef}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"flex items-center justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1",
					className
				)}
			>
				{children}
			</a>
			{isOpen && cursorPosition && (
				<div
					ref={previewRef}
					className="fixed z-50 pointer-events-none"
					style={{
						left: `${cursorPosition.x + 20}px`,
						top: `${cursorPosition.y + 20}px`,
						maxWidth: "calc(100vw - 40px)",
						maxHeight: "calc(100vh - 40px)",
					}}
					onMouseEnter={() => setIsOpen(true)}
					onMouseMove={(e) => {
						// Update position when hovering over preview
						setCursorPosition({ x: e.clientX, y: e.clientY });
					}}
					onMouseLeave={() => {
						setTimeout(() => {
							if (!triggerRef.current?.matches(":hover")) {
								setIsOpen(false);
							}
						}, 100);
					}}
				>
					<div
						className="w-[600px] h-[400px] p-0 overflow-hidden border-accent/20 bg-[var(--background)] shadow-xl rounded-lg pointer-events-auto"
						style={{
							maxWidth: "calc(100vw - 40px)",
							maxHeight: "calc(100vh - 40px)",
						}}
					>
						<div className="relative w-full h-full bg-gray-100 dark:bg-gray-900">
							{/* Browser chrome */}
							<div className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
								<div className="flex gap-1.5">
									<div className="w-3 h-3 rounded-full bg-red-500" />
									<div className="w-3 h-3 rounded-full bg-accent" />
									<div className="w-3 h-3 rounded-full bg-green-500" />
								</div>
								<div className="flex-1 mx-3 px-3 py-1 bg-white dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 truncate">
									{url}
								</div>
							</div>
							{/* Website preview (scrolling video) */}
							<div
								ref={imageContainerRef}
								className="relative w-full h-[calc(100%-40px)] overflow-hidden bg-white dark:bg-gray-950"
							>
								{/* Cursor indicator */}
								{mousePosition && (
									<div
										className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
										style={{
											left: `${mousePosition.x}px`,
											top: `${mousePosition.y}px`,
											transform: "translate(-50%, -50%)",
										}}
									>
										<div className="relative">
											<div className="w-5 h-5 border-2 border-accent rounded-full bg-accent/30 shadow-lg backdrop-blur-sm">
												<div className="w-1.5 h-1.5 bg-accent rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
											</div>
											<div className="absolute inset-0 w-5 h-5 border border-accent/50 rounded-full animate-ping" />
										</div>
									</div>
								)}
								{screenshotLoading && !screenshotError && (
									<div className="absolute inset-0 flex items-center justify-center bg-background">
										<div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/30 to-muted/10 animate-pulse" />
										<Loader2 className="w-6 h-6 text-accent animate-spin relative" strokeWidth={1.5} />
									</div>
								)}
								{screenshotError ? (
									<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-background">
										<ExternalLink className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
										<p className="text-sm text-muted-foreground text-center">
											Preview unavailable. Click to visit the website.
										</p>
										<a
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 rounded-md transition-colors shadow-sm"
										>
											Visit {url}
										</a>
									</div>
								) : animatedUrl && animatedUrl.trim() !== "" ? (
									<div className="relative w-full h-full">
										<video
											key={animatedUrl}
											src={animatedUrl}
											style={{
												width: "100%",
												height: "100%",
												border: "none",
												display: "block",
												objectFit: "cover",
											}}
											className="object-cover"
											title={`Scrolling preview of ${title}`}
											playsInline
											autoPlay
											muted
											loop
											onLoadedMetadata={() => setScreenshotLoading(false)}
											onError={() => {
												setScreenshotError(true);
												setScreenshotLoading(false);
											}}
										/>
									</div>
								) : staticUrl ? (
									<div className="relative w-full h-full">
										<Image
											src={staticUrl}
											alt={`Screenshot of ${title}`}
											fill
											className="object-cover"
											onLoad={() => setScreenshotLoading(false)}
											onError={() => {
												setScreenshotError(true);
												setScreenshotLoading(false);
											}}
											priority
											unoptimized
										/>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
