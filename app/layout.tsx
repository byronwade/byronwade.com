import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ThemeProvider } from "@/components/theme-provider";
import { EnvScript } from "./env-script";

// Server components
import Header from "@/components/header";
import Background from "@/components/sections/background";
import Footer from "@/components/footer";

export const metadata: Metadata = {
	title: {
		template: "%s | Byron Wade",
		default: "Byron Wade",
	},
	description: "Fast Web Apps",
	metadataBase: new URL("https://byronwade.com"),
	openGraph: {
		title: "Byron Wade",
		description: "Fast Web Apps",
		url: "https://byronwade.com",
		siteName: "Byron Wade",
		locale: "en_US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Byron Wade",
		card: "summary_large_image",
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
		yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
		yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
				<link rel="preload" as="font" href="/fonts/geist-sans.woff2" type="font/woff2" crossOrigin="anonymous" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<EnvScript />
			</head>
			<body className={`${GeistSans.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
					<div className="relative">
						<Suspense fallback={<LoadingSpinner />}>
							<Header />
						</Suspense>

						<main className="relative">
							<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>

							<Suspense fallback={<LoadingSpinner />}>
								<Background />
							</Suspense>
						</main>

						<Suspense fallback={<LoadingSpinner />}>
							<Footer />
						</Suspense>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
