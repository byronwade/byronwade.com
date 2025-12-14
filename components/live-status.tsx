"use client";

import { useEffect, useState } from "react";

interface LiveStatusProps {
	status?: string;
	showDot?: boolean;
	className?: string;
}

/**
 * Live Status Indicator Component
 * Shows current status or availability
 */
export function LiveStatus({
	status = "Available for conversations",
	showDot = true,
	className = "",
}: LiveStatusProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className={`inline-flex items-center gap-2 ${className}`}>
			{showDot && (
				<span
					className="relative flex size-2"
					aria-hidden="true"
				>
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
					<span className="relative inline-flex size-2 rounded-full bg-green-500" />
				</span>
			)}
			<span className="text-sm text-[var(--muted-foreground)]">
				{status}
			</span>
		</div>
	);
}
