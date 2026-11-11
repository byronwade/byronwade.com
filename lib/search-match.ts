import type { SearchEntry, SearchKind } from "@/lib/search-types";

/** Header search and /search share this limit so a pasted paragraph cannot become the query. */
export const SEARCH_QUERY_MAX = 120;

const WHITESPACE = /\s+/g;

const SEARCH_KIND_ORDER: readonly SearchKind[] = ["Page", "Project", "Writing"];

const SEARCH_KIND_LABEL: Record<SearchKind, string> = {
	Page: "Pages",
	Project: "Projects",
	Writing: "Writing",
};

interface SearchGroup {
	items: SearchEntry[];
	kind: SearchKind;
	label: string;
}

/** Trim, collapse whitespace, and cap length. Empty means "no query". */
export function normalizeSearchQuery(value: string | undefined): string {
	if (!value) {
		return "";
	}
	return value.trim().replace(WHITESPACE, " ").slice(0, SEARCH_QUERY_MAX);
}

/**
 * Every word must appear in the label, meta, keywords, or text.
 * An empty query matches every entry, which is what the header palette shows before typing.
 */
export function entryMatchesQuery(entry: SearchEntry, query: string): boolean {
	const normalized = normalizeSearchQuery(query);
	if (!normalized) {
		return true;
	}
	const haystack =
		`${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""} ${entry.text ?? ""}`.toLowerCase();
	return normalized
		.toLowerCase()
		.split(WHITESPACE)
		.filter(Boolean)
		.every((token) => haystack.includes(token));
}

function queryTokens(query: string): string[] {
	return normalizeSearchQuery(query).toLowerCase().split(WHITESPACE).filter(Boolean);
}

/**
 * How directly an entry answers the query: 0 when every word is in its name,
 * 1 when every word is in its name, meta or keywords (summary, tags), 2 when
 * some word is only in the article text. A project named for the words then
 * leads one that merely mentions them.
 */
function matchRank(entry: SearchEntry, tokens: string[]): number {
	const label = entry.label.toLowerCase();
	if (tokens.every((token) => label.includes(token))) {
		return 0;
	}
	const described = `${label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return tokens.every((token) => described.includes(token)) ? 1 : 2;
}

/**
 * Matches, in the same group order the header palette uses, each group ranked
 * by `matchRank` and otherwise kept in corpus order (the sort is stable). An
 * empty query keeps corpus order. Empty groups are omitted.
 */
export function groupSearchResults(entries: SearchEntry[], query: string): SearchGroup[] {
	const tokens = queryTokens(query);
	return SEARCH_KIND_ORDER.map((kind) => {
		const items = entries.filter((entry) => entry.kind === kind && entryMatchesQuery(entry, query));
		if (tokens.length > 0) {
			const ranks = new Map(items.map((entry) => [entry, matchRank(entry, tokens)]));
			items.sort((a, b) => (ranks.get(a) ?? 2) - (ranks.get(b) ?? 2));
		}
		return { kind, label: SEARCH_KIND_LABEL[kind], items };
	}).filter((group) => group.items.length > 0);
}

/** Characters of context kept before the first hit, and the passage's whole length. */
const EXCERPT_LEAD = 60;
const EXCERPT_LENGTH = 180;

export interface SearchExcerptPart {
	hit: boolean;
	text: string;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The passage of an entry's text around the first query word, split so the
 * query words can be set apart. The search page shows it under the title so a
 * result says why it matched. Null when there is no text or no query word
 * occurs in it (the title alone matched).
 */
export function searchExcerpt(text: string | undefined, query: string): SearchExcerptPart[] | null {
	const tokens = normalizeSearchQuery(query).toLowerCase().split(WHITESPACE).filter(Boolean);
	if (!text || tokens.length === 0) {
		return null;
	}
	const lower = text.toLowerCase();
	// Prefer the whole phrase where the text has it; otherwise the earliest word.
	const phrase = lower.indexOf(tokens.join(" "));
	const first =
		phrase >= 0
			? phrase
			: Math.min(...tokens.map((token) => lower.indexOf(token)).filter((at) => at >= 0));
	if (!Number.isFinite(first)) {
		return null;
	}

	// Widen to whole words, so the passage never starts or ends mid-word.
	let start = Math.max(0, first - EXCERPT_LEAD);
	if (start > 0) {
		const space = text.indexOf(" ", start);
		start = space >= 0 && space < first ? space + 1 : start;
	}
	let end = Math.min(text.length, start + EXCERPT_LENGTH);
	if (end < text.length) {
		const space = text.lastIndexOf(" ", end);
		end = space > first ? space : end;
	}
	const passage = `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;

	const pattern = new RegExp(
		`(${[...tokens]
			.sort((a, b) => b.length - a.length)
			.map(escapeRegExp)
			.join("|")})`,
		"gi"
	);
	// Splitting on a capture group alternates text and hits: odd pieces are the query words.
	return passage
		.split(pattern)
		.map((segment, index) => ({ hit: index % 2 === 1, text: segment }))
		.filter((part) => part.text.length > 0);
}
