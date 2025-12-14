"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	direction?: "up" | "down" | "left" | "right" | "fade";
	threshold?: number;
}

/**
 * Scroll Reveal Component
 * Animates elements as they enter the viewport
 * Respects prefers-reduced-motion
 */
export function ScrollReveal({
	children,
	className = "",
	delay = 0,
	direction = "up",
	threshold = 0.1,
}: ScrollRevealProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [hasAnimated, setHasAnimated] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) {
			setIsVisible(true);
			setHasAnimated(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						setIsVisible(true);
						setHasAnimated(true);
					}
				});
			},
			{
				threshold,
				rootMargin: "0px 0px -50px 0px",
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, hasAnimated]);

	const getTransform = () => {
		if (!isVisible || hasAnimated) return "translate(0, 0)";
		switch (direction) {
			case "up":
				return "translateY(20px)";
			case "down":
				return "translateY(-20px)";
			case "left":
				return "translateX(20px)";
			case "right":
				return "translateX(-20px)";
			case "fade":
				return "translate(0, 0)";
			default:
				return "translateY(20px)";
		}
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: getTransform(),
				transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
			}}
		>
			{children}
		</div>
	);
}
