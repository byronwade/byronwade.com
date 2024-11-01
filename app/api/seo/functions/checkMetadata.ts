import { Page } from "@playwright/test";

export const checkMetadata = async (page: Page): Promise<Record<string, any>> => {
	await page.waitForTimeout(500);
	await page.waitForSelector("body");
	await page.waitForLoadState("load");

	// Initialize metadata with default values
	const metadata: Record<string, any> = {
		title: { value: null, exists: false, characterCount: 0 },
		description: { value: null, exists: false, characterCount: 0 },
		ogTitle: { value: null, exists: false, characterCount: 0 },
		ogDescription: { value: null, exists: false, characterCount: 0 },
		twitterTitle: { value: null, exists: false, characterCount: 0 },
		twitterDescription: { value: null, exists: false, characterCount: 0 },
		fbTitle: { value: null, exists: false, characterCount: 0 },
		fbDescription: { value: null, exists: false, characterCount: 0 },
		author: { value: null, exists: false, characterCount: 0 },
		keywords: { value: null, exists: false, characterCount: 0 },
		canonicalURL: { value: null, exists: false, characterCount: 0 },
		publishedDate: { value: null, exists: false, characterCount: 0 },
		language: { value: null, exists: false },
		viewport: { value: null },
		userAgent: { value: null },
		wordCount: 0,
		urlLength: 0,
		favicon: null,
		googleVerification: null,
		schemaData: {},
		ampLink: null,
	};

	try {
		// Extract metadata from the page
		const title = await page.title();
		if (title) {
			metadata.title.value = title;
			metadata.title.exists = true;
			metadata.title.characterCount = title.length;
		}

		try {
			const description = await page.$eval('meta[name="description"]', (meta) => meta?.getAttribute("content"));
			if (description) {
				metadata.description.value = description;
				metadata.description.exists = true;
				metadata.description.characterCount = description.length;
			}
		} catch (error) {
			// Handle the case where the description meta tag doesn't exist
		}

		// Continue adding checks for other metadata fields...

		// Get the page's language
		const language = await page.$eval("html", (html) => html?.getAttribute("lang"));
		if (language) {
			metadata.language.value = language;
			metadata.language.exists = true;
		}

		// Get viewport size
		metadata.viewport.value = await page.viewportSize();

		// Get user agent
		metadata.userAgent.value = await page.evaluate(() => window.navigator.userAgent);

		// Calculate word count
		const pageContent = await page.textContent("body");
		if (pageContent) {
			metadata.wordCount = pageContent.split(/\s+/).length;
		}

		// Calculate URL length
		metadata.urlLength = page.url().length;

		// Get favicon URL
		const faviconElement = await page.$('link[rel="icon"]');
		if (faviconElement) {
			metadata.favicon = await faviconElement.getAttribute("href");
		}

		// Add checks and data retrieval for "googleVerification," and "ampLink" here ...

		// Extract schema data using Playwright
		const schemaMarkup = await page.$$eval('script[type="application/ld+json"]', (scripts) => {
			return scripts
				.map((script) => {
					try {
						return JSON.parse(script.textContent || "");
					} catch (error) {
						return null;
					}
				})
				.filter((data) => data !== null);
		});

		schemaMarkup.forEach((data) => {
			if (data["@type"]) {
				const type = data["@type"];
				metadata.schemaData[type] = metadata.schemaData[type] || [];
				metadata.schemaData[type].push(data);
			}
		});

		return metadata; // Return the entire metadata object
	} catch (error) {
		throw error;
	}
};
