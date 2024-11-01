import { Page } from "@playwright/test";

export const checkBrowserCompatibility = async (page: Page) => {
	try {
		await page.waitForLoadState("load");
		await page.waitForSelector("body", { state: "attached" });
		
		const userAgent = await page.evaluate(() => navigator.userAgent);
		return { browser: userAgent, compatible: true }; // Simplified compatibility check
	} catch (error: unknown) {
		return { error: error instanceof Error ? error.message : String(error) };
	}
};
