"use client";

import { useTimeout } from "@/hooks/use-timeout";
import {
	ExternalLink,
	Globe,
	Grip,
	Image as ImageIcon,
	Maximize2,
	Monitor,
	Play,
	RotateCcw,
	Smartphone,
	Tablet,
	X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FullWidthProjectPreviewProps {
	href: string;
	title: string;
	url: string;
}

type DisplayMode = "iframe" | "screenshot";
type LoadingState = "loading" | "loaded" | "error";

const VIEWPORT_PRESETS = {
	desktop: { width: 1920, height: 1080, label: "Desktop", icon: Monitor },
	laptop: { width: 1440, height: 900, label: "Laptop", icon: Monitor },
	tablet: { width: 768, height: 1024, label: "Tablet", icon: Tablet },
	mobile: { width: 375, height: 667, label: "Mobile", icon: Smartphone },
} as const;

type ViewportPreset = keyof typeof VIEWPORT_PRESETS;

function getThumioScreenshotUrl(targetUrl: string, width = 1920): string {
	return `https://image.thum.io/get/width/${width}/crop/1080/noanimate/${encodeURIComponent(targetUrl)}`;
}

export function FullWidthProjectPreview({ href, title, url }: FullWidthProjectPreviewProps) {
	const [displayMode, setDisplayMode] = useState<DisplayMode>("iframe");
	const [iframeState, setIframeState] = useState<LoadingState>("loading");
	const [screenshotState, setScreenshotState] = useState<LoadingState>("loading");
	const [containerWidth, setContainerWidth] = useState(0);
	const [manualWidth, setManualWidth] = useState<number | null>(null);
	const [committedWidth, setCommittedWidth] = useState<number | null>(null); // Width committed after resize ends
	const [selectedPreset, setSelectedPreset] = useState<ViewportPreset>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const iframeContainerRef = useRef<HTMLDivElement>(null);
	const loadStartTime = useRef<number>(0);

	const minWidth = 320;
	const IFRAME_TIMEOUT_MS = 8000;
	const MIN_LOAD_TIME_MS = 1500;

	const baseViewport = useMemo(() => VIEWPORT_PRESETS[selectedPreset], [selectedPreset]);

	// The actual viewport dimensions the iframe will render at
	// This is what the website "sees" - determines which CSS media queries apply
	const iframeViewport = useMemo(() => {
		if (isFullscreen) {
			// In fullscreen, use the full available width so site fills the space
			const availableWidth = typeof window !== "undefined" ? window.innerWidth - 40 : 1920;
			const availableHeight = typeof window !== "undefined" ? window.innerHeight - 120 : 1080;
			return {
				width: Math.round(availableWidth),
				height: Math.round(availableHeight),
			};
		}
		if (committedWidth !== null) {
			// Custom width from manual resize - use 16:9 aspect ratio
			return {
				width: Math.round(committedWidth),
				height: Math.round(committedWidth / (16 / 9)),
			};
		}
		// Use the selected preset's exact dimensions so the website responds to it
		return {
			width: baseViewport.width,
			height: baseViewport.height,
		};
	}, [isFullscreen, committedWidth, baseViewport]);

	// Display viewport - what we show visually during dragging (changes in real-time)
	const displayViewport = useMemo(() => {
		if (manualWidth !== null) {
			return {
				width: Math.round(manualWidth),
				height: Math.round(manualWidth / (16 / 9)),
			};
		}
		return iframeViewport;
	}, [manualWidth, iframeViewport]);

	const maxWidth = useMemo(() => {
		if (isFullscreen) {
			return typeof window !== "undefined" ? window.innerWidth - 40 : 1920;
		}
		return containerWidth || 1920;
	}, [isFullscreen, containerWidth]);

	// Calculate the display width (how big the preview appears on screen)
	const displayWidth = useMemo(() => {
		if (isFullscreen) {
			// In fullscreen, use full available space
			const availableWidth = typeof window !== "undefined" ? window.innerWidth - 40 : 1200;
			const availableHeight = typeof window !== "undefined" ? window.innerHeight - 120 : 800;
			const aspectRatio = displayViewport.width / displayViewport.height;
			const widthFromHeight = availableHeight * aspectRatio;
			return Math.min(availableWidth, widthFromHeight, displayViewport.width);
		}

		if (manualWidth !== null) {
			// When manually resizing, the display width matches what we're dragging to
			return Math.min(manualWidth, containerWidth);
		}

		// Fit in container
		return Math.min(containerWidth, baseViewport.width);
	}, [isFullscreen, manualWidth, containerWidth, baseViewport, displayViewport]);

	// Calculate scale: how much to shrink the iframe to fit in displayWidth
	const scale = useMemo(() => {
		if (isFullscreen) {
			// No scaling in fullscreen - iframe fills the space at 1:1
			return 1;
		}
		if (displayWidth <= 0 || iframeViewport.width <= 0) return 0.5;
		return Math.min(displayWidth / iframeViewport.width, 1);
	}, [isFullscreen, displayWidth, iframeViewport.width]);

	// Display height based on display viewport aspect ratio
	const displayHeight = useMemo(() => {
		if (isFullscreen) {
			const availableHeight = typeof window !== "undefined" ? window.innerHeight - 120 : 800;
			return Math.min(displayViewport.height * scale, availableHeight);
		}
		return displayViewport.height * scale;
	}, [displayViewport.height, scale, isFullscreen]);

	// Fullscreen is always interactive
	const isInteractive = isFullscreen;

	const isByronWadeSubdomain = useCallback((checkUrl: string) => {
		try {
			const urlObj = new URL(checkUrl);
			return urlObj.hostname.endsWith(".byronwade.com") || urlObj.hostname === "byronwade.com";
		} catch {
			return false;
		}
	}, []);

	const getIframeSrc = useCallback(() => {
		if (isByronWadeSubdomain(href)) {
			return `/api/proxy-site?url=${encodeURIComponent(href)}&viewport=${iframeViewport.width}`;
		}
		return href;
	}, [href, isByronWadeSubdomain, iframeViewport.width]);

	const screenshotUrl = useMemo(() => {
		return getThumioScreenshotUrl(href, baseViewport.width);
	}, [href, baseViewport.width]);

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

	const handleIframeTimeout = useCallback(() => {
		if (iframeState === "loading") {
			setIframeState("error");
			setDisplayMode("screenshot");
		}
	}, [iframeState]);

	const { clear: clearIframeTimeout } = useTimeout(
		handleIframeTimeout,
		displayMode === "iframe" && iframeState === "loading" ? IFRAME_TIMEOUT_MS : null
	);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const handleResizeMove = useCallback(
		(clientX: number) => {
			if (!isResizing || !wrapperRef.current) return;

			const wrapperRect = wrapperRef.current.getBoundingClientRect();
			const centerX = wrapperRect.left + wrapperRect.width / 2;
			// Calculate width based on distance from center (symmetric resize)
			const distanceFromCenter = Math.abs(clientX - centerX);
			const newWidth = distanceFromCenter * 2;
			const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
			setManualWidth(clampedWidth);
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
		// Commit the width to trigger iframe reload with new viewport
		if (manualWidth !== null) {
			setCommittedWidth(manualWidth);
		}
	}, [manualWidth]);

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
				// Entering fullscreen - reset to desktop viewport
				setSelectedPreset("desktop");
			}
			return !prev;
		});
		setManualWidth(null);
		setCommittedWidth(null);
	}, []);

	const handleTryIframe = useCallback(() => {
		setDisplayMode("iframe");
		setIframeState("loading");
		setRetryCount((c) => c + 1);
		loadStartTime.current = Date.now();
	}, []);

	const handleIframeLoad = useCallback(() => {
		const elapsed = Date.now() - loadStartTime.current;
		const remainingTime = Math.max(0, MIN_LOAD_TIME_MS - elapsed);

		setTimeout(() => {
			clearIframeTimeout();
			setIframeState("loaded");
		}, remainingTime);
	}, [clearIframeTimeout]);

	const handleIframeError = useCallback(() => {
		clearIframeTimeout();
		setIframeState("error");
		setDisplayMode("screenshot");
	}, [clearIframeTimeout]);

	const handleScreenshotLoad = useCallback(() => {
		setScreenshotState("loaded");
	}, []);

	const handleScreenshotError = useCallback(() => {
		setScreenshotState("error");
	}, []);

	useEffect(() => {
		if (iframeState === "loading") {
			loadStartTime.current = Date.now();
		}
	}, [iframeState, retryCount]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isFullscreen) {
				setIsFullscreen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isFullscreen]);

	// Reset manual width and reload iframe when preset changes
	useEffect(() => {
		setManualWidth(null);
		setCommittedWidth(null);
		// Reset iframe loading state to show loading indicator during reload
		setIframeState("loading");
		loadStartTime.current = Date.now();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPreset]);

	const isLoading =
		displayMode === "iframe" ? iframeState === "loading" : screenshotState === "loading";

	const previewContent = (
		<div
			ref={containerRef}
			className={`relative flex flex-col transition-all duration-300 ease-out ${isFullscreen ? "w-full h-full" : ""}`}
			style={{
				width: isFullscreen ? "100%" : `${displayWidth}px`,
				height: isFullscreen ? "100%" : "auto",
				maxWidth: isFullscreen ? "none" : "100%",
			}}
		>
			{/* Frame container */}
			<div
				className={`relative overflow-hidden bg-white dark:bg-neutral-900 ${isFullscreen ? "rounded-none border-0 h-full flex flex-col" : "rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm"}`}
			>
				{/* Top toolbar */}
				<div className="flex items-center justify-between h-10 px-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
					{/* Left side - URL */}
					<div className="flex items-center gap-2 min-w-0 flex-1">
						<Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
						<span className="text-xs text-neutral-500 dark:text-neutral-400 truncate font-mono">
							{url}
						</span>
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
										disabled={displayMode === "screenshot"}
										className={`p-1.5 rounded-md transition-all ${
											isActive
												? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
												: "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
										} ${displayMode === "screenshot" ? "opacity-50 cursor-not-allowed" : ""}`}
										title={`${label} (${width}×${height})`}
									>
										<Icon className="w-3.5 h-3.5" />
									</button>
								);
							})}
						</div>
					)}

					{/* Right side - Actions */}
					<div className="flex items-center gap-1 shrink-0">
						{/* Screenshot indicator */}
						{displayMode === "screenshot" && (
							<div className="hidden sm:flex items-center gap-1.5 px-2 py-1 mr-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
								<ImageIcon className="w-3 h-3" />
								<span className="text-[10px] font-medium uppercase tracking-wide">Static</span>
							</div>
						)}

						{/* Try interactive */}
						{displayMode === "screenshot" && (
							<button
								type="button"
								onClick={handleTryIframe}
								className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
								title="Try interactive preview"
							>
								<Play className="w-3.5 h-3.5" />
							</button>
						)}

						{/* Reset width */}
						{manualWidth !== null && (
							<button
								type="button"
								onClick={handleResetWidth}
								className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
								title="Reset width"
							>
								<RotateCcw className="w-3.5 h-3.5" />
							</button>
						)}

						{/* Fullscreen */}
						<button
							type="button"
							onClick={handleToggleFullscreen}
							className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
							title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
						>
							{isFullscreen ? <X className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
						</button>

						{/* Divider */}
						<div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

						{/* Visit link */}
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all"
						>
							<span className="hidden sm:inline">Visit</span>
							<ExternalLink className="w-3 h-3" />
						</a>
					</div>
				</div>

				{/* Preview area */}
				<div
					ref={iframeContainerRef}
					className={`relative w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden ${isFullscreen ? "flex-1" : "flex items-start justify-center"}`}
					style={
						isFullscreen
							? {}
							: {
									height: `${displayHeight}px`,
									minHeight: "200px",
									maxHeight: "75vh",
								}
					}
				>
					{/* Loading state */}
					{isLoading && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 z-10 gap-4">
							<div className="relative">
								<div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
								<div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-neutral-900 dark:border-t-white animate-spin" />
							</div>
							<p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
								{displayMode === "iframe" ? "Loading preview..." : "Loading screenshot..."}
							</p>
						</div>
					)}

					{/* Screenshot mode */}
					{displayMode === "screenshot" && (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="block w-full h-full relative group cursor-pointer"
						>
							<Image
								src={screenshotUrl}
								alt={`Screenshot of ${title}`}
								fill
								className={`object-cover object-top transition-all duration-300 ${
									screenshotState === "loaded" ? "opacity-100" : "opacity-0"
								} group-hover:scale-[1.01]`}
								onLoad={handleScreenshotLoad}
								onError={handleScreenshotError}
								unoptimized
								priority
							/>

							{/* Hover overlay */}
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
								<div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
									<div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-medium shadow-xl">
										<ExternalLink className="w-4 h-4" />
										<span>Visit Website</span>
									</div>
								</div>
							</div>

							{/* Error state */}
							{screenshotState === "error" && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 gap-3">
									<ImageIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										Screenshot unavailable
									</p>
								</div>
							)}
						</a>
					)}

					{/* Iframe mode */}
					{displayMode === "iframe" && (
						<div
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
							<iframe
								key={`iframe-${retryCount}-${selectedPreset}-${iframeViewport.width}x${iframeViewport.height}`}
								ref={iframeRef}
								src={getIframeSrc()}
								className={isFullscreen ? "w-full h-full" : ""}
								style={
									isFullscreen
										? {
												border: "none",
												opacity: iframeState === "loaded" ? 1 : 0,
												transition: "opacity 0.3s ease-in-out",
												display: "block",
											}
										: {
												border: "none",
												opacity: iframeState === "loaded" ? 1 : 0,
												transition: "opacity 0.3s ease-in-out",
												width: `${iframeViewport.width}px`,
												height: `${iframeViewport.height}px`,
												transform: `scale(${scale})`,
												transformOrigin: "top left",
												display: "block",
												pointerEvents: isInteractive ? "auto" : "none",
											}
								}
								title={`Preview of ${title}`}
								loading="eager"
								sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
								onLoad={handleIframeLoad}
								onError={handleIframeError}
								referrerPolicy="no-referrer-when-downgrade"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							/>
						</div>
					)}

					{/* Click hint overlay - only in non-fullscreen mode */}
					{displayMode === "iframe" && iframeState === "loaded" && !isFullscreen && (
						<button
							type="button"
							className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-all duration-200 cursor-pointer group border-0 p-0"
							onClick={handleToggleFullscreen}
							aria-label="Click to interact with preview"
						>
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 rounded-lg bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 text-sm font-medium backdrop-blur-sm flex items-center gap-2">
								<Maximize2 className="w-4 h-4" />
								<span>Click to interact</span>
							</div>
						</button>
					)}
				</div>

				{/* Bottom bar */}
				<div className="flex items-center justify-between h-7 px-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
					<div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
						{displayMode === "iframe" ? (
							<>
								<span className={isResizing ? "text-blue-500" : ""}>
									{displayViewport.width}×{displayViewport.height}
								</span>
								<span className="text-neutral-300 dark:text-neutral-600">•</span>
								<span>{Math.round(scale * 100)}%</span>
								{isResizing && (
									<span className="text-blue-500 animate-pulse">Release to apply</span>
								)}
							</>
						) : (
							<span>Static screenshot</span>
						)}
					</div>

					{/* Keyboard hint */}
					{isFullscreen && (
						<div className="text-[10px] text-neutral-400 font-mono">
							Press{" "}
							<kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
								ESC
							</kbd>{" "}
							to exit
						</div>
					)}
				</div>
			</div>

			{/* Resize handles - both sides for symmetric resize */}
			{!isFullscreen && (
				<>
					{/* Right handle */}
					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						className={`absolute top-1/2 -right-4 -translate-y-1/2 z-40 cursor-ew-resize touch-none group ${
							isResizing ? "opacity-100" : "opacity-0 hover:opacity-100"
						} transition-opacity duration-200`}
					>
						<div
							className={`flex items-center justify-center w-6 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-md transition-all ${
								isResizing
									? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white"
									: "group-hover:border-neutral-300 dark:group-hover:border-neutral-600"
							}`}
						>
							<Grip
								className={`w-3 h-3 transition-colors ${
									isResizing
										? "text-white dark:text-neutral-900"
										: "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
								}`}
							/>
						</div>
					</div>

					{/* Left handle */}
					<div
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						className={`absolute top-1/2 -left-4 -translate-y-1/2 z-40 cursor-ew-resize touch-none group ${
							isResizing ? "opacity-100" : "opacity-0 hover:opacity-100"
						} transition-opacity duration-200`}
					>
						<div
							className={`flex items-center justify-center w-6 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-md transition-all ${
								isResizing
									? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white"
									: "group-hover:border-neutral-300 dark:group-hover:border-neutral-600"
							}`}
						>
							<Grip
								className={`w-3 h-3 transition-colors ${
									isResizing
										? "text-white dark:text-neutral-900"
										: "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
								}`}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);

	return (
		<div ref={wrapperRef} className="w-full mb-12">
			{/* Fullscreen overlay */}
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

			{/* Normal view - centered */}
			{!isFullscreen && <div className="w-full flex justify-center">{previewContent}</div>}
		</div>
	);
}
