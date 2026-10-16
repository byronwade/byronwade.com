import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer-core";
import { siteUrl } from "@/lib/site";

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

		// The deployed origin in production; the local server otherwise. Never derived
		// from the request, so a caller cannot point the browser elsewhere.
		const origin =
			process.env.NODE_ENV === "production"
				? siteUrl
				: `http://localhost:${process.env.PORT ?? "3000"}`;

		await page.goto(`${origin}/resume`, {
			waitUntil: "networkidle0",
			timeout: 30_000,
		});

		// The record is server-rendered; the email line is decoded after hydration
		// (docs/SPAM_PROTECTION.md), so wait for it rather than for an arbitrary delay.
		// A page without it (hydration failure, or an older deployment) still prints.
		await page.waitForSelector("[data-resume-email]", { timeout: 10_000 }).catch(() => {
			console.warn("Resume PDF: email line did not appear; printing without it");
		});

		// page.pdf() renders print media, so the page's own print:* rules hide the
		// site chrome and controls. Browser printing gets the same document.
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
		return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
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
