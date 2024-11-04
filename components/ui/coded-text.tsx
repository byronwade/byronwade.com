"use client";

import { useEffect, useRef, memo } from "react";

const ANIMATION_DURATION = 500;
const EXTRA_WIDTH = 5;

const CodedText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const elementRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		const originalText = element.textContent ?? "";

		const handleMouseEnter = () => {
			const startTime = performance.now();

			const intervalId = element.getAttribute("data-interval");
			if (intervalId) clearInterval(Number(intervalId));

			const newInterval = setInterval(() => {
				const elapsedTime = performance.now() - startTime;
				const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

				element.innerText = originalText
					.split("")
					.map((char, index) => {
						if (index < originalText.length * progress) {
							return originalText[index];
						}
						return String.fromCharCode(Math.random() * 128);
					})
					.join("");

				if (progress === 1) {
					clearInterval(newInterval);
					element.removeAttribute("data-interval");
				}
			}, 20);

			element.setAttribute("data-interval", newInterval.toString());
		};

		const handleMouseLeave = () => {
			const intervalId = element.getAttribute("data-interval");
			if (intervalId) {
				clearInterval(Number(intervalId));
				element.removeAttribute("data-interval");
			}
			element.innerText = originalText;
		};

		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);

		const { width, height } = element.getBoundingClientRect();
		if (containerRef.current) {
			containerRef.current.style.width = `${width + EXTRA_WIDTH}px`;
			containerRef.current.style.height = `${height}px`;
		}

		return () => {
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<div ref={containerRef} className="inline-block overflow-hidden">
			<span ref={elementRef} className={`text-center block ${className} h-full`}>
				{children}
			</span>
		</div>
	);
};

export default memo(CodedText);
