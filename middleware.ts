import { type NextRequest, NextResponse } from "next/server";

// Match all routes
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - robots.txt (SEO file)
		 * - sitemap.xml (SEO file)
		 * - manifest.json (PWA file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};

export async function middleware(request: NextRequest) {
	return NextResponse.next();
}
