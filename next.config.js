/** @type {import('next').NextConfig} */
const nextConfig = {
	// React 19 and Next.js 16 best practices
	reactStrictMode: true,
	poweredByHeader: false,

	// React Compiler disabled (requires babel-plugin-react-compiler)
	// reactCompiler: true,

	// Disable cache components so dynamic API route configs are allowed
	cacheComponents: false,

	// Enhanced image optimization
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.dribbble.com",
			},
			{
				protocol: "https",
				hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "s3-alpha.figma.com",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				// thum.io - free screenshot service for project previews
				protocol: "https",
				hostname: "image.thum.io",
			},
		],
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},

	// Performance optimizations
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},

	// Turbopack configuration (for Next.js 16+)
	turbopack: {},

	// Webpack optimizations (for production builds)
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						default: false,
						vendors: false,
						framework: {
							name: "framework",
							chunks: "all",
							test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
							priority: 40,
							enforce: true,
						},
						lib: {
							test(module) {
								return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
							},
							name(module) {
								const hash = require("node:crypto").createHash("sha1");
								hash.update(module.identifier());
								return hash.digest("hex").substring(0, 8);
							},
							priority: 30,
							minChunks: 1,
							reuseExistingChunk: true,
						},
						commons: {
							name: "commons",
							minChunks: 2,
							priority: 20,
						},
						shared: {
							name(_module, chunks) {
								return require("node:crypto")
									.createHash("sha1")
									.update(chunks.reduce((acc, chunk) => acc + chunk.name, ""))
									.digest("hex")
									.substring(0, 8);
							},
							priority: 10,
							minChunks: 2,
							reuseExistingChunk: true,
						},
					},
					maxInitialRequests: 25,
					minSize: 20000,
				},
			};
		}
		return config;
	},
};

module.exports = nextConfig;
