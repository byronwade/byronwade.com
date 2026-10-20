"use client";

import { useEffect } from "react";
import { ErrorNotice } from "@/components/common/error-notice";

/**
 * Route-level failure. The header and footer still render around it, so the
 * visitor keeps every navigation route while this page recovers.
 */
export default function RouteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Route render failed:", error.digest ?? error.message);
	}, [error]);

	return (
		<ErrorNotice
			description="Something failed while this page was rendering. Nothing you typed elsewhere on the site was sent or lost. Try again, or start from the homepage."
			onRetry={reset}
			reference={error.digest}
			title="This page didn’t load"
		/>
	);
}
