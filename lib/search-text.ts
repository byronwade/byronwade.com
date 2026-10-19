/** Hoisted so each compiles once rather than per page. */
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const FENCE = /```[\s\S]*?```/g;
const IMAGE = /!\[[^\]]*]\([^)]*\)/g;
const LINK = /\[([^\]]*)]\([^)]*\)/g;
const URL = /https?:\/\/\S+/g;
const MARKDOWN = /[#>*~`|[\]()_]/g;
const WHITESPACE = /\s+/;

/**
 * Words a visitor can read. Markup, fenced samples, and comments are removed
 * so a code identifier or an author note is not treated as page text.
 */
export function searchPlainText(markdown: string): string {
	return markdown
		.replace(HTML_COMMENT, " ")
		.replace(FENCE, " ")
		.replace(IMAGE, " ")
		.replace(LINK, " $1 ")
		.replace(URL, " ")
		.replace(MARKDOWN, " ")
		.replace(WHITESPACE, " ")
		.trim();
}
