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
			const scrolled = scrollTop / scrollableHeight;
			setProgress(Math.min(Math.max(scrolled * 100, 0), 100));
		};

		// Update on scroll
		window.addEventListener("scroll", updateProgress, { passive: true });
		// Initial update
		updateProgress();

		return () => {
			window.removeEventListener("scroll", updateProgress);
		};
	}, []);

	return (
		<div
			className="fixed top-0 left-0 right-0 h-1 bg-[var(--muted)] z-50 pointer-events-none"
			role="progressbar"
			aria-valuenow={Math.round(progress)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Reading progress"
		>
			<div
				className="h-full bg-accent transition-all duration-150 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
