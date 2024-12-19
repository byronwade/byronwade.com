<<<<<<< HEAD
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Providers } from "./providers";
import { metadata } from "./metadata.config";

// Dynamically import heavy components
const Header = dynamic(() => import("@/components/header"), {
	loading: () => <LoadingSpinner />,
	ssr: true,
});

const Background = dynamic(() => import("@/components/sections/background"), {
	loading: () => <LoadingSpinner />,
	ssr: true,
});

const Footer = dynamic(() => import("@/components/footer"), {
	loading: () => <LoadingSpinner />,
	ssr: true,
});
=======
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
>>>>>>> 06477deeb9617c74a7dd15e792c25f430d0bcd74

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Byron Wade",
	alternateName: "Byron Wade Portfolio",
	url: "https://byronwade.com",
	description: "Expert full-stack developer specializing in high-performance web applications and modern solutions.",
	sameAs: ["https://twitter.com/byronwade", "https://github.com/byronwade", "https://linkedin.com/in/byronwade"],
	publisher: {
		"@type": "Organization",
		name: "Byron Wade",
		logo: {
			"@type": "ImageObject",
			url: "https://byronwade.com/logo.png",
		},
	},
<<<<<<< HEAD
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://byronwade.com/search?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
	accessibilityFeature: ["highContrastDisplay", "readingOrder", "structuralNavigation", "tableOfContents", "alternativeText"],
	accessibilityControl: ["fullKeyboardControl", "fullMouseControl", "fullTouchControl"],
	accessibilityHazard: "noFlashingHazard",
};

export { metadata };

=======
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

>>>>>>> 06477deeb9617c74a7dd15e792c25f430d0bcd74
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning dir="ltr">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
<<<<<<< HEAD
				<link rel="dns-prefetch" href="https://cdn.shopify.com" />
				<link rel="alternate" type="application/rss+xml" title="Byron Wade's Blog RSS Feed" href="/feed.xml" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="theme-color" content="#000000" />
				<meta name="color-scheme" content="dark light" />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</head>
			<body className={`${GeistSans.className} antialiased min-h-screen`}>
				<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-zinc-50 focus:text-black" role="navigation" aria-label="Skip to main content">
					Skip to main content
				</a>

				<Providers>
					<Suspense
						fallback={
							<div role="status" aria-label="Loading header">
								<LoadingSpinner />
							</div>
						}
					>
						<Header />
					</Suspense>

					<main id="main-content" role="main" tabIndex={-1} aria-label="Main content">
						<Suspense
							fallback={
								<div role="status" aria-label="Loading content">
									<LoadingSpinner />
								</div>
							}
						>
							<div role="region" aria-label="Page content">
								{children}
							</div>
						</Suspense>

						<Suspense
							fallback={
								<div role="status" aria-label="Loading background">
									<LoadingSpinner />
								</div>
							}
						>
							<section role="complementary" aria-label="Background decoration">
								<Background />
							</section>
						</Suspense>
					</main>

					<Suspense
						fallback={
							<div role="status" aria-label="Loading footer">
								<LoadingSpinner />
							</div>
						}
					>
						<footer role="contentinfo" aria-label="Site footer">
							<Footer />
						</footer>
					</Suspense>
				</Providers>

				<div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="live-announcements"></div>
=======
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
>>>>>>> 06477deeb9617c74a7dd15e792c25f430d0bcd74
			</body>
		</html>
	);
}
