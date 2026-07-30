import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
	generateOrganizationStructuredData,
	generatePersonStructuredData,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import "./globals.css";
import { ErrorBoundary, ThemeProvider } from "@/components/common";
import SiteLayout from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner";
import { archivo, customFont, geistMono, manrope } from "@/lib/fonts";
import { metadata, viewport } from "./metadata.config";

const personJsonLd = generatePersonStructuredData();
const organizationJsonLd = generateOrganizationStructuredData();
const websiteJsonLd = generateWebSiteStructuredData();

export { metadata, viewport };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning dir="ltr">
			<head>
				<link rel="dns-prefetch" href="//api.github.com" />
				<link rel="dns-prefetch" href="//api.dribbble.com" />
				<link rel="dns-prefetch" href="//api.figma.com" />
			</head>
			<body
				className={`${manrope.variable} ${archivo.variable} ${geistMono.variable} ${customFont.variable} min-h-screen bg-background font-sans antialiased touch-pan-y`}
			>
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<ErrorBoundary>
						<NuqsAdapter>
							<SiteLayout>{children}</SiteLayout>
						</NuqsAdapter>
						<Toaster />
					</ErrorBoundary>
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
