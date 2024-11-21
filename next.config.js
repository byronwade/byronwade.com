/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000", "your-domain.com"],
		},
	},
	webpack: (config) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			net: false,
			tls: false,
		};
		return config;
	},
	transpilePackages: ["framer-motion"],
};

module.exports = nextConfig;
