/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
	images: {
		minimumCacheTTL: 31536000,
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
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		inlineCss: true,
		optimizeCss: true,
		scrollRestoration: true,
	},
	onDemandEntries: {
		maxInactiveAge: 60 * 60 * 1000,
		pagesBufferLength: 5,
	},
	env: {
		SKIP_PLAYWRIGHT: "1",
		NEXT_PUBLIC_ENABLE_IMAGE_COMPARISON: "true",
	},
	poweredByHeader: false,
	compress: true,
	reactStrictMode: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	productionBrowserSourceMaps: false,
	httpAgentOptions: {
		keepAlive: true,
	},
};

export default nextConfig;
