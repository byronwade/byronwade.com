"use client";

import Image from "next/image";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { failureCopyClass, failureTitleClass } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useDragResize } from "@/hooks/use-drag-resize";
import { useFrameSize } from "@/hooks/use-frame-size";
import { useScreenshot } from "@/hooks/use-screenshot";
import { SCREENSHOT_VIEWPORTS } from "@/lib/screenshot-viewports";
import { cn } from "@/lib/utils";

type ViewportPreset = keyof typeof SCREENSHOT_VIEWPORTS;

/** Glyphs rendered by the server wrapper, so their definitions stay out of this bundle. */
interface PreviewIcons {
	address: ReactNode;
	enterFullscreen: ReactNode;
	exitFullscreen: ReactNode;
	grip: ReactNode;
	open: ReactNode;
	presets: Record<ViewportPreset, ReactNode>;
	resetWidth: ReactNode;
	retry: ReactNode;
}

interface FullWidthProjectPreviewProps {
	/** The page's measure for the caption, which stays on the reading column. */
	captionClassName?: string;
	href: string;
	icons: PreviewIcons;
	title: string;
	url: string;
}

// Sizes come from the shared list because the screenshot routes accept only those.
const VIEWPORT_PRESETS = {
	desktop: { ...SCREENSHOT_VIEWPORTS.desktop, label: "Desktop" },
	laptop: { ...SCREENSHOT_VIEWPORTS.laptop, label: "Laptop" },
	tablet: { ...SCREENSHOT_VIEWPORTS.tablet, label: "Tablet" },
	mobile: { ...SCREENSHOT_VIEWPORTS.mobile, label: "Mobile" },
} as const;

const MIN_WIDTH = 320;
const MAX_NORMAL_WIDTH = 1280;
const MAX_NORMAL_HEIGHT = 760;
const FULLSCREEN_PADDING_X = 48;
const FULLSCREEN_PADDING_Y = 132;

/**
 * Inline sizes for the non-fullscreen frame. Until the container is measured
 * (including the prerendered HTML), CSS applies useFrameSize's fit rule, so the
 * measured pixel size replaces an equal layout instead of collapsing a
 * full-width frame and shifting the article below it. The fallback reserves the
 * same area but may grow, so recovery controls and enlarged text still fit.
 */
function normalFrameStyles({
	aspect,
	captureWidth,
	containerWidth,
	fitContent,
	frameHeight,
	frameWidth,
	manualWidth,
}: {
	aspect: number;
	captureWidth: number;
	containerWidth: number;
	fitContent: boolean;
	frameHeight: number;
	frameWidth: number;
	manualWidth: number | null;
}) {
	if (containerWidth === 0 && manualWidth === null) {
		return {
			frameStyle: {
				width: `min(100%, ${Math.min(MAX_NORMAL_WIDTH, captureWidth)}px, ${MAX_NORMAL_HEIGHT * aspect}px)`,
			},
			viewportStyle: { aspectRatio: `${aspect}` },
		};
	}
	return {
		frameStyle: { width: `${Math.round(frameWidth)}px`, maxWidth: "100%" },
		viewportStyle: fitContent
			? { minHeight: `${Math.round(frameHeight)}px` }
			: { height: `${Math.round(frameHeight)}px` },
	};
}

interface PreviewToolbarProps {
	href: string;
	icons: PreviewIcons;
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
	icons,
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
					{icons.address}
					<span className="min-w-0 break-all font-mono text-copy-12 text-foreground">{url}</span>
				</div>
			</div>

			{/* Device presets */}
			{interactive && !isFullscreen && (
				<div className="@xl/preview:order-none order-last hidden @xl/preview:w-auto w-full items-center justify-center gap-1 md:flex">
					<span className="sr-only">Preview viewport</span>
					{(Object.keys(VIEWPORT_PRESETS) as ViewportPreset[]).map((key) => {
						const { label, width, height } = VIEWPORT_PRESETS[key];
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
								{icons.presets[key]}
							</Button>
						);
					})}
				</div>
			)}

			{/* Actions */}
			<div className="flex max-w-full shrink-0 flex-wrap items-center gap-3">
				{interactive && manualWidth !== null && !isFullscreen && (
					<Button
						size="lg"
						variant="ghost"
						type="button"
						onClick={() => {
							resetWidth();
							// Reset removes this button; keep focus on the next toolbar control.
							triggerRef.current?.focus();
						}}
						aria-label="Reset preview width"
						title="Reset width"
						className="size-11 rounded-full p-0 text-muted-foreground"
					>
						{icons.resetWidth}
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
						{isFullscreen ? icons.exitFullscreen : icons.enterFullscreen}
					</Button>
				)}

				<Button
					size="lg"
					className="size-11 rounded-full p-0"
					aria-label={`Visit ${url} (opens in a new tab)`}
					title="Open site"
					render={<a href={href} target="_blank" rel="noopener noreferrer" />}
				>
					{icons.open}
				</Button>
			</div>
		</div>
	);
}

interface PreviewFallbackProps {
	href: string;
	icons: PreviewIcons;
	onRetry: () => void;
	/** `pending`: before hydration. `failed`: this capture failed. `off`: no captures on this deployment. */
	reason: "pending" | "failed" | "off";
	url: string;
}

const FALLBACK_TITLES = {
	pending: "Screenshot preview",
	failed: "Preview unavailable",
	off: "Live preview is off",
} as const;

// Before hydration the scripts notice sits in <noscript>, so visitors with JavaScript
// never see it flash. Only a failed capture offers Retry: when the deployment has no
// capture key a retry could never succeed, so the frame says so and links out instead.
export function PreviewFallback({ href, icons, onRetry, reason, url }: PreviewFallbackProps) {
	return (
		<div className="flex min-w-0 flex-col items-start gap-2 self-stretch p-4 text-left">
			<p className={failureTitleClass}>{FALLBACK_TITLES[reason]}</p>
			{reason === "pending" && (
				<noscript>
					<p className={failureCopyClass}>Enable JavaScript to load the screenshot preview.</p>
				</noscript>
			)}
			{reason === "failed" && (
				<p className={failureCopyClass}>
					The capture service didn’t return this site just now. The site itself may be fine; open it
					directly or try the capture again.
				</p>
			)}
			{reason === "off" && (
				<p className={failureCopyClass}>
					This site isn’t taking screenshots right now, so there’s nothing to load or retry. {url}{" "}
					itself is unaffected; open it directly.
				</p>
			)}
			<div className="flex flex-wrap items-center gap-3 pt-3">
				{reason === "failed" && (
					<Button onClick={onRetry} size="lg" variant="outline">
						{icons.retry}
						Retry
					</Button>
				)}
				<Button
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
					{icons.open}
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
	showFallback: boolean;
	style: CSSProperties;
}

function PreviewViewport({
	href,
	icons,
	title,
	url,
	frameHeight,
	frameWidth,
	isFullscreen,
	mounted,
	screenshot,
	showFallback,
	style,
}: PreviewViewportProps) {
	const { src, status, onLoad: onImageLoad, onError: onImageError, retry } = screenshot;
	let reason: PreviewFallbackProps["reason"] = "failed";
	if (!mounted) {
		reason = "pending";
	} else if (status === "off") {
		reason = "off";
	}

	return (
		<div
			// Clipping would make the fallback a scroll container, which caps an
			// aspect-ratio box at its ratio instead of letting the content grow it.
			className={cn(
				"relative flex w-full justify-center",
				showFallback ? "bg-muted" : "bg-muted/30",
				isFullscreen ? "flex-1 items-center" : "items-start",
				!showFallback && "overflow-hidden"
			)}
			style={isFullscreen ? undefined : style}
			aria-busy={mounted && status === "loading"}
		>
			{showFallback ? (
				<PreviewFallback href={href} icons={icons} onRetry={retry} reason={reason} url={url} />
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

export function FullWidthProjectPreviewClient({
	captionClassName,
	href,
	icons,
	title,
	url,
}: FullWidthProjectPreviewProps) {
	const [preset, setPreset] = useState<ViewportPreset>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const wrapperRef = useRef<HTMLElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	// Whether keyboard focus was last inside the preview, fullscreen dialog included.
	const focusInside = useRef(false);

	const capture = VIEWPORT_PRESETS[preset];

	const screenshot = useScreenshot(href, capture.width, capture.height);
	const { status, naturalSize } = screenshot;
	const off = status === "off";
	// Preview controls need a picture to act on; when captures are off there never is one.
	const interactive = mounted && !off;
	const showFallback = !mounted || off || status === "error";

	const {
		width: manualWidth,
		isResizing,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
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

	// The off answer can land after a visitor has already used the controls. Put the
	// frame back to its default, since Exit, Reset and the presets are gone with it.
	useEffect(() => {
		if (off) {
			setIsFullscreen(false);
			setPreset("desktop");
			resetWidth();
		}
	}, [off, resetWidth]);

	// Where focus last landed. A removed control fires no event, so this still says
	// "inside" after the off state takes its controls away.
	useEffect(() => {
		const track = (event: FocusEvent) => {
			const target = event.target as Node;
			focusInside.current = Boolean(
				wrapperRef.current?.contains(target) || dialogRef.current?.contains(target)
			);
		};
		document.addEventListener("focusin", track);
		return () => document.removeEventListener("focusin", track);
	}, []);

	// A control that held focus has gone, so focus would be left on the page body.
	// Hand it to the site link, the action that remains.
	useEffect(() => {
		if (!off || isFullscreen || !focusInside.current) {
			return;
		}
		const active = document.activeElement;
		if (active === null || active === document.body) {
			wrapperRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
		}
	}, [off, isFullscreen]);

	// The native modal owns focus containment, background inertness and Escape.
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!(isFullscreen && dialog)) {
			return;
		}
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialog.showModal();
		// A click can target the common ancestor of a press and release. Only
		// dismiss when both ends are on the padding; native cancel owns Escape.
		let paddingGesture = false;
		const recordPress = (event: PointerEvent) => {
			paddingGesture = event.isPrimary && event.button === 0 && event.target === dialog;
		};
		const recordRelease = (event: PointerEvent) => {
			// Touch captures its pointer, and a tap's click coordinates can still
			// be the press coordinates. Hit-test the actual release before click.
			paddingGesture =
				paddingGesture &&
				event.isPrimary &&
				event.button === 0 &&
				document.elementFromPoint(event.clientX, event.clientY) === dialog;
		};
		const cancelPress = () => {
			paddingGesture = false;
		};
		const dismissBackdrop = (event: MouseEvent) => {
			if (paddingGesture && event.target === dialog) {
				setIsFullscreen(false);
			}
			cancelPress();
		};
		dialog.addEventListener("pointerdown", recordPress);
		dialog.addEventListener("pointerup", recordRelease);
		dialog.addEventListener("pointercancel", cancelPress);
		dialog.addEventListener("click", dismissBackdrop);

		return () => {
			dialog.removeEventListener("pointerdown", recordPress);
			dialog.removeEventListener("pointerup", recordRelease);
			dialog.removeEventListener("pointercancel", cancelPress);
			dialog.removeEventListener("click", dismissBackdrop);
			dialog.close();
			document.body.style.overflow = previousOverflow;
			triggerRef.current?.focus();
		};
	}, [isFullscreen]);

	const { frameStyle, viewportStyle } = normalFrameStyles({
		aspect,
		captureWidth: capture.width,
		containerWidth,
		fitContent: showFallback,
		frameHeight,
		frameWidth,
		manualWidth,
	});

	const previewContent = (
		<div
			// Resizing tracks input directly; a size tween would lag the handle.
			className={cn("@container/preview relative flex flex-col", isFullscreen && "h-full w-full")}
			style={isFullscreen ? undefined : frameStyle}
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
					icons={icons}
					interactive={interactive}
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
					icons={icons}
					title={title}
					url={url}
					frameHeight={frameHeight}
					frameWidth={frameWidth}
					isFullscreen={isFullscreen}
					mounted={mounted}
					screenshot={screenshot}
					showFallback={showFallback}
					style={viewportStyle}
				/>

				{/* Bottom status bar */}
				<div
					className={cn(
						"flex min-h-7 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-secondary px-3 py-1",
						{ invisible: !interactive }
					)}
				>
					<div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-copy-12 text-muted-foreground">
						<span className="text-foreground">
							{capture.width}×{capture.height}
						</span>
						<span aria-hidden="true">•</span>
						<span>{Math.round(scale * 100)}%</span>
						{isResizing && <span className="text-brand">Resizing</span>}
					</div>

					{isFullscreen ? (
						<div className="font-mono text-copy-12 text-muted-foreground">
							Press <kbd className="rounded-sm bg-background px-1 py-0.5 text-foreground">ESC</kbd>{" "}
							to exit
						</div>
					) : (
						<span className="font-mono text-copy-12 text-muted-foreground capitalize">
							{capture.label}
						</span>
					)}
				</div>
			</div>

			{/* Resize handles (pointer + keyboard) */}
			{interactive &&
				!isFullscreen &&
				status !== "error" &&
				(["left", "right"] as const).map((side) => (
					<button
						key={side}
						type="button"
						aria-label="Resize preview width"
						onPointerDown={onPointerDown}
						onPointerMove={onPointerMove}
						onPointerUp={onPointerUp}
						onPointerCancel={onPointerCancel}
						onLostPointerCapture={onPointerCancel}
						onKeyDown={(event) =>
							handleResizeKey(event, frameWidth, containerWidth || MAX_NORMAL_WIDTH)
						}
						className={cn(
							"group absolute top-1/2 z-40 flex size-11 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center",
							side === "right" ? "-right-2" : "-left-2"
						)}
					>
						<span
							className={cn(
								"flex h-11 w-6 items-center justify-center rounded-full border bg-background shadow-card transition-colors",
								isResizing
									? "border-primary bg-primary text-primary-foreground"
									: "border-border text-foreground group-hover:border-brand/50 group-hover:text-brand group-focus-visible:border-brand"
							)}
						>
							{icons.grip}
						</span>
					</button>
				))}
		</div>
	);

	return (
		<figure className="flex w-full flex-col gap-4">
			<section ref={wrapperRef} className="w-full" aria-label={`${title} site preview`}>
				{isFullscreen
					? createPortal(
							<dialog
								ref={dialogRef}
								className="fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none flex-col border-0 bg-background p-4 text-foreground sm:p-6"
								onCancel={() => setIsFullscreen(false)}
								aria-label={`${title} fullscreen preview`}
							>
								<div className="flex h-full w-full items-center justify-center">
									{previewContent}
								</div>
							</dialog>,
							document.body
						)
					: null}

				{!isFullscreen && <div className="flex w-full justify-center">{previewContent}</div>}
			</section>
			<figcaption className={cn(captionClassName, "text-copy-12 text-muted-foreground")}>
				{off
					? `Live captures of ${url} are switched off on this site right now, so the frame above links to the site instead of showing it.`
					: `A capture of ${url}, refreshed from the live site. Switch the viewport, drag the side handles, or use the arrow keys on a handle to resize.`}
			</figcaption>
		</figure>
	);
}
