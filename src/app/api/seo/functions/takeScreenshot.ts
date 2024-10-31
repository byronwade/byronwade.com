import sharp from "sharp"; // Import the sharp library for image processing
import puppeteer from "puppeteer"; // Import the puppeteer library for browser automation

export const takeScreenshot = async (domain: string, existingBrowser: import('playwright').Browser, chromium: import('playwright').ChromiumBrowser) => {
	let browser, page;

	try {
		if (typeof domain === "string") {
			const url = domain.startsWith("http") ? domain : "https://" + domain;
			browser = await puppeteer.launch({ headless: true }); // Use `puppeteer.launch()` instead of `chromium.launch()`
			page = await browser.newPage();
			await page.goto(url);
		} else {
			page = domain;
		}
		await page.waitForSelector("body");
		await page.waitForNetworkIdle();

		// Set the viewport size to 8K resolution
		await page.setViewport({ width: 3456, height: 2234 });

		// Take a screenshot and get it as a buffer
		const buffer = await page.screenshot({ type: "png" }); // Use PNG for lossless compression

		// Downscale the image to 4K resolution with high-quality downscaling
		const downscaledBuffer = await sharp(buffer)
			.resize({
				width: 3840,
				height: 2160,
				fit: "inside", // This will maintain the aspect ratio
				kernel: sharp.kernel.lanczos3, // Lanczos3 kernel for high-quality downscaling
			})
			.toBuffer();

		if (browser) await browser.close();

		// Return the downscaled buffer
		return { screenshotBuffer: downscaledBuffer };
	} catch (error) {
		console.error("Error taking screenshot:", error);

		if (browser) await browser.close();

		return { error: error instanceof Error ? error.message : String(error) };
	}
};
