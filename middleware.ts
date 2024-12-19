import { type NextRequest, NextResponse } from "next/server";
import { unstable_precompute as precompute } from "@vercel/flags/next";
import { pageFlags, showBlog, showAnalysis, showShop } from "@/lib/feature-flags";

// Match all routes
export const config = {
	matcher: [
		// Match all paths except static files and API routes
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	// Skip middleware for non-feature flag paths
	if (!path.includes("/blog") && !path.includes("/analysis") && !path.includes("/shop")) {
		return NextResponse.next();
	}

	// Check feature flags based on the path
	if (path.includes("/blog")) {
		const blogEnabled = await showBlog();
		if (!blogEnabled) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	if (path.includes("/analysis")) {
		const analysisEnabled = await showAnalysis();
		if (!analysisEnabled) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	if (path.includes("/shop")) {
		const shopEnabled = await showShop();
		if (!shopEnabled) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// Precompute flags for the current request
	const code = await precompute(pageFlags);

	// Add environment variables to response headers
	const response = NextResponse.rewrite(new URL(`/${code}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url));

	// Add feature flag environment variables to response
	response.headers.set(
		"x-env",
		JSON.stringify({
			NEXT_PUBLIC_BLOG_ENABLED: process.env.NEXT_PUBLIC_BLOG_ENABLED,
			NEXT_PUBLIC_ANALYSIS_ENABLED: process.env.NEXT_PUBLIC_ANALYSIS_ENABLED,
			NEXT_PUBLIC_SHOP_ENABLED: process.env.NEXT_PUBLIC_SHOP_ENABLED,
		})
	);

	return response;
}

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
