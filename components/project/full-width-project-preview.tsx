"use client";

import {
	ExternalLink,
	Globe,
	Grip,
	ImageOff,
	Laptop,
	Maximize2,
	Minimize2,
	Monitor,
	RefreshCw,
	RotateCcw,
	Smartphone,
	Tablet,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDragResize } from "@/hooks/use-drag-resize";
import { useFrameSize } from "@/hooks/use-frame-size";
import { useScreenshot } from "@/hooks/use-screenshot";
import { cn } from "@/lib/utils";

interface FullWidthProjectPreviewProps {
	href: string;
	title: string;
	url: string;
}

type ViewportPreset = keyof typeof VIEWPORT_PRESETS;

const VIEWPORT_PRESETS = {
	desktop: { width: 1920, height: 1080, label: "Desktop", icon: Monitor },
	laptop: { width: 1440, height: 900, label: "Laptop", icon: Laptop },
	tablet: { width: 768, height: 1024, label: "Tablet", icon: Tablet },
	mobile: { width: 375, height: 667, label: "Mobile", icon: Smartphone },
} as const;

const MIN_WIDTH = 320;
const MAX_NORMAL_WIDTH = 1280;
const MAX_NORMAL_HEIGHT = 760;
const FULLSCREEN_PADDING_X = 48;
const FULLSCREEN_PADDING_Y = 132;

interface PreviewToolbarProps {
	href: string;
	isFullscreen: boolean;
	manualWidth: number | null;
	preset: ViewportPreset;
	resetWidth: () => void;
	setPreset: (preset: ViewportPreset) => void;
	toggleFullscreen: () => void;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
	url: string;
}

/** Browser-chrome header: address bar, viewport presets, and window actions. */
function PreviewToolbar({
	url,
	href,
	isFullscreen,
	preset,
	setPreset,
	manualWidth,
	resetWidth,
	toggleFullscreen,
	triggerRef,
}: PreviewToolbarProps) {
	return (
		<div className="flex h-10 shrink-0 items-center justify-between gap-2 border-border border-b bg-secondary px-3">
			{/* Window dots + address */}
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				<div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
					<span className="size-2.5 rounded-full bg-border" />
					<span className="size-2.5 rounded-full bg-border" />
					<span className="size-2.5 rounded-full bg-border" />
				</div>
				<div className="flex min-w-0 items-center gap-1.5 rounded-md bg-background/60 px-2 py-1">
					<Globe
						className="size-3.5 shrink-0 text-muted-foreground"
						strokeWidth={1.5}
						aria-hidden="true"
					/>
					<span className="truncate font-mono text-foreground text-xs">{url}</span>
				</div>
			</div>

			{/* Device presets */}
			{!isFullscreen && (
				<div className="mx-2 hidden items-center gap-0.5 rounded-lg bg-background/50 p-0.5 md:flex">
					<span className="sr-only">Preview viewport</span>
					{(Object.keys(VIEWPORT_PRESETS) as ViewportPreset[]).map((key) => {
						const { icon: Icon, label, width, height } = VIEWPORT_PRESETS[key];
						const isActive = preset === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => setPreset(key)}
								aria-pressed={isActive}
								aria-label={`${label} (${width} by ${height})`}
								title={`${label} · ${width}×${height}`}
								className={cn(
									"rounded-md p-1.5 transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-brand/5 hover:text-brand"
								)}
							>
								<Icon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
							</button>
						);
					})}
				</div>
			)}

			{/* Actions */}
			<div className="flex shrink-0 items-center gap-1">
				{manualWidth !== null && !isFullscreen && (
					<button
						type="button"
						onClick={resetWidth}
						aria-label="Reset preview width"
						title="Reset width"
						className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-brand/5 hover:text-brand"
					>
						<RotateCcw className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
					</button>
				)}

				<button
					ref={triggerRef}
					type="button"
					onClick={toggleFullscreen}
					aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
					className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-brand/5 hover:text-brand"
				>
					{isFullscreen ? (
						<Minimize2 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
					) : (
						<Maximize2 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
					)}
				</button>

				<div className="mx-1 h-4 w-px bg-border" />

				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Visit ${url} (opens in a new tab)`}
					className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground text-xs shadow-sm transition-colors hover:bg-primary/90"
				>
					<span className="hidden sm:inline">Visit</span>
					<ExternalLink className="size-3" strokeWidth={1.5} aria-hidden="true" />
				</a>
			</div>
		</div>
	);
}

export function FullWidthProjectPreview({ href, title, url }: FullWidthProjectPreviewProps) {
	const [preset, setPreset] = useState<ViewportPreset>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	const capture = VIEWPORT_PRESETS[preset];

	const {
		src,
		status,
		naturalSize,
		onLoad: onImageLoad,
		onError: onImageError,
		retry,
	} = useScreenshot(href, capture.width, capture.height);

	const {
		width: manualWidth,
		isResizing,
		startResize,
		onKeyDown: handleResizeKey,
		reset: resetWidth,
	} = useDragResize({ containerRef: wrapperRef, minWidth: MIN_WIDTH });

	const aspect =
		naturalSize && naturalSize.h > 0
			? naturalSize.w / naturalSize.h
			: capture.width / capture.height;

	const { frameWidth, frameHeight, scale, containerWidth } = useFrameSize({
		containerRef: wrapperRef,
		aspect,
		captureWidth: capture.width,
		isFullscreen,
		manualWidth,
		minWidth: MIN_WIDTH,
		maxWidth: MAX_NORMAL_WIDTH,
		maxHeight: MAX_NORMAL_HEIGHT,
		fullscreenPaddingX: FULLSCREEN_PADDING_X,
		fullscreenPaddingY: FULLSCREEN_PADDING_Y,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleFullscreen = useCallback(() => {
		// Entering fullscreen resets to the desktop preset. This runs outside the
		// state updater: React may invoke an updater more than once, which would
		// fire the nested setPreset repeatedly.
		if (!isFullscreen) {
			setPreset("desktop");
		}
		setIsFullscreen((prev) => !prev);
		resetWidth();
	}, [isFullscreen, resetWidth]);

	// A preset change replaces the frame size, so any manual width is stale.
	// biome-ignore lint/correctness/useExhaustiveDependencies: `preset` is the trigger; resetWidth is stable.
	useEffect(() => {
		resetWidth();
	}, [preset, resetWidth]);

	// Fullscreen: lock scroll, ESC to close, manage focus.
	useEffect(() => {
		if (!isFullscreen) {
			return;
		}
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsFullscreen(false);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
			window.clearTimeout(focusTimer);
			triggerRef.current?.focus();
		};
	}, [isFullscreen]);

	const previewContent = (
		<div
			// Animating width/height is normally avoided (DESIGN.md §6.1), but this
			// frame *is* the resizing object — a transform would misrepresent the
			// viewport being previewed. Occasional tier, 300ms = --motion-slow.
			className={cn(
				"relative flex flex-col transition-[width,height] duration-300 ease-out",
				isFullscreen && "h-full w-full"
			)}
			style={isFullscreen ? undefined : { width: `${Math.round(frameWidth)}px`, maxWidth: "100%" }}
		>
			<div
				className={cn(
					"relative flex flex-col overflow-hidden bg-background",
					isFullscreen
						? "h-full rounded-none border-0"
						: "rounded-2xl border border-border shadow-card"
				)}
			>
				<PreviewToolbar
					href={href}
					isFullscreen={isFullscreen}
					manualWidth={manualWidth}
					preset={preset}
					resetWidth={resetWidth}
					setPreset={setPreset}
					toggleFullscreen={toggleFullscreen}
					triggerRef={triggerRef}
					url={url}
				/>

				{/* Preview viewport */}
				<div
					className={cn(
						"relative flex w-full justify-center overflow-hidden bg-muted/30",
						isFullscreen ? "flex-1 items-center" : "items-start"
					)}
					style={isFullscreen ? undefined : { height: `${Math.round(frameHeight)}px` }}
					aria-busy={status === "loading"}
				>
					{status === "error" ? (
						<div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
							<ImageOff
								className="size-9 text-muted-foreground"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
							<div className="space-y-1">
								<p className="font-medium text-foreground text-sm">Preview unavailable</p>
								<p className="max-w-xs text-muted-foreground text-xs">
									We couldn’t capture this site right now.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={retry}
									className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 font-medium text-foreground text-xs transition-colors hover:bg-muted"
								>
									<RefreshCw className="size-3" strokeWidth={1.5} aria-hidden="true" />
									Retry
								</button>
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground text-xs transition-colors hover:bg-primary/90"
								>
									Open site
									<ExternalLink className="size-3" strokeWidth={1.5} aria-hidden="true" />
								</a>
							</div>
						</div>
					) : (
						<div
							className="relative"
							style={
								isFullscreen
									? { width: `${Math.round(frameWidth)}px`, height: `${Math.round(frameHeight)}px` }
									: { width: "100%", height: "100%" }
							}
						>
							{status === "loading" && (
								<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background">
									<div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-transparent" />
									<div className="relative size-7">
										<div className="absolute inset-0 rounded-full border-2 border-border" />
										<div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand" />
									</div>
									<p className="relative font-medium text-muted-foreground text-xs">
										Loading preview…
									</p>
								</div>
							)}
							{src && (
								<Image
									key={src}
									src={src}
									alt={`Screenshot of ${title}`}
									fill
									className="object-cover object-top"
									sizes="(max-width: 768px) 100vw, 1280px"
									onLoad={onImageLoad}
									onError={onImageError}
									priority
									unoptimized
								/>
							)}
						</div>
					)}
				</div>

				{/* Bottom status bar */}
				<div className="flex h-7 shrink-0 items-center justify-between border-border border-t bg-secondary px-3">
					<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
						<span className="text-foreground">
							{capture.width}×{capture.height}
						</span>
						<span aria-hidden="true">•</span>
						<span>{Math.round(scale * 100)}%</span>
						{isResizing && <span className="animate-pulse text-brand">Release to apply</span>}
					</div>

					{isFullscreen ? (
						<div className="font-mono text-[10px] text-muted-foreground">
							Press <kbd className="rounded bg-background px-1 py-0.5 text-foreground">ESC</kbd> to
							exit
						</div>
					) : (
						<span className="font-mono text-[10px] text-muted-foreground capitalize">
							{capture.label}
						</span>
					)}
				</div>
			</div>

			{/* Resize handles (pointer + keyboard) */}
			{!isFullscreen &&
				status !== "error" &&
				(["left", "right"] as const).map((side) => (
					<button
						key={side}
						type="button"
						aria-label="Resize preview width"
						onMouseDown={(e) => {
							e.preventDefault();
							startResize();
						}}
						onTouchStart={(e) => {
							e.preventDefault();
							startResize();
						}}
						onKeyDown={(event) =>
							handleResizeKey(event, frameWidth, containerWidth || MAX_NORMAL_WIDTH)
						}
						className={cn(
							"group absolute top-1/2 z-40 -translate-y-1/2 cursor-ew-resize touch-none transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none",
							side === "right" ? "-right-4" : "-left-4",
							isResizing ? "opacity-100" : "opacity-0 hover:opacity-100"
						)}
					>
						<span
							className={cn(
								"flex h-12 w-6 items-center justify-center rounded-full border bg-background shadow-md transition-colors",
								isResizing
									? "border-primary bg-primary"
									: "border-border group-hover:border-brand/50 group-focus-visible:border-brand"
							)}
						>
							<Grip
								className={cn(
									"size-3 transition-colors",
									isResizing ? "text-primary-foreground" : "text-foreground group-hover:text-brand"
								)}
								strokeWidth={1.5}
								aria-hidden="true"
							/>
						</span>
					</button>
				))}
		</div>
	);

	return (
		<div ref={wrapperRef} className="w-full">
			{isFullscreen && mounted && typeof document !== "undefined"
				? createPortal(
						// biome-ignore lint/a11y/noNoninteractiveElementInteractions: this is a modal dialog — role, aria-modal, focus target, Escape, and backdrop dismissal are all present below.
						<div
							ref={dialogRef}
							className="fixed inset-0 z-[9998] flex flex-col bg-black/95 p-6 backdrop-blur-sm"
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
							aria-label={`${title} fullscreen preview`}
							tabIndex={-1}
						>
							<div className="flex h-full w-full items-center justify-center">{previewContent}</div>
						</div>,
						document.body
					)
				: null}

			{!isFullscreen && <div className="flex w-full justify-center">{previewContent}</div>}
		</div>
	);
}
