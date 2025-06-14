"use client";

import { motion, useInView, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
	value: number;
	prefix?: string;
	postfix?: string;
	className?: string;
}

export const AnimatedCounter = ({ value, prefix, postfix, className }: AnimatedCounterProps) => {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	// Use a motion value that springs from 0 to the target value
	const motionValue = useSpring(0, {
		damping: 60,
		stiffness: 200,
	});

	useEffect(() => {
		if (isInView) {
			motionValue.set(value);
		}
	}, [motionValue, isInView, value]);

	// Update the text content of the span element when the motion value changes
	useEffect(() => {
		motionValue.on("change", (latest) => {
			if (ref.current) {
				ref.current.textContent = `${prefix || ""}${Math.round(latest)}${postfix || ""}`;
			}
		});
	}, [motionValue, prefix, postfix]);

	return (
		<span className={className} ref={ref}>
			0
		</span>
	);
};
