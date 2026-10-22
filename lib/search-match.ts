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
 * Every word must appear in the label, meta, or keywords.
 * An empty query matches every entry, which is what the header palette shows before typing.
 */
export function entryMatchesQuery(entry: SearchEntry, query: string): boolean {
	const normalized = normalizeSearchQuery(query);
	if (!normalized) {
		return true;
	}
	const haystack = `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return normalized
		.toLowerCase()
		.split(WHITESPACE)
		.filter(Boolean)
		.every((token) => haystack.includes(token));
}

/** Matches, in the same group order the header palette uses. Empty groups are omitted. */
export function groupSearchResults(entries: SearchEntry[], query: string): SearchGroup[] {
	return SEARCH_KIND_ORDER.map((kind) => ({
		kind,
		label: SEARCH_KIND_LABEL[kind],
		items: entries.filter((entry) => entry.kind === kind && entryMatchesQuery(entry, query)),
	})).filter((group) => group.items.length > 0);
}
