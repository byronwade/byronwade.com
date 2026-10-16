import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache";
import { siteUrl } from "@/lib/site";

export async function POST(request: NextRequest) {
	const expectedSecret = process.env.REVALIDATION_SECRET;
	// Missing configuration must never match a missing or blank request secret.
	if (!expectedSecret?.trim()) {
		return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}
	const secret = "secret" in body ? body.secret : undefined;
	if (typeof secret !== "string" || secret !== expectedSecret) {
		return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
	}

	const tag = "tag" in body ? body.tag : undefined;
	const validTags: readonly CacheTag[] = Object.values(CACHE_TAGS);
	const validTag = validTags.find((candidate) => candidate === tag);
	if (!validTag) {
		return NextResponse.json({ error: "Invalid tag", validTags }, { status: 400 });
	}

	try {
		// Manual refresh expires immediately instead of serving stale data once more.
		revalidateTag(validTag, { expire: 0 });

		return NextResponse.json({
			success: true,
			message: `Cache revalidated for tag: ${validTag}`,
			timestamp: new Date().toISOString(),
		});
	} catch {
		// Error details can contain submitted credentials; keep logs generic too.
		console.error("Cache revalidation failed");
		return NextResponse.json({ error: "Failed to revalidate cache" }, { status: 500 });
	}
}

// GET endpoint to show cache status
export function GET() {
	return NextResponse.json({
		availableTags: Object.values(CACHE_TAGS),
		usage: {
			endpoint: "/api/cache/revalidate",
			method: "POST",
			body: {
				tag: "One of the available tags",
				secret: "Your revalidation secret",
			},
		},
		example: {
			curl: `curl -X POST ${siteUrl}/api/cache/revalidate -H "Content-Type: application/json" -d '{"tag":"portfolio","secret":"your-secret"}'`,
		},
	});
}
