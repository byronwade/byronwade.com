import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { markdownOptions } from "@/lib/markdown";

const BLOCK_ELEMENT = /^(?:h[1-6]|p|blockquote|ul|ol|li|table|thead|tbody|tr|th|td|hr|br|section)$/;
const WHITESPACE = /\s+/g;

function visibleText(nodes: ReactNode): string {
	let text = "";
	Children.forEach(nodes, (node) => {
		if (typeof node === "string" || typeof node === "number") {
			text += node;
		} else if (isValidElement<{ children?: ReactNode }>(node)) {
			if (node.type === "pre" || node.type === "img") {
				text += " ";
				return;
			}
			const children = visibleText(node.props.children);
			// Inline markup can split one word; only block boundaries separate words.
			text +=
				typeof node.type === "string" && BLOCK_ELEMENT.test(node.type) ? ` ${children} ` : children;
		}
	});
	return text;
}

/**
 * Read the same grammar as the article and TOC, including GFM and skipHtml.
 * Code blocks, images, comments and link destinations do not contribute text;
 * inline code and visible URLs do, because they are part of the prose.
 */
export function searchPlainText(markdown: string): string {
	return visibleText(ReactMarkdown({ ...markdownOptions, children: markdown }))
		.replace(WHITESPACE, " ")
		.trim();
}
