import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
	let browser: Browser | undefined;
	try {
		// Launch chromium that works in serverless environments (Vercel)
		const executablePath = await chromium.executablePath();
		browser = await puppeteer.launch({
			args: chromium.args,
			headless: true,
			executablePath,
			defaultViewport: { width: 1200, height: 1600 },
		});

		const page = await browser.newPage();

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
		return NextResponse.json(
			{
				error: "Failed to generate PDF",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	} finally {
		// Ensure browser is always closed to avoid leaks
		if (browser) {
			try {
				await browser.close();
			} catch (closeError) {
				console.error("Error closing browser:", closeError);
			}
		}
	}
}
