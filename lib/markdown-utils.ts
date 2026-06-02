import { format, isValid, parseISO } from "date-fns";

export interface TocItem {
	id: string;
	text: string;
	depth: 2 | 3;
}

/**
 * GitHub-style slug for a single heading. Lowercases, strips punctuation,
 * and collapses whitespace into hyphens.
 */
function baseSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Returns a stateful slug function that deduplicates repeated headings by
 * appending `-1`, `-2`, … exactly like rehype-slug / github-slugger. Both the
 * markdown renderer and the TOC extractor must use a fresh slugger that walks
 * headings in document order so the generated ids line up.
 */
export function createSlugger(): (text: string) => string {
	const seen = new Map<string, number>();
	return (text: string) => {
		const base = baseSlug(text) || "section";
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		return count === 0 ? base : `${base}-${count}`;
	};
}

/** Convert React children (string | number | array | element) into plain text. */
export function childrenToText(children: React.ReactNode): string {
	if (children == null || typeof children === "boolean") return "";
	if (typeof children === "string" || typeof children === "number") {
		return String(children);
	}
	if (Array.isArray(children)) {
		return children.map(childrenToText).join("");
	}
	if (
		typeof children === "object" &&
		"props" in children &&
		(children as { props?: { children?: React.ReactNode } }).props
	) {
		return childrenToText((children as { props: { children?: React.ReactNode } }).props.children);
	}
	return "";
}

/** Strip the most common inline markdown tokens so TOC labels read cleanly. */
function stripInline(text: string): string {
	return text
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
		.replace(/`([^`]+)`/g, "$1") // inline code
		.replace(/[*_~]+/g, "") // emphasis markers
		.trim();
}

/**
 * Remove a leading top-level `# Heading` from markdown. Project/blog layouts
 * already render the title as the page `<h1>`, so a duplicate H1 in the body is
 * both visually redundant and an accessibility issue (multiple H1s per page).
 */
export function stripLeadingH1(markdown: string): string {
	if (!markdown) return "";
	const lines = markdown.split(/\r?\n/);
	let i = 0;
	while (i < lines.length && lines[i].trim() === "") i++;
	if (i < lines.length && /^#\s+\S/.test(lines[i])) {
		lines.splice(0, i + 1);
		while (lines.length && lines[0].trim() === "") lines.shift();
		return lines.join("\n");
	}
	return markdown;
}

/**
 * Extract level-2 and level-3 headings from markdown for a table of contents.
 * Skips fenced code blocks so `## ...` inside a code sample is ignored.
 */
export function extractToc(markdown: string): TocItem[] {
	if (!markdown) return [];
	const slugger = createSlugger();
	const items: TocItem[] = [];
	let inFence = false;

	for (const rawLine of markdown.split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(rawLine)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;

		const match = rawLine.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
		if (!match) continue;

		const depth = match[1].length as 2 | 3;
		const text = stripInline(match[2]);
		if (!text) continue;

		items.push({ id: slugger(text), text, depth });
	}

	return items;
}

/**
 * YAML frontmatter date-only values (`2025-12-09`) become a `Date` at UTC
 * midnight. Formatting that in a timezone behind UTC silently rolls back a day,
 * so reinterpret pure UTC-midnight dates as the same calendar day in local time.
 */
function normalizeDateOnly(d: Date): Date {
	if (
		d.getUTCHours() === 0 &&
		d.getUTCMinutes() === 0 &&
		d.getUTCSeconds() === 0 &&
		d.getUTCMilliseconds() === 0
	) {
		return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
	}
	return d;
}

/**
 * Coerce an unknown value into a valid `Date`, or `null`. YAML frontmatter
 * parsers often hand back a real `Date` (not an ISO string), so we accept
 * dates, numbers, and strings defensively.
 */
function toDate(value: unknown): Date | null {
	if (value instanceof Date) return isValid(value) ? normalizeDateOnly(value) : null;
	if (typeof value === "number") {
		const fromNumber = new Date(value);
		return isValid(fromNumber) ? fromNumber : null;
	}
	if (typeof value === "string" && value.trim()) {
		const parsed =
			value.includes("T") || /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseISO(value) : new Date(value);
		return isValid(parsed) ? parsed : null;
	}
	return null;
}

/**
 * Format a date defensively. Accepts `Date`, ISO strings, timestamps, or
 * anything else and returns an empty string instead of throwing on bad input.
 */
export function safeFormatDate(value: unknown, pattern = "MMMM d, yyyy"): string {
	const parsed = toDate(value);
	if (!parsed) return "";
	try {
		return format(parsed, pattern);
	} catch {
		return "";
	}
}

/** Return a machine-readable ISO date (yyyy-MM-dd) or `undefined` if invalid. */
export function safeISODate(value: unknown): string | undefined {
	return safeFormatDate(value, "yyyy-MM-dd") || undefined;
}
