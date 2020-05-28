import React from "react";

type SpacerComponentProps = {
	attributes: {
		spacerHeight: string;
		className: string;
	};
	name: string;
	className: string;
	spacerHeight: string;
};

const SpacerComponent = ({
	name,
	className,
	spacerHeight,
}: SpacerComponentProps) => {
	if (name) {
		return (
			<div
				style={{ height: spacerHeight + `px` }}
				className={className + ` spacer`}>
				this is actually a spacer I just put text here so we can see it
			</div>
		);
	}
	return null;
};

export default SpacerComponent;
