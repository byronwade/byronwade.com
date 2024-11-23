import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
	runtime: "experimental-edge",
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Edge caching headers
	response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
	response.headers.set("CDN-Cache-Control", "public, max-age=31536000, immutable");
	response.headers.set("Vercel-CDN-Cache-Control", "public, max-age=31536000, immutable");

	// Edge security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

	return response;
}
