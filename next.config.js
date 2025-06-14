/** @type {import('next').NextConfig} */
const nextConfig = {
	// Absolutely minimal configuration
	reactStrictMode: false,
	poweredByHeader: false,

	// Only essential image configuration
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
		],
	},
};

module.exports = nextConfig;
