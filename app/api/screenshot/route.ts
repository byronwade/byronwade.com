import { NextResponse } from "next/server";
import {
	captureImagePath,
	resolveCapture,
	screenshotsConfigured,
	screenshotsUnconfigured,
} from "@/lib/screenshot-capture";

export const dynamic = "force-dynamic";

/**
 * Resolves a project preview to a same-origin image URL. The capture itself is
 * fetched by `/api/screenshot/image`, so the provider key never reaches the
 * browser.
 */
export async function GET(request: Request) {
	const resolution = await resolveCapture(new URL(request.url).searchParams);
	if (!resolution.ok) {
		return NextResponse.json({ error: resolution.error }, { status: resolution.status });
	}
	if (!screenshotsConfigured()) {
		return screenshotsUnconfigured();
	}
	return NextResponse.json({ url: captureImagePath(resolution.capture), mode: "static" });
}
