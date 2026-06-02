"use client";

import { useEffect, useRef, useState } from "react";

interface Card3DTiltProps {
	children: React.ReactNode;
	className?: string;
	intensity?: number;
	perspective?: number;
}

/**
 * 3D Card Tilt Component
 * Adds subtle 3D tilt effect on hover
 * Respects prefers-reduced-motion
 */
export function Card3DTilt({
	children,
	className = "",
	intensity = 5,
	perspective = 1000,
}: Card3DTiltProps) {
	const [rotation, setRotation] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReducedMotion) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!isHovering) return;

			const rect = element.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const deltaX = (e.clientX - centerX) / (rect.width / 2);
			const deltaY = (e.clientY - centerY) / (rect.height / 2);

			setRotation({
				x: -deltaY * intensity,
				y: deltaX * intensity,
			});
		};

		const handleMouseLeave = () => {
			setIsHovering(false);
			setRotation({ x: 0, y: 0 });
		};

		const handleMouseEnter = () => {
			setIsHovering(true);
		};

		element.addEventListener("mousemove", handleMouseMove);
		element.addEventListener("mouseleave", handleMouseLeave);
		element.addEventListener("mouseenter", handleMouseEnter);

		return () => {
			element.removeEventListener("mousemove", handleMouseMove);
			element.removeEventListener("mouseleave", handleMouseLeave);
			element.removeEventListener("mouseenter", handleMouseEnter);
		};
	}, [isHovering, intensity]);

	return (
		<div
			ref={ref}
			className={className}
			style={{
				perspective: `${perspective}px`,
				transformStyle: "preserve-3d",
				transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
				transition: isHovering ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
			}}
		>
			{children}
		</div>
	);
}
