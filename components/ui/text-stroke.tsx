import type React from "react";

interface TextStrokeProps {
	strokeColor?: string;
	textColor?: string;
	strokeWidth?: number;
	className?: string;
	children: React.ReactNode;
}

export default function TextStroke({
	strokeColor = "white",
	textColor = "black",
	strokeWidth = 1,
	className = "",
	children,
}: TextStrokeProps) {
	const strokeStyle = {
		WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
		textStroke: `${strokeWidth}px ${strokeColor}`,
		color: textColor,
	};

	return (
		<h1 className={`text-4xl font-bold ${className}`} style={strokeStyle}>
			{children}
		</h1>
	);
}
