/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		nextScriptWorkers: true,
	},
    async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
              },
            ],
          },
        ];
      },
};

export default nextConfig;
