"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchScreenshot } from "@/lib/screenshot";

type LoadingState = "loading" | "loaded" | "error";

/**
 * Resolves a screenshot for `href` at the given capture size, and tracks the
 * image's natural dimensions once it decodes so the frame can use the real
 * aspect ratio rather than the requested one.
 *
 * Retrying re-runs the fetch through an explicit key, because the inputs are
 * unchanged: the point of a retry is to repeat an identical request.
 */
export function useScreenshot(href: string, captureWidth: number, captureHeight: number) {
	const [status, setStatus] = useState<LoadingState>("loading");
	const [src, setSrc] = useState<string | null>(null);
	const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
	const [attempt, setAttempt] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` is the retry trigger; the other inputs are unchanged by design.
	useEffect(() => {
		let active = true;
		setStatus("loading");
		setSrc(null);
		setNaturalSize(null);

		fetchScreenshot(href, captureWidth, captureHeight)
			.then((resolved) => {
				if (active) {
					setSrc(resolved);
				}
			})
			.catch((error) => {
				console.error("Error fetching screenshot:", error);
				if (active) {
					setStatus("error");
				}
			});

		return () => {
			active = false;
		};
	}, [href, captureWidth, captureHeight, attempt]);

	const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
		const img = event.currentTarget;
		if (img.naturalWidth > 0 && img.naturalHeight > 0) {
			setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
		}
		setStatus("loaded");
	}, []);

	const onError = useCallback(() => setStatus("error"), []);

	const retry = useCallback(() => {
		setStatus("loading");
		setAttempt((n) => n + 1);
	}, []);

	return { src, status, naturalSize, onLoad, onError, retry };
}
