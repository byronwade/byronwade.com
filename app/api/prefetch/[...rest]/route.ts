import { NextRequest, NextResponse } from "next/server";
import { parseHTML } from "linkedom";

export const dynamic = "force-static";

function getHostname() {
  if (process.env.NODE_ENV === "development") {
    return "localhost:3000";
  }
  if (process.env.VERCEL_ENV === "production") {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }
  return process.env.VERCEL_BRANCH_URL;
}

type Params = { rest: string[] };

export async function GET(request: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
	try {
		const schema = process.env.NODE_ENV === "development" ? "http" : "https";
		const host = getHostname();
		if (!host) {
			return NextResponse.json({ error: "Failed to get hostname from env" }, { status: 500 });
		}

		const href = params.rest.join("/");
		if (!href) {
			return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
		}

		const url = `${schema}://${host}/${href}`;
		const response = await fetch(url);
		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
		}

		const body = await response.text();
		const { document } = parseHTML(body);
		const images = Array.from(document.querySelectorAll("main img"))
			.map((img) => ({
				srcset: img.getAttribute("srcset") || img.getAttribute("srcSet"),
				sizes: img.getAttribute("sizes"),
				src: img.getAttribute("src"),
				alt: img.getAttribute("alt"),
				loading: img.getAttribute("loading"),
			}))
			.filter((img) => img.src);

		return NextResponse.json(
			{ images },
			{
				headers: {
					"Cache-Control": "public, max-age=3600",
				},
			}
		);
	} catch (error) {
		return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
	}
}