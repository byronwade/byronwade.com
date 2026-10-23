import type { Metadata, Viewport } from "next";
import { defaultDescription, defaultKeywords, generateOGImageUrl } from "@/lib/seo";
import { siteUrl, xHandle } from "@/lib/site";

const homeShareImage = generateOGImageUrl({
	title: "Byron Wade",
	description: defaultDescription,
});

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		template: "%s | Byron Wade",
		default: "Byron Wade, Software for Service Businesses",
	},
	description: defaultDescription,
	applicationName: "Byron Wade Portfolio",
	authors: [{ name: "Byron Wade", url: "https://byronwade.com" }],
	generator: "Next.js",
	keywords: defaultKeywords,
	referrer: "origin-when-cross-origin",
	creator: "Byron Wade",
	publisher: "Byron Wade",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "technology",
	// Index/follow are crawler defaults. Inheriting them here would contradict
	// Next's automatic noindex on 404s; only preview limits belong at the root.
	robots: {
		googleBot: {
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: siteUrl,
		types: {
			"application/rss+xml": "/feed.xml",
		},
	},
	// Icons are provided via the App Router file convention (app/icon.png, app/apple-icon.png)
	manifest: "/manifest.json",
	openGraph: {
		type: "website",
		locale: "en_US",
		alternateLocale: "en_GB",
		siteName: "Byron Wade",
		title: "Byron Wade, Software for Service Businesses",
		description: defaultDescription,
		url: "https://byronwade.com",
		images: [
			{
				url: homeShareImage,
				width: 1200,
				height: 630,
				alt: "Byron Wade, Software for Service Businesses",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Byron Wade, Software for Service Businesses",
		description: defaultDescription,
		creator: `@${xHandle}`,
		images: [homeShareImage],
	},
	appleWebApp: {
		capable: true,
		title: "Byron Wade",
		statusBarStyle: "black-translucent",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	viewportFit: "cover",
};
