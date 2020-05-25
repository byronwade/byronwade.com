import React from "react";

type HeadingProps = {
	attributes?: {
		children?: string;
		align: string;
		anchor: string;
		className: string;
		content: string;
		level: string;
		placeholder: string;
	};
	children?: string;
	className?: string;
	content?: string;
	isValid?: boolean;
	level: number;
	originalContent?: string;
	style?: string;
};

const Heading = ({
	children,
	className,
	content,
	level,
	style,
}: HeadingProps) => {
	const HeadingComponent = `h${level}`;

	let headingClass = ``;
	headingClass = style && headingClass + ` ${style} h${level}`;
	headingClass = className && headingClass + ` ` + className;
	const innerContent = content ? content : children;

	return (
		<HeadingComponent className={headingClass}>{innerContent}</HeadingComponent>
	);
};

export default Heading;
