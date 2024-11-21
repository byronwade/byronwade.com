//@ts-nocheck
import { Page } from "@playwright/test";

// First, define an interface for the image data structure
interface ImageAnalysis {
	imageScore: number;
	src: string;
	size?: number;
	width?: number;
	height?: number;
	aspectRatio?: string;
	loadTime?: number;
	format?: string;
	alt?: string;
	lazyLoaded?: boolean;
	responsiveImage?: boolean;
	issues?: string[];
}

export const checkImageOptimization = async (page: Page) => {
	await page.waitForTimeout(500);
	await page.waitForSelector("body");
	await page.waitForLoadState("load");

	try {
		const runEvaluation = async () => {
			try {
				const images: ImageAnalysis[] = []; // Properly typed array
				const imageElements = document.querySelectorAll("img");

				Array.from(imageElements).forEach((img) => {
					let imageScore = 100;
					const aspectRatioDecimal = img.naturalWidth / img.naturalHeight;
					const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

					// Create image analysis object
					const imageAnalysis: ImageAnalysis = {
						imageScore: imageScore,
						src: img.src,
						width: img.naturalWidth,
						height: img.naturalHeight,
						aspectRatio: `${img.naturalWidth / gcd(img.naturalWidth, img.naturalHeight)}:${img.naturalHeight / gcd(img.naturalWidth, img.naturalHeight)}`,
						alt: img.alt,
						lazyLoaded: img.loading === "lazy",
						responsiveImage: img.srcset !== "",
						issues: [],
					};

					// ... rest of your image analysis logic ...

					images.push(imageAnalysis);
				});

				const totalImageScore = images.reduce((acc, img) => acc + img.imageScore, 0);
				const overallWebsiteScore = Math.round((totalImageScore / (images.length * 100)) * 100);

				return {
					images,
					totalImages: images.length,
					overallWebsiteScore,
				};
			} catch (error) {
				return {
					images: [],
					totalImages: 0,
					overallWebsiteScore: 0,
					error: error instanceof Error ? error.message : "Unknown error occurred",
				};
			}
		};

		const result = await runEvaluation();

		return result;
	} catch (error: unknown) {
		console.error("Error in checkImageOptimization:", error);
		return {
			images: [],
			totalImages: 0,
			overallWebsiteScore: 0,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
