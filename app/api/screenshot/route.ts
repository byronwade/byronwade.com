import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const url = searchParams.get("url");
		const width = Math.min(parseInt(searchParams.get("width") || "1920", 10), 1920);
		const height = Math.min(parseInt(searchParams.get("height") || "1080", 10), 1200);
		const mode = searchParams.get("mode") || "static";
		const format = searchParams.get("format") || (mode === "scroll" ? "webm" : "jpg");
		const imageQuality = parseInt(searchParams.get("quality") || (mode === "scroll" ? "85" : "90"), 10);
		const delay = parseInt(searchParams.get("delay") || "0", 10);
		const duration = parseInt(searchParams.get("duration") || "3", 10);
		const scrollDelay = parseInt(searchParams.get("scrollDelay") || "200", 10);
		const scrollDuration = parseInt(searchParams.get("scrollDuration") || "1000", 10);
		const scrollBy = parseInt(searchParams.get("scrollBy") || "800", 10);

		if (!url) {
			return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
		}

		// Validate URL
		try {
			new URL(url);
		} catch {
			return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
		}

		const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY || "PhW5mnvZ53L5nA";
		if (!accessKey) {
			return NextResponse.json({ error: "Missing SCREENSHOTONE_ACCESS_KEY" }, { status: 500 });
		}

		const buildUrl = (base: string, params: Record<string, string | number | boolean>) => {
			const usp = new URLSearchParams();
			usp.set("access_key", accessKey);
			Object.entries(params).forEach(([k, v]) => usp.set(k, String(v)));
			return `${base}?${usp.toString()}`;
		};

		if (mode === "scroll") {
			const animatedUrl = buildUrl("https://api.screenshotone.com/animate", {
				url,
				format,
				block_ads: true,
				block_cookie_banners: true,
				block_banners_by_heuristics: false,
				block_trackers: true,
				delay,
				timeout: 45,
				scenario: "scroll",
				duration,
				scroll_delay: scrollDelay,
				scroll_duration: scrollDuration,
				scroll_by: scrollBy,
				scroll_start_immediately: true,
				scroll_back: true,
				scroll_complete: true,
				scroll_easing: "ease_in_out_quint",
				viewport_width: width,
				viewport_height: height,
			});
			return NextResponse.json({ url: animatedUrl, mode: "scroll" });
		}

		// Static capture (fallback or explicit mode)
		const staticFormat = mode === "scroll" ? "jpg" : format;
		const screenshotUrl = buildUrl("https://api.screenshotone.com/take", {
			url,
			format: staticFormat,
			block_ads: true,
			block_cookie_banners: true,
			block_banners_by_heuristics: false,
			block_trackers: true,
			delay,
			timeout: 45,
			response_type: "by_format",
			image_quality: imageQuality,
			viewport_width: width,
			viewport_height: height,
		});
		return NextResponse.json({ url: screenshotUrl, mode: "static" });
	} catch (error) {
		console.error("ScreenshotOne API error:", error);
		return NextResponse.json(
			{ error: "Failed to generate screenshot URL" },
			{ status: 500 }
		);
	}
}
