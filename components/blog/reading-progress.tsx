"use client";

import { useEffect, useState } from "react";

/**
 * Reading Progress Bar Component
 * Shows reading progress at the top of the viewport for blog posts
 */
export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const scrollableHeight = documentHeight - windowHeight;
			// A short or still-hydrating document has no scroll range yet.
			const scrolled = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
			setProgress(Math.min(Math.max(scrolled * 100, 0), 100));
		};

		const observer = new ResizeObserver(updateProgress);
		observer.observe(document.body);
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress);
		updateProgress();

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", updateProgress);
			window.removeEventListener("resize", updateProgress);
		};
	}, []);

	return (
		<div
			className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-1 bg-muted"
			role="progressbar"
			aria-valuenow={Math.round(progress)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Reading progress"
		>
			<div
				className="h-full w-full origin-left bg-brand"
				style={{ transform: `scaleX(${progress / 100})` }}
			/>
		</div>
	);
}
