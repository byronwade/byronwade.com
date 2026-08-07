"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";

const MIN_FULLSCREEN_HEIGHT = 200;

interface FrameSizeOptions {
	/** Width-to-height ratio the frame must preserve. */
	aspect: number;
	/** Native width of the captured image, used to derive the render scale. */
	captureWidth: number;
	containerRef: RefObject<HTMLElement | null>;
	fullscreenPaddingX: number;
	fullscreenPaddingY: number;
	isFullscreen: boolean;
	/** Explicit width from the resize handle, or null to fit the container. */
	manualWidth: number | null;
	maxHeight: number;
	maxWidth: number;
	minWidth: number;
}

/**
 * Computes the frame's display size, tracking both the container (via
 * ResizeObserver) and the viewport (for fullscreen). The result is always
 * aspect-correct: the frame is letterboxed rather than cropped, so a tall
 * screenshot never overflows its box.
 */
export function useFrameSize({
	containerRef,
	aspect,
	captureWidth,
	isFullscreen,
	manualWidth,
	minWidth,
	maxWidth,
	maxHeight,
	fullscreenPaddingX,
	fullscreenPaddingY,
}: FrameSizeOptions) {
	const [containerWidth, setContainerWidth] = useState(0);
	const [viewport, setViewport] = useState({ w: 1920, h: 1080 });

	useEffect(() => {
		const node = containerRef.current;
		if (!node) {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect.width > 0) {
					setContainerWidth(entry.contentRect.width);
				}
			}
		});
		observer.observe(node);
		const initial = node.getBoundingClientRect().width;
		if (initial > 0) {
			setContainerWidth(initial);
		}
		return () => observer.disconnect();
	}, [containerRef]);

	useEffect(() => {
		const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	const frame = useMemo(() => {
		if (isFullscreen) {
			const availableWidth = Math.max(minWidth, viewport.w - fullscreenPaddingX);
			const availableHeight = Math.max(MIN_FULLSCREEN_HEIGHT, viewport.h - fullscreenPaddingY);
			let width = Math.min(availableWidth, availableHeight * aspect);
			let height = width / aspect;
			if (height > availableHeight) {
				height = availableHeight;
				width = height * aspect;
			}
			return { frameWidth: width, frameHeight: height, scale: width / captureWidth };
		}

		const available = containerWidth || maxWidth;
		const ceiling = Math.min(available, maxWidth, captureWidth);
		let width =
			manualWidth === null ? ceiling : Math.max(minWidth, Math.min(manualWidth, available));
		let height = width / aspect;
		if (height > maxHeight) {
			height = maxHeight;
			width = height * aspect;
		}
		return { frameWidth: width, frameHeight: height, scale: width / captureWidth };
	}, [
		isFullscreen,
		viewport,
		aspect,
		captureWidth,
		containerWidth,
		manualWidth,
		minWidth,
		maxWidth,
		maxHeight,
		fullscreenPaddingX,
		fullscreenPaddingY,
	]);

	return { ...frame, containerWidth };
}
