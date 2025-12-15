"use client";

import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";

interface MagneticButtonProps {
	children: React.ReactNode;
	className?: string;
	strength?: number;
	as?: ElementType;
	href?: string;
	onClick?: () => void;
	[key: string]: unknown;
}

/**
 * Magnetic Button Component
 * Button that slightly follows cursor on hover (subtle effect)
 * Respects prefers-reduced-motion
 */
export function MagneticButton({
	children,
	className = "",
	strength = 0.3,
	as: Component = "button",
	href,
	onClick,
	...props
}: MagneticButtonProps) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const ref = useRef<HTMLElement>(null);

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

			const deltaX = (e.clientX - centerX) * strength;
			const deltaY = (e.clientY - centerY) * strength;

			setPosition({ x: deltaX, y: deltaY });
		};

		const handleMouseLeave = () => {
			setIsHovering(false);
			setPosition({ x: 0, y: 0 });
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
	}, [isHovering, strength]);

	const ComponentElement = Component as React.ElementType;

	return (
		<ComponentElement
			ref={ref}
			href={href}
			onClick={onClick}
			className={className}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
				transition: isHovering ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
			}}
			{...props}
		>
			{children}
		</ComponentElement>
	);
}
