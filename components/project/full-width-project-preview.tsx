"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useDragResize } from "@/hooks/use-drag-resize";
import { useFrameSize } from "@/hooks/use-frame-size";
import { useScreenshot } from "@/hooks/use-screenshot";
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
} from "@/lib/icons";
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-viewports";
import { cn } from "@/lib/utils";

interface FullWidthProjectPreviewProps {
	href: string;
	title: string;
	url: string;
}

type ViewportPreset = keyof typeof VIEWPORT_PRESETS;

// Sizes come from the shared list because the screenshot routes accept only those.
const VIEWPORT_PRESETS = {
	desktop: { ...SCREENSHOT_VIEWPORTS.desktop, label: "Desktop", icon: Monitor },
	laptop: { ...SCREENSHOT_VIEWPORTS.laptop, label: "Laptop", icon: Laptop },
	tablet: { ...SCREENSHOT_VIEWPORTS.tablet, label: "Tablet", icon: Tablet },
	mobile: { ...SCREENSHOT_VIEWPORTS.mobile, label: "Mobile", icon: Smartphone },
} as const;

const MIN_WIDTH = 320;
const MAX_NORMAL_WIDTH = 1280;
const MAX_NORMAL_HEIGHT = 760;
const FULLSCREEN_PADDING_X = 48;
const FULLSCREEN_PADDING_Y = 132;

interface PreviewToolbarProps {
	href: string;
	interactive: boolean;
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
	interactive,
	isFullscreen,
	preset,
	setPreset,
	manualWidth,
	resetWidth,
	toggleFullscreen,
	triggerRef,
}: PreviewToolbarProps) {
	return (
		<div className="flex min-h-15 shrink-0 flex-wrap items-center justify-between gap-3 bg-secondary px-3 py-2">
			{/* Address */}
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				<div className="flex min-w-0 items-center gap-1.5 rounded-md bg-background/60 px-2 py-1">
					<Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
					<span className="min-w-0 break-all font-mono text-copy-12 text-foreground">{url}</span>
				</div>
			</div>

			{/* Device presets */}
			{interactive && !isFullscreen && (
				<div className="@xl/preview:order-none order-last hidden @xl/preview:w-auto w-full items-center justify-center gap-1 md:flex">
					<span className="sr-only">Preview viewport</span>
					{(Object.keys(VIEWPORT_PRESETS) as ViewportPreset[]).map((key) => {
						const { icon: Icon, label, width, height } = VIEWPORT_PRESETS[key];
						const isActive = preset === key;
						return (
							<Button
								size="lg"
								variant="ghost"
								key={key}
								type="button"
								onClick={() => setPreset(key)}
								aria-pressed={isActive}
								aria-label={`${label} (${width} by ${height})`}
								title={`${label} · ${width}×${height}`}
								className={cn(
									"size-11 rounded-full p-0",
									isActive
										? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
										: "text-muted-foreground"
								)}
							>
								<Icon className="size-3.5" aria-hidden="true" />
							</Button>
						);
					})}
				</div>
			)}

			{/* Actions */}
			<div className="flex shrink-0 items-center gap-3">
				{interactive && manualWidth !== null && !isFullscreen && (
					<Button
						size="lg"
						variant="ghost"
						type="button"
						onClick={resetWidth}
						aria-label="Reset preview width"
						title="Reset width"
						className="size-11 rounded-full p-0 text-muted-foreground"
					>
						<RotateCcw className="size-3.5" aria-hidden="true" />
					</Button>
				)}

				{interactive && (
					<Button
						size="lg"
						variant="ghost"
						ref={triggerRef}
						type="button"
						onClick={toggleFullscreen}
						aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
						title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
						className="size-11 rounded-full p-0 text-muted-foreground"
					>
						{isFullscreen ? (
							<Minimize2 className="size-3.5" aria-hidden="true" />
						) : (
							<Maximize2 className="size-3.5" aria-hidden="true" />
						)}
					</Button>
				)}

				<Button
					size="lg"
					className="size-11 rounded-full p-0"
					aria-label={`Visit ${url} (opens in a new tab)`}
					title="Open site"
					render={<a href={href} target="_blank" rel="noopener noreferrer" />}
				>
					<ExternalLink className="size-3" aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
}

interface PreviewFallbackProps {
	href: string;
	onRetry?: () => void;
	url: string;
}

// A retry is available only after hydration and a failed capture. Before hydration the
// scripts notice sits in <noscript>, so visitors with JavaScript never see it flash.
function PreviewFallback({ href, onRetry, url }: PreviewFallbackProps) {
	const icon = <ImageOff className="size-6 text-muted-foreground" aria-hidden="true" />;
	const noticeClass = "max-w-xs text-copy-13 text-muted-foreground";
	return (
		<div className="flex min-w-0 flex-col items-center justify-center gap-2 p-4 text-center">
			{onRetry ? icon : <noscript>{icon}</noscript>}
			<div className="flex flex-col gap-1">
				<p className="font-medium text-copy-14 text-foreground">
					{onRetry ? "Preview unavailable" : "Screenshot preview"}
				</p>
				{onRetry ? (
					<p className={noticeClass}>
						The capture service didn’t return this site just now. The site itself may be fine; open
						it directly or try the capture again.
					</p>
				) : (
					<noscript>
						<p className={noticeClass}>Enable JavaScript to load the screenshot preview.</p>
					</noscript>
				)}
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				{onRetry && (
					<Button onClick={onRetry} size="lg" variant="outline">
						<RefreshCw className="size-3" aria-hidden="true" />
						Retry
					</Button>
				)}
				{/* Base UI defaults to button semantics even when rendering an anchor. */}
				<Button
					role="link"
					size="lg"
					render={
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Open site: ${url} (opens in a new tab)`}
						/>
					}
				>
					Open site
					<ExternalLink className="size-3" aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
}

interface PreviewViewportProps extends FullWidthProjectPreviewProps {
	frameHeight: number;
	frameWidth: number;
	isFullscreen: boolean;
	mounted: boolean;
	screenshot: ReturnType<typeof useScreenshot>;
}

function PreviewViewport({
	href,
	title,
	url,
	frameHeight,
	frameWidth,
	isFullscreen,
	mounted,
	screenshot,
}: PreviewViewportProps) {
	const { src, status, onLoad: onImageLoad, onError: onImageError, retry } = screenshot;
	const showFallback = !mounted || status === "error";
	const retryCapture = mounted ? retry : undefined;
	// Preserve the capture area while allowing recovery controls and resized text to fit.
	const height = showFallback ? "auto" : `${Math.round(frameHeight)}px`;

	return (
		<div
			className={cn(
				"relative flex w-full justify-center overflow-hidden bg-muted/30",
				isFullscreen ? "flex-1 items-center" : "items-start"
			)}
			style={isFullscreen ? undefined : { height, minHeight: Math.round(frameHeight) }}
			aria-busy={mounted && status === "loading"}
		>
			{showFallback ? (
				<PreviewFallback href={href} onRetry={retryCapture} url={url} />
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
							<div className="absolute inset-0 bg-muted/40" />
							<div className="relative size-7">
								<div className="absolute inset-0 rounded-full border-2 border-border" />
								<div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-foreground" />
							</div>
							<p className="relative font-medium text-copy-13 text-muted-foreground" role="status">
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
	);
}

export function FullWidthProjectPreview({ href, title, url }: FullWidthProjectPreviewProps) {
	const [preset, setPreset] = useState<ViewportPreset>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const wrapperRef = useRef<HTMLElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	const capture = VIEWPORT_PRESETS[preset];

	const screenshot = useScreenshot(href, capture.width, capture.height);
	const { status, naturalSize } = screenshot;

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

	// Keep the server-rendered site link usable before screenshot effects can run.
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
			// Resizing tracks input directly; a size tween would lag the handle.
			className={cn("@container/preview relative flex flex-col", isFullscreen && "h-full w-full")}
			style={isFullscreen ? undefined : { width: `${Math.round(frameWidth)}px`, maxWidth: "100%" }}
		>
			<div
				className={cn(
					"relative flex flex-col overflow-hidden bg-background",
					isFullscreen
						? "h-full rounded-none border-0"
						: "rounded-lg border border-border shadow-card"
				)}
			>
				<PreviewToolbar
					href={href}
					interactive={mounted}
					isFullscreen={isFullscreen}
					manualWidth={manualWidth}
					preset={preset}
					resetWidth={resetWidth}
					setPreset={setPreset}
					toggleFullscreen={toggleFullscreen}
					triggerRef={triggerRef}
					url={url}
				/>

				<PreviewViewport
					href={href}
					title={title}
					url={url}
					frameHeight={frameHeight}
					frameWidth={frameWidth}
					isFullscreen={isFullscreen}
					mounted={mounted}
					screenshot={screenshot}
				/>

				{/* Bottom status bar */}
				<div
					className={cn("flex h-7 shrink-0 items-center justify-between bg-secondary px-3", {
						invisible: !mounted,
					})}
				>
					<div className="flex items-center gap-2 font-mono text-copy-12 text-muted-foreground">
						<span className="text-foreground">
							{capture.width}×{capture.height}
						</span>
						<span aria-hidden="true">•</span>
						<span>{Math.round(scale * 100)}%</span>
						{isResizing && <span className="animate-pulse text-brand">Release to apply</span>}
					</div>

					{isFullscreen ? (
						<div className="font-mono text-copy-12 text-muted-foreground">
							Press <kbd className="rounded bg-background px-1 py-0.5 text-foreground">ESC</kbd> to
							exit
						</div>
					) : (
						<span className="font-mono text-copy-12 text-muted-foreground capitalize">
							{capture.label}
						</span>
					)}
				</div>
			</div>

			{/* Resize handles (pointer + keyboard) */}
			{mounted &&
				!isFullscreen &&
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
							"group absolute top-1/2 z-40 flex size-11 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center focus-visible:outline-none",
							side === "right" ? "-right-2" : "-left-2"
						)}
					>
						<span
							className={cn(
								"flex h-11 w-6 items-center justify-center rounded-full border bg-background shadow-card transition-colors",
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
								aria-hidden="true"
							/>
						</span>
					</button>
				))}
		</div>
	);

	return (
		<section ref={wrapperRef} className="w-full" aria-label={`${title} site preview`}>
			{isFullscreen
				? createPortal(
						// biome-ignore lint/a11y/noNoninteractiveElementInteractions: this is a modal dialog, role, aria-modal, focus target, Escape, and backdrop dismissal are all present below.
						<div
							ref={dialogRef}
							className="fixed inset-0 z-(--z-dialog) flex flex-col bg-background/95 p-4 sm:p-6"
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
		</section>
	);
}
