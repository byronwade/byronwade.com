import { useEffect, useCallback, KeyboardEvent as ReactKeyboardEvent, useState } from "react";

interface KeyboardNavigationOptions {
	onEnter?: () => void;
	onSpace?: () => void;
	onEscape?: () => void;
	onArrowUp?: () => void;
	onArrowDown?: () => void;
	onArrowLeft?: () => void;
	onArrowRight?: () => void;
	onTab?: (event: KeyboardEvent) => void;
	onShiftTab?: (event: KeyboardEvent) => void;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Handle Tab navigation
			if (event.key === "Tab") {
				if (event.shiftKey) {
					options.onShiftTab?.(event);
				} else {
					options.onTab?.(event);
				}
			}

			// Handle Enter and Space for buttons/links
			if (event.key === "Enter") {
				options.onEnter?.();
			}
			if (event.key === " ") {
				options.onSpace?.();
			}

			// Handle Escape for modals/dropdowns
			if (event.key === "Escape") {
				options.onEscape?.();
			}

			// Handle arrow keys for navigation
			if (event.key === "ArrowUp") {
				options.onArrowUp?.();
			}
			if (event.key === "ArrowDown") {
				options.onArrowDown?.();
			}
			if (event.key === "ArrowLeft") {
				options.onArrowLeft?.();
			}
			if (event.key === "ArrowRight") {
				options.onArrowRight?.();
			}
		},
		[options]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	// Helper function for handling keyboard events on interactive elements
	const handleElementKeyDown = (event: ReactKeyboardEvent<HTMLElement>, action: () => void) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			action();
		}
	};

	return {
		handleElementKeyDown,
	};
}

// Custom hook for managing focus trap
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const focusableElements = container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		const handleTabKey = (event: KeyboardEvent) => {
			if (event.key !== "Tab") return;

			if (event.shiftKey) {
				if (document.activeElement === firstFocusable) {
					event.preventDefault();
					lastFocusable?.focus();
				}
			} else {
				if (document.activeElement === lastFocusable) {
					event.preventDefault();

					firstFocusable?.focus();
				}
			}
		};

		container.addEventListener("keydown", handleTabKey);
		return () => {
			container.removeEventListener("keydown", handleTabKey);
		};
	}, [containerRef]);
}

// Custom hook for managing focus lists (e.g., menu items)
export function useFocusList(itemRefs: React.RefObject<HTMLElement>[]) {
	const [focusIndex, setFocusIndex] = useState<number>(0);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setFocusIndex((prev: number) => (prev + 1) % itemRefs.length);
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setFocusIndex((prev: number) => (prev - 1 + itemRefs.length) % itemRefs.length);
			}
		},
		[itemRefs.length]
	);

	useEffect(() => {
		const currentElement = itemRefs[focusIndex]?.current;
		if (currentElement) {
			currentElement.focus();
		}
	}, [focusIndex, itemRefs]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return focusIndex;
}
