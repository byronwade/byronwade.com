import {
	generateOrganizationStructuredData,
	generatePersonStructuredData,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { metadata } from "./metadata.config";

const personJsonLd = generatePersonStructuredData();
const organizationJsonLd = generateOrganizationStructuredData();
const websiteJsonLd = generateWebSiteStructuredData();

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning dir="ltr">
			<body className="min-h-screen bg-background font-normal antialiased touch-pan-y">
				{/* Structured Data - Person */}
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				{/* Structured Data - Organization */}
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				{/* Structured Data - Website */}
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="flex-1">{children}</main>
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
