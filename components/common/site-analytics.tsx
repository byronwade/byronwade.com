"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { withoutSearchWords } from "@/lib/analytics-redact";

/** Vercel page views and speed samples, without the words typed into site search. */
export function SiteAnalytics() {
	return (
		<>
			<Analytics beforeSend={withoutSearchWords} />
			<SpeedInsights beforeSend={withoutSearchWords} />
		</>
	);
}
