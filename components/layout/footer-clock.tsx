"use client";

import * as React from "react";

const FORMAT = new Intl.DateTimeFormat("en-US", {
	timeZone: "America/New_York",
	hour: "numeric",
	minute: "2-digit",
});

/**
 * Byron's local time. Rendered client-side only (a placeholder holds the space
 * on the server) so the static HTML never carries a stale clock.
 */
export function FooterClock() {
	const [time, setTime] = React.useState<string | null>(null);

	React.useEffect(() => {
		const tick = () => setTime(FORMAT.format(new Date()));
		tick();
		const id = window.setInterval(tick, 20_000);
		return () => window.clearInterval(id);
	}, []);

	return (
		<span className="tabular-nums" suppressHydrationWarning>
			{time ?? "––:––"} local
		</span>
	);
}
