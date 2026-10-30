"use client";

import { useEffect } from "react";
import { ErrorNotice } from "@/components/common/error-notice";

/**
 * Route-level failure. The header and footer still render around it, so the
 * visitor keeps every navigation route while this page recovers.
 */
export default function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
	const reference =
		error instanceof Error && "digest" in error && typeof error.digest === "string"
			? error.digest
			: undefined;
	useEffect(() => {
		console.error("Route render failed:", reference ?? error);
	}, [error, reference]);

	return (
		<ErrorNotice
			description="Something failed while this page was rendering. Try again, or start from the homepage. Any unsent text on this page may need to be entered again."
			onRetry={retry}
			reference={reference}
			retryLabel="Try again"
			title="This page didn’t load"
		/>
	);
}
