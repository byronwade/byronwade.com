const SEARCH_EVENT = "byronwade:open-search";

/** Open the site-wide search dialog (⌘K / header search button). */
export function openSiteSearch() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent(SEARCH_EVENT));
}

export function onOpenSiteSearch(handler: () => void) {
	if (typeof window === "undefined") return () => {};
	const listener = () => handler();
	window.addEventListener(SEARCH_EVENT, listener);
	return () => window.removeEventListener(SEARCH_EVENT, listener);
}
