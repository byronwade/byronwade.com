/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true, // Only if you want to ignore ESLint during builds
	},
	typescript: {
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		ignoreBuildErrors: true, // Only if you want to ignore TypeScript errors during builds
	},
};

module.exports = nextConfig;
