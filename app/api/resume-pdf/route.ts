import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer-core";
import { RESUME_PDF_FILENAME } from "@/lib/resume-pdf";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Browsers keep a downloaded PDF for an hour. */
const BROWSER_CACHE_CONTROL = "public, max-age=3600";
/**
 * Vercel's CDN serves a PDF for a day, then refreshes it in the background and keeps
 * the last good copy if a print fails, so visitors rarely wait for the browser launch.
 * Each deployment starts with an empty cache, so a resume change is never hidden.
 */
const CDN_CACHE_CONTROL =
	"public, max-age=86400, stale-while-revalidate=31536000, stale-if-error=31536000";

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

		const response = await page.goto(`${origin}/resume`, {
			waitUntil: "networkidle0",
			timeout: 30_000,
		});
		// Navigation can resolve on HTTP errors. Never print and cache an error page.
		if (!response?.ok()) {
			throw new Error("Resume page failed to load");
		}

		// The record is server-rendered; the email line is decoded after hydration
		// (docs/SPAM_PROTECTION.md), so wait for it rather than for an arbitrary delay.
		// A page without it (hydration failure, or an older deployment) still prints.
		const hasEmail = await page.waitForSelector("[data-resume-email]", { timeout: 10_000 }).then(
			() => true,
			() => {
				console.warn("Resume PDF: email line did not appear; printing without it");
				return false;
			}
		);

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

		// A print without the email line still goes to this visitor, but is not stored.
		const cacheHeaders: Record<string, string> = hasEmail
			? { "Cache-Control": BROWSER_CACHE_CONTROL, "CDN-Cache-Control": CDN_CACHE_CONTROL }
			: { "Cache-Control": "no-store" };
		return new NextResponse(new Uint8Array(pdf).buffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${RESUME_PDF_FILENAME}"`,
				...cacheHeaders,
			},
		});
	} catch (error) {
		console.error("PDF generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate PDF" },
			{ status: 500, headers: { "Cache-Control": "no-store" } }
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
