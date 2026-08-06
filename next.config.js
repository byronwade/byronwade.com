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

	// React Compiler (stable in Next.js 16): automatically memoizes components
	// so unnecessary re-renders are eliminated without manual useMemo/useCallback.
	reactCompiler: true,

	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: imageRemotePatterns,
		...(process.env.NODE_ENV === "development" ? { unoptimized: true } : {}),
	},

	experimental: {
		// Tree-shake barrel-file libraries so only the icons/helpers actually used
		// ship to the client. lucide-react alone is imported across 40+ files.
		optimizePackageImports: ["lucide-react", "date-fns", "framer-motion", "@radix-ui/react-icons"],
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
				// Note: /_next/static is already served immutable by Next.js, so no
				// manual Cache-Control is set for it (doing so triggers a build warning
				// and can interfere with Next's own handling).
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
