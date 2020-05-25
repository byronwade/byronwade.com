import React from "react";
import ReactHtmlParser from "react-html-parser";

type ListProps = {
	attributes?: {
		className: string;
		ordered: boolean;
		values: string;
	};
	name: string;
	originalContent?: string;
	className?: string;
	values: string;
};

const List = ({
	attributes,
	originalContent,
	className,
	values,
}: ListProps) => {
	if (!attributes.values) return null;

	if (attributes.ordered) {
		return <ol className={className}>{ReactHtmlParser(values)}</ol>;
	} else {
		return <ul className={className}>{ReactHtmlParser(values)}</ul>;
	}
};

export default List;
