import { NextResponse } from "next/server";
import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";

export async function GET() {
	let browser: Browser | undefined;
	try {
		// Launch puppeteer browser with optimized settings
		browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu",
			],
		});

		const page = await browser.newPage();

		// Set viewport for consistent rendering
		await page.setViewport({ width: 1200, height: 1600 });

		// Determine the base URL - use production URL or localhost with correct port
		const baseUrl =
			process.env.NEXT_PUBLIC_BASE_URL ||
			(process.env.NODE_ENV === "production" ? "https://byronwade.com" : "http://localhost:3000");

		// Navigate to the resume page and wait for content to load
		await page.goto(`${baseUrl}/resume`, {
			waitUntil: "networkidle0",
			timeout: 30000,
		});

		// Wait for the main content to be rendered (wait for h1 with name)
		await page.waitForSelector("h1", { timeout: 10000 });

		// Add a small delay to ensure all client-side rendering is complete
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Hide navigation elements and style for PDF
		await page.addStyleTag({
			content: `
				/* Hide navigation and interactive elements */
				.resume-navigation,
				.resume-actions,
				.resume-action-button,
				a[href="/api/resume-pdf"],
				button[aria-label="Copy email to clipboard"],
				/* Ensure white background */
				body { 
					background: white !important; 
				}
				.bg-gradient-to-br { 
					background: white !important; 
				}
				/* Ensure proper text contrast for PDF */
				.text-\\[var\\(--muted-foreground\\)\\] {
					color: #666 !important;
				}
				.text-\\[var\\(--foreground\\)\\] {
					color: #000 !important;
				}
			`,
		});

		// Generate PDF with optimized settings
		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "0.5in",
				right: "0.5in",
				bottom: "0.5in",
				left: "0.5in",
			},
			preferCSSPageSize: false,
		});

		// Return PDF as response
		return new NextResponse(pdf as BlobPart, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": 'attachment; filename="Byron_Wade_Resume.pdf"',
				"Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("PDF generation error:", error);

		// Ensure browser is closed even on error
		if (browser) {
			try {
				await browser.close();
			} catch (closeError) {
				console.error("Error closing browser:", closeError);
			}
		}

		return NextResponse.json(
			{
				error: "Failed to generate PDF",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
