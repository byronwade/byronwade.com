export const checkBrokenLinks = async (page: import('playwright').Page): Promise<Record<string, any>> => {
	await page.waitForSelector("body");
	await page.waitForLoadState("networkidle");
	
	const urls = await page.$$eval('a', (links: any[]) => 
		links
			.map(link => {
				try {
					return new URL(link.href).toString();
				} catch {
					return null;
				}
			})
			.filter(Boolean)
	);

	const brokenLinksDetails = {
		totalLinks: urls.length,
		brokenLinks: 0,
		brokenLinksList: [] as string[],
	};

	for (const url of urls) {
		try {
			if (url) {
				const response = await page.goto(url, { waitUntil: "domcontentloaded" });
				if (!response || !response.ok()) {
					brokenLinksDetails.brokenLinks++;
					brokenLinksDetails.brokenLinksList.push(url);
				}
			}
		} catch (err) {
			if (url) {
				brokenLinksDetails.brokenLinks++;
				brokenLinksDetails.brokenLinksList.push(url);
			}
		}
	}

	return brokenLinksDetails;
};