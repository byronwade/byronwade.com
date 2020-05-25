import React, { useEffect } from "react";
import Prism from "prismjs";

require("prismjs/plugins/autolinker/prism-autolinker");
//require('prismjs/plugins/autoloader/prism-autoloader');
require("prismjs/plugins/line-numbers/prism-line-numbers");

require("prismjs/components/prism-git");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-python");
require("prismjs/components/prism-docker");
require("prismjs/components/prism-nginx");
//require("prismjs/components/prism-php")
require("prismjs/components/prism-scss");
require("prismjs/components/prism-json");

type CodeComponentProps = {
	attributes: {
		className: string;
		codeContent: string;
	};
	originalContent: string;
	name: string;
	className: string;
	codeContent: string;
};

const CodeComponent = ({
	originalContent,
	name,
	className,
	codeContent,
}: CodeComponentProps) => {
	useEffect(() => {
		Prism.highlightAll();
	});

	if (codeContent) {
		return (
			<pre className={`line-numbers ` + className}>
				<code>{codeContent}</code>
			</pre>
		);
	}
	return null;
};

export default CodeComponent;
