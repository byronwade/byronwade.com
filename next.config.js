const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const sharedPrimitivePackages =
	/[\\/]node_modules[\\/](?:@base-ui|@floating-ui|@phosphor-icons|class-variance-authority|clsx|next|tailwind-merge|react-compiler-runtime)[\\/]/;
const sharedPrimitiveSources =
	/[\\/](?:lib[\\/](?:utils|motion|icons[\\/]create-icon)|components[\\/]ui[\\/]button)\.tsx?$/;

const imageRemotePatterns = [
	{ hostname: "cdn.dribbble.com", protocol: "https" },
	{ hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com", protocol: "https" },
	{ hostname: "s3-alpha.figma.com", protocol: "https" },
	{ hostname: "res.cloudinary.com", protocol: "https" },
	{ hostname: "images.unsplash.com", protocol: "https" },
	{ hostname: "opengraph.githubassets.com", protocol: "https" },
	{ hostname: "image.thum.io", protocol: "https" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: false,
	compress: true,

	experimental: {
		// Resolve pure facades to each consumer's actual server/client dependencies.
		optimizePackageImports: ["date-fns", "@/lib/icons", "@/components/common"],
	},

	images: {
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		formats: ["image/webp", "image/avif"],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: imageRemotePatterns,
		...(process.env.NODE_ENV === "development" ? { unoptimized: true } : {}),
	},
	poweredByHeader: false,

	// React Compiler (stable in Next.js 16): automatically memoizes components
	// so unnecessary re-renders are eliminated without manual useMemo/useCallback.
	reactCompiler: true,
	reactStrictMode: true,
	turbopack: {},
	webpack(config, { dev, isServer }) {
		if (dev) {
			return config;
		}
		// This diagnostic is development-only. Webpack otherwise resolves its
		// package metadata before removing the NODE_ENV-guarded dynamic import.
		const production = {
			...config,
			resolve: {
				...config.resolve,
				alias: { ...config.resolve.alias, "react-scan": false },
			},
		};
		if (isServer) {
			return production;
		}
		// Next's framework/lib groups keep React and the router shared. Avoid
		// extra tiny vendor/default groups per entry: the homepage must stay
		// within the existing ten-script budget, including Vercel diagnostics.
		const client = {
			...production,
			optimization: {
				...config.optimization,
				splitChunks: {
					...config.optimization.splitChunks,
					cacheGroups: {
						...config.optimization.splitChunks.cacheGroups,
						default: false,
						defaultVendors: false,
						sharedPrimitives: {
							// Home also loads the root layout and not-found fallback. Share
							// their overlap without collecting unrelated route entries.
							test: (module) =>
								Boolean(
									module.resource &&
										(sharedPrimitivePackages.test(module.resource) ||
											sharedPrimitiveSources.test(module.resource))
								),
							name: "shared-primitives",
							chunks: (chunk) =>
								chunk.name === "app/page" ||
								chunk.name === "app/layout" ||
								chunk.name === "app/not-found",
							minChunks: 2,
							enforce: true,
							priority: 35,
						},
					},
				},
			},
		};
		return client;
	},

	...(process.env.NODE_ENV === "production" && {
		async headers() {
			return [
				{
					headers: [
						{ key: "X-Content-Type-Options", value: "nosniff" },
						{ key: "X-Frame-Options", value: "DENY" },
						{ key: "X-XSS-Protection", value: "1; mode=block" },
					],
					source: "/(.*)",
				},
				// Note: /_next/static is already served immutable by Next.js, so no
				// manual Cache-Control is set for it (doing so triggers a build warning
				// and can interfere with Next's own handling).
				{
					headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
					source: "/images/(.*)",
				},
			];
		},
		output: "standalone",
	}),

	typescript: {
		ignoreBuildErrors: false,
	},
};

module.exports = withBundleAnalyzer(nextConfig);
