import { Metadata } from "next";

const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com"),
	title: {
		template: "%s | Byron Wade",
		default: "Byron Wade - Full Stack Developer & Web Performance Expert",
	},
	description: "Expert full-stack developer specializing in high-performance web applications, modern JavaScript frameworks, and scalable solutions. Transform your digital presence with cutting-edge development.",
	applicationName: "Byron Wade Portfolio",
	authors: [{ name: "Byron Wade", url: "https://byronwade.com" }],
	generator: "Next.js",
	keywords: ["Full Stack Developer", "Web Development", "JavaScript Expert", "React Developer", "NextJS Developer", "Web Performance", "SEO Optimization", "Byron Wade", "California Developer", "Tech Entrepreneur", "Accessibility", "Web Standards"],
	referrer: "origin-when-cross-origin",
	creator: "Byron Wade",
	publisher: "Byron Wade",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "technology",
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com",
		types: {
			"application/rss+xml": "/feed.xml",
		},
	},
	icons: {
		icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
		apple: [{ url: "/apple-icon.png" }, { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" }, { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" }],
		other: [
			{
				rel: "apple-touch-icon-precomposed",
				url: "/apple-touch-icon-precomposed.png",
			},
		],
	},
	manifest: "/manifest.json",
	openGraph: {
		type: "website",
		locale: "en_US",
		alternateLocale: "en_GB",
		siteName: "Byron Wade",
		title: "Byron Wade - Full Stack Developer & Web Performance Expert",
		description: "Expert full-stack developer specializing in high-performance web applications and modern solutions.",
		url: "https://byronwade.com",
		images: [
			{
				url: new URL("/api/og?title=Byron Wade&description=Full Stack Developer %26 Web Performance Expert&type=website", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString(),
				width: 1200,
				height: 630,
				alt: "Byron Wade - Full Stack Development Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Byron Wade - Full Stack Developer & Web Performance Expert",
		description: "Expert full-stack developer specializing in high-performance web applications and modern solutions.",
		creator: "@byronwade",
		creatorId: "1234567890",
		images: [new URL("/api/og?title=Byron Wade&description=Full Stack Developer %26 Web Performance Expert&type=website", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString()],
	},
	verification: {
		google: "your-google-verification-code",
		yandex: "your-yandex-verification-code",
		other: {
			"msvalidate.01": "your-bing-verification-code",
			"yahoo-site-verification": "your-yahoo-verification-code",
		},
	},
	appleWebApp: {
		capable: true,
		title: "Byron Wade",
		statusBarStyle: "black-translucent",
	},
	other: {
		"msapplication-TileColor": "#000000",
		"theme-color": "#000000",
	},
};

export { metadata };
