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
	experimental: {
		inlineCss: true,
		ppr: true,
		optimizeCss: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.alias = {
				...config.resolve.alias,
				sharp$: false,
				"image-trace-loader$": false,
			};
		}

		config.watchOptions = {
			...config.watchOptions,
			ignored: ["**/tests/**", "**/analysis/**", "**/playwright/**"],
		};

		return config;
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
};

export default nextConfig;
