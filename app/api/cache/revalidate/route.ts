import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

export async function POST(request: NextRequest) {
	try {
		const { tag, secret } = await request.json();

		// Verify the secret to prevent unauthorized cache invalidation
		if (secret !== process.env.REVALIDATION_SECRET) {
			return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
		}

		// Validate the tag
		const validTags = Object.values(CACHE_TAGS);
		if (!validTags.includes(tag)) {
			return NextResponse.json({ error: "Invalid tag", validTags }, { status: 400 });
		}

		// Revalidate the specified tag
		revalidateTag(tag);

		return NextResponse.json({
			success: true,
			message: `Cache revalidated for tag: ${tag}`,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Cache revalidation error:", error);
		return NextResponse.json({ error: "Failed to revalidate cache" }, { status: 500 });
	}
}

// GET endpoint to show cache status
export async function GET() {
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
			curl: `curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL}/api/cache/revalidate -H "Content-Type: application/json" -d '{"tag":"portfolio","secret":"your-secret"}'`,
		},
	});
}
