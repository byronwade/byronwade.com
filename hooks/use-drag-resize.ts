"use client";

import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

const KEYBOARD_STEP = 24;
const KEYBOARD_STEP_LARGE = 80;

interface DragResizeOptions {
	/** Element the width is measured against; the handle resizes symmetrically about its centre. */
	containerRef: RefObject<HTMLElement | null>;
	/** Smallest width the handle may produce. */
	minWidth: number;
}

/**
 * Pointer- and keyboard-driven width control for the preview frame.
 *
 * A `null` width means "let layout decide" rather than a pinned pixel value, so
 * resetting is distinguishable from dragging back to the default. Pointer moves
 * are coalesced into one measurement per animation frame, since mousemove fires
 * far more often than the browser can paint.
 */
export function useDragResize({ containerRef, minWidth }: DragResizeOptions) {
	const [width, setWidth] = useState<number | null>(null);
	const [isResizing, setIsResizing] = useState(false);
	const frameRef = useRef<number | null>(null);

	const adjustFromPointer = useCallback(
		(clientX: number) => {
			const node = containerRef.current;
			if (!node || frameRef.current !== null) {
				return;
			}
			frameRef.current = window.requestAnimationFrame(() => {
				const rect = node.getBoundingClientRect();
				const centre = rect.left + rect.width / 2;
				const next = Math.abs(clientX - centre) * 2;
				setWidth(Math.max(minWidth, Math.min(rect.width, next)));
				frameRef.current = null;
			});
		},
		[containerRef, minWidth]
	);

	useEffect(() => {
		if (!isResizing) {
			return;
		}

		const onMouseMove = (event: MouseEvent) => adjustFromPointer(event.clientX);
		const onTouchMove = (event: TouchEvent) => {
			const touch = event.touches[0];
			if (touch) {
				adjustFromPointer(touch.clientX);
			}
		};
		const onEnd = () => setIsResizing(false);

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onEnd);
		document.addEventListener("touchmove", onTouchMove, { passive: false });
		document.addEventListener("touchend", onEnd);
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onEnd);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", onEnd);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [isResizing, adjustFromPointer]);

	/**
	 * Bounds are passed per event rather than captured: both are derived from
	 * this hook's own width, so holding them as options would make the two
	 * mutually dependent.
	 */
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent, currentWidth: number, maxWidth: number) => {
			const step = event.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				setWidth(Math.max(minWidth, currentWidth - step));
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				setWidth(Math.min(maxWidth, currentWidth + step));
			} else if (event.key === "Home") {
				event.preventDefault();
				setWidth(null);
			}
		},
		[minWidth]
	);

	const reset = useCallback(() => setWidth(null), []);

	return { width, setWidth, isResizing, startResize: () => setIsResizing(true), onKeyDown, reset };
}
