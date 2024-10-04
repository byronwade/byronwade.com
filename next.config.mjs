/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // Add any other domains you're using for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
