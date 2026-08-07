// Client-safe search types, kept separate from search-index.ts (which imports
// node:fs via the content loaders) so the client nav dock can import the types
// without pulling server-only modules into the browser bundle.

export type SearchKind = "Page" | "Project" | "Writing";

export interface SearchEntry {
	href: string;
	/** Extra terms folded into matching but not displayed. */
	keywords?: string;
	kind: SearchKind;
	label: string;
	/** Small trailing hint, e.g. a status or reading time. */
	meta?: string;
}
