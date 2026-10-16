import { NextResponse } from "next/server";
import {
	CAPTURE_CACHE_CONTROL,
	fetchCapture,
	getAccessKey,
	resolveCapture,
} from "@/lib/screenshot-capture";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function captureFailed() {
	return NextResponse.json(
		{ error: "Failed to capture screenshot" },
		{ status: 502, headers: NO_STORE }
	);
}

/**
 * Streams a project capture from the provider. Responses are cached by the
 * CDN and the provider rather than `unstable_cache`, which is meant for small
 * serializable data, not images; repeat views therefore spend no render quota.
 */
export async function GET(request: Request) {
	const resolution = await resolveCapture(new URL(request.url).searchParams);
	if (!resolution.ok) {
		return NextResponse.json(
			{ error: resolution.error },
			{ status: resolution.status, headers: NO_STORE }
		);
	}
	const accessKey = getAccessKey();
	if (!accessKey) {
		return NextResponse.json(
			{ error: "Screenshots are not configured" },
			{ status: 500, headers: NO_STORE }
		);
	}

	try {
		const upstream = await fetchCapture(resolution.capture, accessKey);
		const contentType = upstream.headers.get("content-type") ?? "";
		if (!(upstream.ok && contentType.startsWith("image/") && upstream.body)) {
			await upstream.body?.cancel();
			// Fixed message only: the provider's response is never echoed or logged.
			console.error(`Screenshot capture failed (provider status ${upstream.status})`);
			return captureFailed();
		}
		return new Response(upstream.body, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": CAPTURE_CACHE_CONTROL,
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch {
		console.error("Screenshot capture failed (request error)");
		return captureFailed();
	}
}
