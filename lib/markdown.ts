import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { childrenToText, createSlugger } from "@/lib/markdown-utils";

/** One grammar policy for rendered Markdown and its table of contents. */
export const markdownOptions = { skipHtml: true, remarkPlugins: [remarkGfm] };

export interface TocItem {
	depth: 2 | 3;
	id: string;
	text: string;
}

const HEADING_ELEMENT = /^h[1-4]$/;

/**
 * Read the installed renderer's synchronous element tree, so containers, code
 * fences and inline syntax follow the same grammar as the article. Syntax
 * highlighting only changes code blocks and is unnecessary for this walk.
 */
export function extractToc(markdown: string): TocItem[] {
	const slugger = createSlugger();
	const items: TocItem[] = [];

	function visit(nodes: ReactNode) {
		Children.forEach(nodes, (node) => {
			if (!isValidElement<{ children?: ReactNode; id?: string }>(node)) {
				return;
			}
			if (typeof node.type === "string" && HEADING_ELEMENT.test(node.type)) {
				const text = childrenToText(node.props.children);
				// Empty and unlisted headings still consume the renderer's slug namespace.
				const generatedId = slugger(text);
				if ((node.type === "h2" || node.type === "h3") && text.trim()) {
					items.push({
						id: node.props.id ?? generatedId,
						text,
						depth: node.type === "h2" ? 2 : 3,
					});
				}
			}
			visit(node.props.children);
		});
	}

	visit(ReactMarkdown({ ...markdownOptions, children: markdown }));
	return items;
}
