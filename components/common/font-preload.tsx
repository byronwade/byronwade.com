"use client";

import { preload } from "react-dom";

/**
 * Preloads the upright Inter Latin core before the stylesheet discovers it.
 *
 * It must render on the client side of the boundary. A `<link rel="preload">`
 * element in a server component renders twice, because React's server renderer
 * also emits it as a hint, and a server-side `preload()` hint is dropped on pages
 * rendered per request. During HTML rendering this call places one tag ahead of
 * the stylesheet; in the browser it finds that tag and adds nothing.
 */
export function FontPreload() {
	preload("/fonts/inter-latin-core.woff2", {
		as: "font",
		type: "font/woff2",
		crossOrigin: "anonymous",
		fetchPriority: "high",
	});
	return null;
}
