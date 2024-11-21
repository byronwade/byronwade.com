
import { Page } from "@playwright/test";

export const checkLinks = async (
	page: Page
): Promise<{
	externalLinks: {
		count: number;
		details: { href: string; text: string }[];
	};
	internalLinks: {
		count: number;
		details: { href: string; text: string }[];
	};
}> => {
	await page.waitForTimeout(500);
	await page.waitForSelector("body");
	await page.waitForLoadState("load");

	const url = page.url();
	const domain = new URL(url).hostname;

	// Run the link gathering in a single execution context
	const { externalLinks, internalLinks } = await page.evaluate((domain) => {
		const externalLinks: { href: string; text: string }[] = [];
		const internalLinks: { href: string; text: string }[] = [];
		const links = Array.from(document.querySelectorAll("a")).map((a) => ({
			href: a.getAttribute("href") || "",
			text: a.textContent || "",
		}));

		for (const link of links) {
			if (!link.href.startsWith("/") && !link.href.startsWith(domain)) {
				externalLinks.push(link);
			} else {
				internalLinks.push(link);
			}
		}

		return { externalLinks, internalLinks };
	}, domain);

	return {
		externalLinks: {
			count: externalLinks.length,
			details: externalLinks,
		},
		internalLinks: {
			count: internalLinks.length,
			details: internalLinks,
		},
	};
};
