import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { markdownOptions } from "@/lib/markdown";

const BLOCK_ELEMENT = /^(?:h[1-6]|p|blockquote|ul|ol|li|table|thead|tbody|tr|th|td|hr|br|section)$/;
const WHITESPACE = /\s+/g;
/** Ends like a sentence or clause, allowing a closing quote or bracket after the mark. */
const TERMINATED = /[.!?:;,…]["'”’)\]]*$/;

/**
 * A heading, cell or list item has no full stop of its own, so flattened it
 * would run into the next sentence ("Performance The repository…") in a
 * search excerpt. Close any block that doesn't end like a sentence.
 */
function closeBlock(text: string): string {
	const trimmed = text.trim();
	return trimmed && !TERMINATED.test(trimmed) ? `${trimmed}.` : trimmed;
}

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
			// Inline markup can split one word; only block boundaries separate words,
			// and each block ends like a sentence so an excerpt reads as prose.
			text +=
				typeof node.type === "string" && BLOCK_ELEMENT.test(node.type)
					? ` ${closeBlock(children)} `
					: children;
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
