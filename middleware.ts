import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
		default-src 'self';
		script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline';
		style-src 'self' 'unsafe-inline';
		img-src 'self' blob: data: https:;
		font-src 'self' data:;
		connect-src 'self' https:;
		media-src 'self';
		object-src 'none';
		base-uri 'self';
		form-action 'self';
		frame-ancestors 'none';
		block-all-mixed-content;
		upgrade-insecure-requests;
	`;

	// Clone the response so we can modify headers
	const response = NextResponse.next();

	// Add security headers
	const headers = response.headers;

	// CSP Header
	headers.set("Content-Security-Policy", cspHeader.replace(/\s{2,}/g, " ").trim());

	// HSTS Header
	headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

	// X-Frame-Options Header
	headers.set("X-Frame-Options", "DENY");

	// X-Content-Type-Options Header
	headers.set("X-Content-Type-Options", "nosniff");

	// Referrer-Policy Header
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// Permissions-Policy Header
	headers.set(
		"Permissions-Policy",
		"accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()"
	);

	// X-XSS-Protection Header
	headers.set("X-XSS-Protection", "1; mode=block");

	// Cache Control for Static Assets
	if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
		headers.set("Cache-Control", "public, max-age=31536000, immutable");
	}

	// Add Server-Timing Header for Performance Monitoring
	headers.set("Server-Timing", "cdn-cache;desc=HIT, edge;dur=50");

	// Add Feature-Policy Header
	headers.set("Feature-Policy", "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'");

	// Add Cross-Origin Headers
	headers.set("Cross-Origin-Opener-Policy", "same-origin");
	headers.set("Cross-Origin-Resource-Policy", "same-origin");
	headers.set("Cross-Origin-Embedder-Policy", "require-corp");

	// Add Timing-Allow-Origin Header
	headers.set("Timing-Allow-Origin", "*");

	// Add X-DNS-Prefetch-Control Header
	headers.set("X-DNS-Prefetch-Control", "on");

	// Add X-Download-Options Header
	headers.set("X-Download-Options", "noopen");

	// Add X-Permitted-Cross-Domain-Policies Header
	headers.set("X-Permitted-Cross-Domain-Policies", "none");

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
