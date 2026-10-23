"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copying" | "copied" | "failed";

/** Own one clipboard attempt and its temporary confirmation; callers own recovery text. */
export function useCopyToClipboard() {
	const [status, setStatus] = useState<CopyStatus>("idle");
	const pending = useRef(false);

	useEffect(() => {
		if (status !== "copied") {
			return;
		}
		const timer = setTimeout(() => setStatus("idle"), 2000);
		return () => clearTimeout(timer);
	}, [status]);

	const copy = useCallback(async (text: string) => {
		// aria-disabled preserves keyboard focus; guard both pending and rapid activations here.
		if (pending.current) {
			return;
		}
		pending.current = true;
		setStatus("copying");
		try {
			await navigator.clipboard.writeText(text);
			setStatus("copied");
		} catch {
			// A missing API and a denied write both need the caller's manual-copy path.
			setStatus("failed");
		} finally {
			pending.current = false;
		}
	}, []);

	return { status, copy };
}
