import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for managing timeouts with automatic cleanup
 * @param callback - Function to execute when timeout completes
 * @param delay - Delay in milliseconds (null to disable timeout)
 * @returns Object with clear and reset functions
 */
export function useTimeout(
	callback: () => void,
	delay: number | null
): { clear: () => void; reset: () => void } {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const callbackRef = useRef(callback);

	// Keep callback ref up to date
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Clear function
	const clear = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	// Reset function
	const reset = useCallback(() => {
		clear();
		if (delay !== null) {
			timeoutRef.current = setTimeout(() => {
				callbackRef.current();
			}, delay);
		}
	}, [delay, clear]);

	// Set up timeout
	useEffect(() => {
		if (delay !== null) {
			timeoutRef.current = setTimeout(() => {
				callbackRef.current();
			}, delay);
		}

		return clear;
	}, [delay, clear]);

	return { clear, reset };
}
