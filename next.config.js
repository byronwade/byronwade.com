const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const sharedPrimitivePackages =
	/[\\/]node_modules[\\/](?:@base-ui|@floating-ui|@phosphor-icons|class-variance-authority|clsx|next|tailwind-merge|react-compiler-runtime)[\\/]/;
const sharedPrimitiveSources =
	/[\\/](?:lib[\\/](?:utils|motion|contact|icons[\\/]create-icon)|components[\\/]ui[\\/]button)\.tsx?$/;
const sharedRootEntries = new Set(["app/page", "app/layout", "app/not-found"]);
// Every page loads the root layout and error boundary chunks, so a script
// module they share with any other chunk can move to shared-primitives without
// adding a byte to any route. Stylesheets stay out: a CSS module here would
// emit an extra stylesheet.
const everyPageEntries = new Set(["app/layout", "app/error"]);
const scriptResource = /\.(?:[cm]?js|tsx?)$/;

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
							// Select modules shared by the same root entries as before, then
							// remove their copies from every consumer. Filtering chunks by
							// root left duplicates in detail pages; filtering module ownership
							// keeps unrelated route code out of the shared initial download.
							test: (module, { chunkGraph }) => {
								if (!module.resource) {
									return false;
								}
								const chunks = [...chunkGraph.getModuleChunksIterable(module)];
								if (
									(sharedPrimitivePackages.test(module.resource) ||
										sharedPrimitiveSources.test(module.resource)) &&
									chunks.filter((chunk) => sharedRootEntries.has(chunk.name)).length >= 2
								) {
									return true;
								}
								return (
									chunks.length >= 2 &&
									chunks.some((chunk) => everyPageEntries.has(chunk.name)) &&
									module.type.startsWith("javascript") &&
									scriptResource.test(module.resource.split("?")[0])
								);
							},
							name: "shared-primitives",
							chunks: "all",
							enforce: true,
							priority: 35,
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
