export const checkForXMLSitemap = async (domain: string): Promise<Record<string, any>> => {
	const commonSitemapPaths = ["/sitemap.xml", "/sitemap_index.xml"];
	const result = {
		hasSitemap: false,
		sitemapUrl: "",
		sitemapLocationsChecked: commonSitemapPaths.slice(),
	};

	// Ensure the domain includes a protocol
	const baseDomain = domain.startsWith("http") ? domain : `https://${domain}`;

	// Fetch sitemaps in parallel
	const fetchPromises = commonSitemapPaths.map(async (path) => {
		const sitemapUrl = new URL(path, baseDomain).toString();
		try {
			const response = await fetch(sitemapUrl);

			if (response.ok) {
				const sitemapText = await response.text();
				const urls = parseSitemap(sitemapText);

				return {
					sitemapUrl,
					sitemapData: {
						urls: Array.isArray(urls) ? urls : [],
						totalUrls: Array.isArray(urls) ? urls.length : 0,
					},
				};
			}
		} catch (error) {
			// Handle error (e.g., network issue)
		}

		return null;
	});

	// Await all fetch results
	const fetchResults = await Promise.all(fetchPromises);

	// Find the first valid sitemap
	const validSitemap = fetchResults.find((result) => result !== null);

	if (validSitemap) {
		result.hasSitemap = true;
		result.sitemapUrl = validSitemap.sitemapUrl;
		// Remove sitemapData since it's not defined in the result type
	}

	return result;
};
function parseSitemap(sitemapText: string) {
	throw new Error("Function not implemented.");
}

