
export const checkMobileFriendly = async (page: import('playwright').Page): Promise<Record<string, any>> => {
	await page.waitForTimeout(500);
	await page.waitForSelector("body");
	await page.waitForLoadState("load");

	try {
		const mobileFriendly = await isPageMobileFriendly(page);

		return {
			mobileFriendly,
			checks: {
				hasViewportMeta: mobileFriendly,
				fontSizeCheck: mobileFriendly,
				buttonSizeCheck: mobileFriendly,
				noHorizontalScroll: mobileFriendly,
			},
		};
	} catch (error) {
		console.error("Error in checkMobileFriendly:", error);

		// Return a result indicating an error occurred
		return {
			mobileFriendly: false,
			error: (error as Error).message,
			checks: {
				hasViewportMeta: false,
				fontSizeCheck: false,
				buttonSizeCheck: false,
				noHorizontalScroll: false,
			},
		};
	}
};

async function isPageMobileFriendly(page: import('playwright').Page): Promise<boolean> {
	try {
		// Check if the page is still open
		if (!page.isClosed()) {
			const hasViewportMeta = await page.$eval('meta[name="viewport"]', (viewportMeta: any) => {
				return viewportMeta?.getAttribute("content")?.includes("width=device-width") ?? false;
			});

			const fontSizeCheck = await page.$$eval("body *", (elements) => {
				return elements.every((el: any) => {
					const style = window.getComputedStyle(el);
					return parseInt(style.fontSize, 10) >= 16;
				});
			});

			const buttonSizeCheck = await page.$$eval("button", (buttons: any[]) => {
				return buttons.every((button: any) => {
					const style = window.getComputedStyle(button);
					return parseInt(style.width, 10) >= 48 && parseInt(style.height, 10) >= 48;
				});
			});

			const noHorizontalScroll = await page.evaluate(() => {
				return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
			});

			return hasViewportMeta && fontSizeCheck && buttonSizeCheck && noHorizontalScroll;
		} else {
			// The page is closed or destroyed, return false
			return false;
		}
	} catch (error) {
		// Handle other errors here or log them as needed
		console.error("Error in isPageMobileFriendly:", error);

		// Return false indicating an error occurred
		return false;
	}
}
