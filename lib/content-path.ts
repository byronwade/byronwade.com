import { join } from "node:path";

const PATH_SYNTAX = /[\\/:]/;

/** Slugs name one Markdown file, never a path or a Windows alternate data stream. */
export function contentFilePath(directory: string, slug: string): string | null {
	if (!slug || slug === "." || slug === ".." || PATH_SYNTAX.test(slug) || slug.includes("\0")) {
		return null;
	}
	return join(directory, `${slug}.md`);
}
