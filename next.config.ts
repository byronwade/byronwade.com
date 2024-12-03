import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const config: import("next").NextConfig = {
	output: "standalone",
	experimental: {
		ppr: true,
		inlineCss: true,
		dynamicIO: true,
	},
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
};

const analyzeBundleConfig =
	process.env.ANALYZE === "true"
		? withBundleAnalyzer({
				enabled: true,
		  })
		: (config: import("next").NextConfig) => config;

export default analyzeBundleConfig(config);
