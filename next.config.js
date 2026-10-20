const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const sharedPrimitivePackages =
	/[\\/]node_modules[\\/](?:@base-ui|@floating-ui|@phosphor-icons|class-variance-authority|clsx|next|tailwind-merge|react-compiler-runtime)[\\/]/;
const sharedClassnamePackages =
	/[\\/]node_modules[\\/](?:tailwind-merge|clsx|class-variance-authority)[\\/]/;
const sharedPrimitiveSources =
	/[\\/](?:lib[\\/](?:utils|motion|contact|icons[\\/]create-icon)|components[\\/]ui[\\/]button)\.tsx?$/;

const imageRemotePatterns = [
	{ hostname: "cdn.dribbble.com", protocol: "https" },
	{ hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com", protocol: "https" },
	{ hostname: "s3-alpha.figma.com", protocol: "https" },
	{ hostname: "res.cloudinary.com", protocol: "https" },
	{ hostname: "images.unsplash.com", protocol: "https" },
	{ hostname: "opengraph.githubassets.com", protocol: "https" },
	{ hostname: "image.thum.io", protocol: "https" },
];

// @sparticuz/chromium reads its compressed browser from bin/ at runtime by a
// computed path, so file tracing misses it. Without these files the deployed
// resume PDF route fails before it can launch a browser.
const routeFileTracingIncludes = Object.fromEntries([
	["/api/resume-pdf", ["./node_modules/@sparticuz/chromium/bin/**"]],
]);

const retiredPortfolioPages = [
	"/portfolio/thorbis",
	"/portfolio/thorbis-ai",
	"/portfolio/thorbis-mobile",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: false,
	compress: true,

	experimental: {
		// Resolve pure facades to each consumer's actual server/client dependencies.
		optimizePackageImports: [
			"date-fns",
			"@/lib/icons",
			"@/components/common",
			"@/components/project",
		],
	},

	images: {
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		formats: ["image/webp", "image/avif"],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: imageRemotePatterns,
		...(process.env.NODE_ENV === "development" ? { unoptimized: true } : {}),
	},
	outputFileTracingIncludes: routeFileTracingIncludes,
	poweredByHeader: false,

	// The 2024 Thorbis pitch pages were retired; their links land on the current case study.
	// Exact sources only: a /portfolio pattern would shadow /portfolio/figma/[key].
	async redirects() {
		return retiredPortfolioPages.map((source) => ({
			destination: "/projects/thorbis",
			permanent: true,
			source,
		}));
	},

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
						// tailwind-merge already lives in shared-primitives via the layout.
						// Other routes are outside that group, so each page chunk compiled
						// and ran a second copy during hydration. Keep one copy in the
						// chunk every route already requests.
						sharedClassnames: {
							test: sharedClassnamePackages,
							name: "shared-primitives",
							chunks: "all",
							enforce: true,
							priority: 40,
							reuseExistingChunk: true,
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
