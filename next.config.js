const { get } = require("@vercel/edge-config");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		formats: ["image/avif", "image/webp"],
		domains: ["cdn.dribbble.com", "raw.githubusercontent.com", "via.placeholder.com"],
		// Twitter Profile Picture
		remotePatterns: [
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				pathname: "/**",
			},
		],
	},
	experimental: {
		appDir: true,
		enableUndici: true,
	},
	redirects() {
		try {
			return get("redirects");
		} catch {
			return [];
		}
	},
	headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
};

// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
    default-src 'self' vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'none';
    connect-src *;
    font-src 'self';
`;

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy.replace(/\n/g, ""),
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: "Referrer-Policy",
		value: "origin-when-cross-origin",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "Access-Control-Allow-Origin",
		value: "*",
	},
	{
		key: "Access-Control-Allow-Credentials",
		value: "true",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

module.exports = nextConfig;
