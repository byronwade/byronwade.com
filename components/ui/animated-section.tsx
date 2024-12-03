"use client";

import { useEffect, useRef } from "react";

interface AnimatedSectionProps {
	children: React.ReactNode;
	className?: string;
}

export default function AnimatedSection({ children, className }: AnimatedSectionProps) {
	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-fade-in-up");
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={sectionRef} className={className}>
			{children}
		</div>
	);
}
