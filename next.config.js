const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const imageRemotePatterns = [
	{ protocol: "https", hostname: "cdn.dribbble.com" },
	{ protocol: "https", hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com" },
	{ protocol: "https", hostname: "s3-alpha.figma.com" },
	{ protocol: "https", hostname: "res.cloudinary.com" },
	{ protocol: "https", hostname: "images.unsplash.com" },
	{ protocol: "https", hostname: "opengraph.githubassets.com" },
	{ protocol: "https", hostname: "image.thum.io" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	cacheComponents: false,
	turbopack: {},

	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: imageRemotePatterns,
		...(process.env.NODE_ENV === "development" ? { unoptimized: true } : {}),
	},

	experimental: {
		...(process.env.ENABLE_LOCAL_FEATURES === "true" && {
			serverComponentsExternalPackages: ["@prisma/client"],
		}),
	},

	...(process.env.NODE_ENV === "production" && {
		output: "standalone",
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: [
						{ key: "X-Content-Type-Options", value: "nosniff" },
						{ key: "X-Frame-Options", value: "DENY" },
						{ key: "X-XSS-Protection", value: "1; mode=block" },
					],
				},
				{
					source: "/_next/static/(.*)",
					headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
				},
				{
					source: "/images/(.*)",
					headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
				},
			];
		},
	}),

	typescript: {
		ignoreBuildErrors: false,
	},
};

module.exports = withBundleAnalyzer(nextConfig);
