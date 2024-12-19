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

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning dir="ltr">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
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
			</body>
		</html>
	);
}
