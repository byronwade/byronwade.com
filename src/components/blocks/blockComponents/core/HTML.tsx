import React from "react";
import ReactHtmlParser from "react-html-parser"; //parse html

type HTMLComponentProps = {
	originalContent: string;
};

const HTMLComponent = ({ originalContent }: HTMLComponentProps) => {
	if (originalContent) {
		return ReactHtmlParser(originalContent);
	}
	return null;
};

export default HTMLComponent;
