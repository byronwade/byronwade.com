/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "placehold.co",
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	env: {
		SKIP_PLAYWRIGHT: process.env.NODE_ENV === "production" ? "1" : "",
	},
};

export default nextConfig;
