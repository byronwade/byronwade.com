"use client";

import { type PointerEvent, type RefObject, useCallback, useEffect, useRef, useState } from "react";

const KEYBOARD_STEP = 24;
const KEYBOARD_STEP_LARGE = 80;

interface DragResizeOptions {
	/** Element the width is measured against; the handle resizes symmetrically about its centre. */
	containerRef: RefObject<HTMLElement | null>;
	/** Smallest width the handle may produce. */
	minWidth: number;
}

interface ResizeSession {
	clientX: number;
	cursor: string;
	handle: HTMLButtonElement;
	moved: boolean;
	pointerId: number;
	userSelect: string;
}

/**
 * Pointer- and keyboard-driven width control for the preview frame.
 *
 * A `null` width means "let layout decide" rather than a pinned pixel value, so
 * resetting is distinguishable from dragging back to the default. Pointer moves
 * are coalesced into one measurement per animation frame using the latest
 * position. One captured pointer owns the gesture until release or cancellation.
 */
export function useDragResize({ containerRef, minWidth }: DragResizeOptions) {
	const [width, setWidth] = useState<number | null>(null);
	const [isResizing, setIsResizing] = useState(false);
	const frameRef = useRef<number | null>(null);
	const sessionRef = useRef<ResizeSession | null>(null);

	const adjustFromPointer = useCallback(
		(clientX: number) => {
			const node = containerRef.current;
			if (!node) {
				return;
			}
			const rect = node.getBoundingClientRect();
			const centre = rect.left + rect.width / 2;
			const next = Math.abs(clientX - centre) * 2;
			setWidth(Math.min(rect.width, Math.max(minWidth, next)));
		},
		[containerRef, minWidth]
	);

	const endResize = useCallback(() => {
		if (frameRef.current !== null) {
			window.cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		const session = sessionRef.current;
		if (!session) {
			return;
		}
		// Clear ownership before releasing capture: lostpointercapture may fire next.
		sessionRef.current = null;
		if (session.handle.hasPointerCapture(session.pointerId)) {
			session.handle.releasePointerCapture(session.pointerId);
		}
		document.body.style.cursor = session.cursor;
		document.body.style.userSelect = session.userSelect;
		setIsResizing(false);
	}, []);

	const onPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
		if (!event.isPrimary || event.button !== 0 || sessionRef.current) {
			return;
		}
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		sessionRef.current = {
			clientX: event.clientX,
			cursor: document.body.style.cursor,
			handle: event.currentTarget,
			moved: false,
			pointerId: event.pointerId,
			userSelect: document.body.style.userSelect,
		};
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";
		setIsResizing(true);
	}, []);

	const onPointerMove = useCallback(
		(event: PointerEvent<HTMLButtonElement>) => {
			const session = sessionRef.current;
			if (!session || session.pointerId !== event.pointerId) {
				return;
			}
			session.clientX = event.clientX;
			session.moved = true;
			if (frameRef.current === null) {
				frameRef.current = window.requestAnimationFrame(() => {
					frameRef.current = null;
					if (sessionRef.current) {
						adjustFromPointer(sessionRef.current.clientX);
					}
				});
			}
		},
		[adjustFromPointer]
	);

	const onPointerUp = useCallback(
		(event: PointerEvent<HTMLButtonElement>) => {
			if (sessionRef.current?.pointerId !== event.pointerId) {
				return;
			}
			// Commit the release position even when its last move is still queued.
			if (sessionRef.current.moved) {
				adjustFromPointer(event.clientX);
			}
			endResize();
		},
		[adjustFromPointer, endResize]
	);

	const onPointerCancel = useCallback(
		(event: PointerEvent<HTMLButtonElement>) => {
			if (sessionRef.current?.pointerId === event.pointerId) {
				endResize();
			}
		},
		[endResize]
	);

	useEffect(() => {
		window.addEventListener("blur", endResize);
		return () => {
			window.removeEventListener("blur", endResize);
			endResize();
		};
	}, [endResize]);

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
				setWidth(Math.min(maxWidth, Math.max(minWidth, currentWidth - step)));
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				setWidth(Math.min(maxWidth, currentWidth + step));
			} else if (event.key === "Home") {
				event.preventDefault();
				endResize();
				setWidth(null);
			}
		},
		[endResize, minWidth]
	);

	const reset = useCallback(() => {
		endResize();
		setWidth(null);
	}, [endResize]);

	return {
		width,
		isResizing,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyDown,
		reset,
	};
}
