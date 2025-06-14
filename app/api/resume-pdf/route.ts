import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
	try {
		// Launch puppeteer browser
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		// Set viewport for consistent rendering
		await page.setViewport({ width: 1200, height: 1600 });

		// Navigate to the resume page
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
		await page.goto(`${baseUrl}/resume`, {
			waitUntil: "networkidle0",
			timeout: 30000,
		});

		// Hide the download button to prevent it showing in PDF
		await page.addStyleTag({
			content: `
				.download-buttons { display: none !important; }
				body { background: white !important; }
				.bg-gradient-to-br { background: white !important; }
			`,
		});

		// Generate PDF
		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "0.5in",
				right: "0.5in",
				bottom: "0.5in",
				left: "0.5in",
			},
		});

		await browser.close();

		// Return PDF as response
		return new NextResponse(pdf as BlobPart, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": 'attachment; filename="Byron_Wade_Resume.pdf"',
				"Cache-Control": "public, max-age=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("PDF generation error:", error);
		return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
	}
}
