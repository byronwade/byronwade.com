"use client";

import {
	ExternalLink,
	Globe,
	Grip,
	Image as ImageIcon,
	Maximize2,
	Monitor,
	RotateCcw,
	Smartphone,
	Tablet,
	X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Simple in-memory cache to avoid duplicate requests for the same URL/size
const previewCache = new Map<string, Promise<string>>();

interface FullWidthProjectPreviewProps {
	href: string;
	title: string;
	url: string;
}

type LoadingState = "loading" | "loaded" | "error";

type ViewportPreset = keyof typeof VIEWPORT_PRESETS;

const VIEWPORT_PRESETS = {
	desktop: { width: 1920, height: 1080, label: "Desktop", icon: Monitor },
	laptop: { width: 1440, height: 900, label: "Laptop", icon: Monitor },
	tablet: { width: 768, height: 1024, label: "Tablet", icon: Tablet },
	mobile: { width: 375, height: 667, label: "Mobile", icon: Smartphone },
} as const;

const MAX_NON_FULLSCREEN_WIDTH = 1280;

export function FullWidthProjectPreview({ href, title, url }: FullWidthProjectPreviewProps) {
	const [screenshotState, setScreenshotState] = useState<LoadingState>("loading");
	const [staticUrl, setStaticUrl] = useState<string | null>(null);
	const [animatedUrl, setAnimatedUrl] = useState<string | null>(null);
	const [screenshotDims, setScreenshotDims] = useState<{ w: number; h: number } | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [manualWidth, setManualWidth] = useState<number | null>(null);
	const [committedWidth, setCommittedWidth] = useState<number | null>(null);
	const [selectedPreset, setSelectedPreset] = useState<ViewportPreset>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [mounted, setMounted] = useState(false);

	const resizeRafRef = useRef<number | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const minWidth = 320;

	const baseViewport = useMemo(() => VIEWPORT_PRESETS[selectedPreset], [selectedPreset]);

	const screenshotViewport = useMemo(() => {
		const clampWidth = (width: number) =>
			isFullscreen ? width : Math.min(width, MAX_NON_FULLSCREEN_WIDTH);

		if (isFullscreen) {
			const availableWidth = typeof window !== "undefined" ? window.innerWidth - 40 : 1920;
			const availableHeight = typeof window !== "undefined" ? window.innerHeight - 120 : 1080;
			return {
				width: Math.round(availableWidth),
				height: Math.round(availableHeight),
			};
		}

		if (committedWidth !== null) {
			return {
				width: Math.round(clampWidth(committedWidth)),
				height: Math.round(clampWidth(committedWidth) / (16 / 9)),
			};
		}

		return {
			width: clampWidth(baseViewport.width),
			height: baseViewport.height,
		};
	}, [isFullscreen, committedWidth, baseViewport]);

	const displayViewport = useMemo(() => {
		if (manualWidth !== null) {
			return {
				width: Math.round(manualWidth),
				height: Math.round(manualWidth / (16 / 9)),
			};
		}
		return screenshotViewport;
	}, [manualWidth, screenshotViewport]);

	const maxWidth = useMemo(() => {
		if (isFullscreen) {
			return typeof window !== "undefined" ? window.innerWidth - 40 : 1920;
		}
		return containerWidth || 1920;
	}, [isFullscreen, containerWidth]);

	const displayWidth = useMemo(() => {
		if (isFullscreen) {
			const availableWidth = typeof window !== "undefined" ? window.innerWidth - 40 : 1200;
			const availableHeight = typeof window !== "undefined" ? window.innerHeight - 120 : 800;
			const aspectRatio = displayViewport.width / displayViewport.height;
			const widthFromHeight = availableHeight * aspectRatio;
			return Math.min(availableWidth, widthFromHeight, displayViewport.width);
		}

		if (manualWidth !== null) {
			return Math.min(manualWidth, containerWidth);
		}

		return Math.min(containerWidth, Math.min(baseViewport.width, MAX_NON_FULLSCREEN_WIDTH));
	}, [isFullscreen, manualWidth, containerWidth, baseViewport, displayViewport]);

	const scale = useMemo(() => {
		if (isFullscreen) return 1;
		if (displayWidth <= 0 || screenshotViewport.width <= 0) return 0.5;
		return Math.min(displayWidth / screenshotViewport.width, 1);
	}, [isFullscreen, displayWidth, screenshotViewport.width]);

	const displayHeight = useMemo(() => {
		if (screenshotDims && screenshotDims.w > 0) {
			return Math.max(
				200,
				Math.round((displayWidth * screenshotDims.h) / screenshotDims.w)
			);
		}
		// default 16:9 if dims unknown
		return Math.max(200, Math.round(displayWidth / (16 / 9)));
	}, [displayWidth, screenshotDims]);

	useEffect(() => {
		const requestWidth = 1920;
		const requestHeight = 1080;
		const staticKey = `${href}|${requestWidth}x${requestHeight}|static`;

		setAnimatedUrl(null);
		const loadStatic = async () => {
			const loader = async () => {
				const resp = await fetch(
					`/api/screenshot?mode=static&url=${encodeURIComponent(
						href
					)}&width=${requestWidth}&height=${requestHeight}&format=jpg&quality=90`
				);
				if (!resp.ok) throw new Error("static request failed");
				const data = await resp.json();
				if (!data?.url || typeof data.url !== "string" || data.url.trim() === "") {
					return null;
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
				setScreenshotState("loading");
				const staticUrlValue = await loadStatic();
				if (mounted) {
					if (staticUrlValue) {
						setStaticUrl(staticUrlValue);
						setScreenshotState("loaded");
					}
				}
			} catch (error) {
				console.error("Error fetching screenshot:", error);
				if (mounted) setScreenshotState("error");
			}
		})();

		return () => {
			mounted = false;
		};
	}, [href]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!wrapperRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newWidth = entry.contentRect.width;
				if (newWidth > 0) {
					setContainerWidth(newWidth);
				}
			}
		});

		resizeObserver.observe(wrapperRef.current);

		const initialWidth = wrapperRef.current.getBoundingClientRect().width;
		if (initialWidth > 0) {
			setContainerWidth(initialWidth);
		}

		return () => resizeObserver.disconnect();
	}, []);

	const handleResizeMove = useCallback(
		(clientX: number) => {
			if (!isResizing || !wrapperRef.current) return;

			const run = () => {
				const wrapperRect = wrapperRef.current!.getBoundingClientRect();
				const centerX = wrapperRect.left + wrapperRect.width / 2;
				const distanceFromCenter = Math.abs(clientX - centerX);
				const newWidth = distanceFromCenter * 2;
				const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
				setManualWidth(clampedWidth);
				resizeRafRef.current = null;
			};

			if (resizeRafRef.current === null) {
				resizeRafRef.current = window.requestAnimationFrame(run);
			}
		},
		[isResizing, minWidth, maxWidth]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => handleResizeMove(e.clientX),
		[handleResizeMove]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (e.touches.length > 0) {
				handleResizeMove(e.touches[0].clientX);
			}
		},
		[handleResizeMove]
	);

	const handleResizeEnd = useCallback(() => {
		setIsResizing(false);
		if (manualWidth !== null) {
			setCommittedWidth(manualWidth);
		}
	}, [manualWidth]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	useEffect(() => {
		if (isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleResizeEnd);
			document.addEventListener("touchmove", handleTouchMove, { passive: false });
			document.addEventListener("touchend", handleResizeEnd);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleResizeEnd);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleResizeEnd);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};
		}
	}, [isResizing, handleMouseMove, handleTouchMove, handleResizeEnd]);

	const handleResetWidth = useCallback(() => {
		setManualWidth(null);
		setCommittedWidth(null);
	}, []);

	const handleToggleFullscreen = useCallback(() => {
		setIsFullscreen((prev) => {
			if (!prev) {
				setSelectedPreset("desktop");
			}
			return !prev;
		});
		setManualWidth(null);
		setCommittedWidth(null);
	}, []);

	const handleVideoLoaded = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
		const video = e.currentTarget;
		if (video?.videoWidth && video?.videoHeight) {
			setScreenshotDims({ w: video.videoWidth, h: video.videoHeight });
		}
		setScreenshotState("loaded");
	}, []);

	const handleVideoError = useCallback(() => {
		setScreenshotState("error");
	}, []);

	useEffect(() => {
		setManualWidth(null);
		setCommittedWidth(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPreset]);

	const isLoading = screenshotState === "loading";

	const previewContent = (
		<div
			className={`relative flex flex-col transition-all duration-300 ease-out ${isFullscreen ? "w-full h-full" : ""}`}
			style={{
				width: isFullscreen ? "100%" : `${displayWidth}px`,
				height: isFullscreen ? "100%" : "auto",
				maxWidth: isFullscreen ? "none" : "100%",
			}}
		>
			{/* Frame container */}
			<div
				className={`relative overflow-hidden bg-background ${isFullscreen ? "rounded-none border-0 h-full flex flex-col" : "rounded-xl border border-border shadow-sm"}`}
			>
				{/* Top toolbar */}
				<div className="flex items-center justify-between h-10 px-3 border-b border-border bg-secondary">
					{/* Left side - URL */}
					<div className="flex items-center gap-2 min-w-0 flex-1">
						<Globe className="w-3.5 h-3.5 text-foreground shrink-0" strokeWidth={1.5} />
						<span className="text-xs text-foreground truncate font-mono">{url}</span>
					</div>

					{/* Center - Device toggles (hidden in fullscreen) */}
					{!isFullscreen && (
						<div className="hidden md:flex items-center gap-0.5 mx-4">
							{(Object.keys(VIEWPORT_PRESETS) as ViewportPreset[]).map((preset) => {
								const { icon: Icon, label, width, height } = VIEWPORT_PRESETS[preset];
								const isActive = selectedPreset === preset;
								return (
									<button
										key={preset}
										type="button"
										onClick={() => setSelectedPreset(preset)}
										className={`p-1.5 rounded-md transition-all ${
											isActive
												? "bg-primary text-primary-foreground"
												: "text-foreground hover:text-accent hover:bg-accent/10"
										}`}
										title={`${label} (${width}×${height})`}
									>
										<Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
									</button>
								);
							})}
						</div>
					)}

					{/* Right side - Actions */}
					<div className="flex items-center gap-1 shrink-0">
						{manualWidth !== null && (
							<button
								type="button"
								onClick={handleResetWidth}
								className="p-1.5 rounded-md text-foreground hover:text-accent hover:bg-accent/10 transition-all"
								title="Reset width"
							>
								<RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
							</button>
						)}

						<button
							type="button"
							onClick={handleToggleFullscreen}
							className="p-1.5 rounded-md text-foreground hover:text-accent hover:bg-accent/10 transition-all"
							title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
						>
							{isFullscreen ? (
								<X className="w-3.5 h-3.5" strokeWidth={1.5} />
							) : (
								<Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
							)}
						</button>

						<div className="w-px h-4 bg-border mx-1" />

						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
						>
							<span className="hidden sm:inline">Visit</span>
							<ExternalLink className="w-3 h-3" strokeWidth={1.5} />
						</a>
					</div>
				</div>

				{/* Preview area */}
				<div
					className={`relative w-full bg-background overflow-auto ${isFullscreen ? "flex-1" : "flex items-start justify-center"}`}
					style={
						isFullscreen
							? {}
							: {
									height: `${displayHeight}px`,
									minHeight: "200px",
									maxHeight: "90vh",
								}
					}
				>
					{isLoading && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-4 overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/10 animate-pulse" />
							<div className="relative">
								<div className="w-8 h-8 rounded-full border-2 border-border" />
								<div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-accent animate-spin" />
							</div>
							<p className="text-xs text-muted-foreground font-medium relative">Loading preview...</p>
						</div>
					)}

					<div
						ref={imageContainerRef}
						className={`relative ${isFullscreen ? "w-full h-full" : ""}`}
						style={
							isFullscreen
								? {}
								: {
										width: `${displayWidth}px`,
										height: `${displayHeight}px`,
										overflow: "hidden",
									}
						}
					>
						{animatedUrl && animatedUrl.trim() !== "" && screenshotState !== "error" ? (
							<video
								key={animatedUrl}
								ref={videoRef}
								src={animatedUrl}
								className="w-full h-full object-cover"
								style={{
									border: "none",
									opacity: screenshotState === "loaded" ? 1 : 0,
									transition: "opacity 0.3s ease-in-out",
									display: "block",
								}}
								title={`Scrolling preview of ${title}`}
								playsInline
								autoPlay
								muted
								loop
								onLoadedMetadata={handleVideoLoaded}
								onError={handleVideoError}
							/>
						) : staticUrl ? (
							<div className="relative w-full h-full">
								<Image
									src={staticUrl}
									alt={`Screenshot of ${title}`}
									fill
									className="object-cover"
									onLoad={() => setScreenshotState("loaded")}
									onError={handleVideoError}
									priority
									unoptimized
								/>
							</div>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center bg-background gap-3 text-center p-4">
								<ImageIcon className="w-10 h-10 text-muted-foreground" />
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Preview unavailable</p>
									<p className="text-xs text-muted-foreground/80">
										Click the “Visit” button to open the live site.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex items-center justify-between h-7 px-3 border-t border-border bg-secondary">
					<div className="flex items-center gap-2 text-[10px] text-foreground font-mono">
						<span className={isResizing ? "text-accent" : ""}>
							{displayViewport.width}×{displayViewport.height}
						</span>
						<span className="text-muted-foreground">•</span>
						<span>{Math.round(scale * 100)}%</span>
						{isResizing && <span className="text-accent animate-pulse">Release to apply</span>}
					</div>

					{isFullscreen && (
						<div className="text-[10px] text-foreground font-mono">
							Press <kbd className="px-1 py-0.5 rounded bg-secondary text-foreground">ESC</kbd> to exit
						</div>
					)}
				</div>
			</div>

			{/* Resize handles */}
			{!isFullscreen && (
				<>
					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						className={`absolute top-1/2 -right-4 -translate-y-1/2 z-40 cursor-ew-resize touch-none group ${
							isResizing ? "opacity-100" : "opacity-0 hover:opacity-100"
						} transition-opacity duration-200`}
					>
						<div
							className={`flex items-center justify-center w-6 h-12 rounded-full border border-border bg-background shadow-md transition-all ${
								isResizing ? "bg-primary border-primary" : "group-hover:border-accent/50"
							}`}
						>
							<Grip
								className={`w-3 h-3 transition-colors ${
									isResizing ? "text-primary-foreground" : "text-foreground group-hover:text-accent"
								}`}
								strokeWidth={1.5}
							/>
						</div>
					</div>

					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						className={`absolute top-1/2 -left-4 -translate-y-1/2 z-40 cursor-ew-resize touch-none group ${
							isResizing ? "opacity-100" : "opacity-0 hover:opacity-100"
						} transition-opacity duration-200`}
					>
						<div
							className={`flex items-center justify-center w-6 h-12 rounded-full border border-border bg-background shadow-md transition-all ${
								isResizing ? "bg-primary border-primary" : "group-hover:border-accent/50"
							}`}
						>
							<Grip
								className={`w-3 h-3 transition-colors ${
									isResizing ? "text-primary-foreground" : "text-foreground group-hover:text-accent"
								}`}
								strokeWidth={1.5}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);

	return (
		<div ref={wrapperRef} className="w-full mb-12">
			{isFullscreen &&
				mounted &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed inset-0 z-[9998] bg-black flex flex-col"
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setIsFullscreen(false);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setIsFullscreen(false);
							}
						}}
						role="dialog"
						aria-modal="true"
						tabIndex={-1}
					>
						{previewContent}
					</div>,
					document.body
				)}

			{!isFullscreen && <div className="w-full flex justify-center">{previewContent}</div>}
		</div>
	);
}
