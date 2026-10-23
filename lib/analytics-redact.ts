const SEARCH_PATH = "/search";
const SEARCH_PARAM = "q";

/**
 * Vercel Web Analytics and Speed Insights send the page address with every page
 * view, event and speed sample. This removes the words typed into site search
 * from `/search` addresses and passes every other address through unchanged.
 */
export function withoutSearchWords<Event extends { url: string }>(event: Event): Event {
	const url = new URL(event.url);
	if (url.pathname !== SEARCH_PATH || !url.searchParams.has(SEARCH_PARAM)) {
		return event;
	}
	url.searchParams.delete(SEARCH_PARAM);
	return { ...event, url: url.href };
}
