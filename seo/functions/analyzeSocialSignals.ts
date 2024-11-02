import { type Page } from '@playwright/test';



// Function to fetch social media links from the page
async function getSocialLinks(page: Page) {
	return page.$$eval("a", (links) => {
		return links.map((link) => link.href).filter((href) => href.includes("facebook.com") || href.includes("twitter.com") || href.includes("linkedin.com"));
	});
}

// Function to fetch meta social links from the page
async function getMetaSocialLinks(page: Page) {
	return page.$$eval("meta", (tags) => {
		const metaLinks: { twitter?: string } = {};
		tags.forEach((tag) => {
			const property = tag.getAttribute("property");
			const content = tag.getAttribute("content");
			if (property && content) {
				if (property.includes("twitter:site")) {
					metaLinks.twitter = content.startsWith("@") ? `https://twitter.com/${content.substring(1)}` : content;
				}
			}
		});
		return metaLinks;
	});
}

export const analyzeSocialSignals = async (page: Page) => {
	const results = {
		facebook: { link: null, profileName: null, sharedCount: null },
		twitter: { link: null, profileName: null, sharedCount: null },
		linkedin: { link: null, profileName: null, sharedCount: null },
	};

	// Parallelizing the fetching of social links and meta social links
	const [socialLinks, metaSocialLinks] = await Promise.all([getSocialLinks(page), getMetaSocialLinks(page)]);

	const combinedLinks = { ...metaSocialLinks, ...Object.fromEntries(socialLinks.map((link) => [link.split(".com")[0].split("//").pop(), link])) };

	// Parallelizing the fetching of share counts and updating of results
	const fetchPromises = Object.entries(combinedLinks).map(async ([platform, link]) => {
		// ... rest of the code remains the same
	});

	await Promise.all(fetchPromises);

	return results;
};
