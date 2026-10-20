/** Hoisted so it compiles once, not per call. */
const HEADING_LINE = /^#\s+\S/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/;
const LINE_BREAK = /\r?\n/;

import { format, isValid, parseISO } from "date-fns";
import { isValidElement } from "react";

/**
 * Validate authored front-matter dates without inventing missing parts or using
 * the build machine's timezone. Calendar strings retain their authored day;
 * YAML Date objects retain the full instant, including any authored time.
 */
export function parseContentDate(value: unknown): string | undefined {
	if (value instanceof Date) {
		return isValid(value) ? value.toISOString() : undefined;
	}
	if (typeof value !== "string") {
		return;
	}

	const date = value.trim();
	if (!(DATE_ONLY.test(date) || ISO_TIMESTAMP.test(date))) {
		return;
	}
	// Metadata, sorting and RSS also consume these values with the native parser.
	return isValid(parseISO(date)) && Number.isFinite(Date.parse(date)) ? date : undefined;
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
 * Allocate unique heading ids, reserving generated suffixes as well as authored
 * names. Both the markdown renderer and the TOC extractor must use a fresh
 * slugger that walks headings in document order so the generated ids line up.
 */
export function createSlugger(): (text: string) => string {
	const seen = new Map<string, number>();
	return (text: string) => {
		const base = baseSlug(text) || "section";
		let slug = base;
		let count = seen.get(base) ?? 0;
		while (seen.has(slug)) {
			count++;
			slug = `${base}-${count}`;
		}
		seen.set(base, count);
		seen.set(slug, 0);
		return slug;
	};
}

/** Convert React children (string | number | array | element) into plain text. */
export function childrenToText(children: React.ReactNode): string {
	if (children === null || typeof children === "boolean") {
		return "";
	}
	if (typeof children === "string" || typeof children === "number") {
		return String(children);
	}
	if (Array.isArray(children)) {
		return children.map(childrenToText).join("");
	}
	if (isValidElement<{ children?: React.ReactNode }>(children)) {
		return childrenToText(children.props.children);
	}
	return "";
}

/**
 * Remove a leading top-level `# Heading` from markdown. Project/blog layouts
 * already render the title as the page `<h1>`, so a duplicate H1 in the body is
 * both visually redundant and an accessibility issue (multiple H1s per page).
 */
export function stripLeadingH1(markdown: string): string {
	if (!markdown) {
		return "";
	}
	const lines = markdown.split(LINE_BREAK);
	let i = 0;
	while (i < lines.length && lines[i]?.trim() === "") {
		i++;
	}
	if (i < lines.length && HEADING_LINE.test(lines[i] ?? "")) {
		lines.splice(0, i + 1);
		while (lines.length && lines[0]?.trim() === "") {
			lines.shift();
		}
		return lines.join("\n");
	}
	return markdown;
}

/**
 * YAML frontmatter date-only values (`2025-12-09`) become a `Date` at UTC
 * midnight, and the blog loader serializes them to ISO strings. Formatting that
 * instant behind UTC rolls back a day. Both representations must keep the same
 * calendar day when formatted locally.
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
	if (value instanceof Date) {
		return isValid(value) ? normalizeDateOnly(value) : null;
	}
	if (typeof value === "number") {
		const fromNumber = new Date(value);
		return isValid(fromNumber) ? fromNumber : null;
	}
	if (typeof value === "string" && value.trim()) {
		const parsed = value.includes("T") || DATE_ONLY.test(value) ? parseISO(value) : new Date(value);
		return isValid(parsed) ? normalizeDateOnly(parsed) : null;
	}
	return null;
}

/**
 * Format a date defensively. Accepts `Date`, ISO strings, timestamps, or
 * anything else and returns an empty string instead of throwing on bad input.
 */
export function safeFormatDate(value: unknown, pattern = "MMMM d, yyyy"): string {
	const parsed = toDate(value);
	if (!parsed) {
		return "";
	}
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
