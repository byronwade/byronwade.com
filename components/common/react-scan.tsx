"use client";

import { useEffect } from "react";

/**
 * Development-only React Scan overlay, which highlights components as they
 * re-render.
 *
 * `process.env.NODE_ENV` is inlined at build time, so the dynamic import below
 * is statically unreachable in production and never enters the client bundle.
 * Importing the installed package rather than the CDN build keeps the version
 * pinned by the lockfile and adds no runtime third-party origin.
 */
export function ReactScan() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") {
			return;
		}
		void import("react-scan").then(({ scan }) => scan({ enabled: true }));
	}, []);

	return null;
}
