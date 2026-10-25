import { preload } from "react-dom";
import {
	generateOrganizationStructuredData,
	generatePersonStructuredData,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import "./globals.css";
import { ErrorBoundary, ReactScan, SiteAnalytics, ThemeProvider } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import SiteLayout from "@/components/layout/conditional-layout";

export { metadata, viewport } from "./metadata.config";

const personJsonLd = generatePersonStructuredData();
const organizationJsonLd = generateOrganizationStructuredData();
const websiteJsonLd = generateWebSiteStructuredData();

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// Not a `<link rel="preload">` element: React would emit it as a hint and render it too.
	// Prerendered pages get one tag; pages rendered per request get a `Link` header.
	preload("/fonts/inter-latin-core.woff2", {
		as: "font",
		type: "font/woff2",
		crossOrigin: "anonymous",
		fetchPriority: "high",
	});
	return (
		<html lang="en" className="h-full" suppressHydrationWarning dir="ltr">
			<body className="min-h-screen bg-background font-sans antialiased">
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<JsonLd data={personJsonLd} />
				<JsonLd data={organizationJsonLd} />
				<JsonLd data={websiteJsonLd} />
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<ErrorBoundary>
						<SiteLayout>{children}</SiteLayout>
					</ErrorBoundary>
				</ThemeProvider>
				<SiteAnalytics />
				<ReactScan />
			</body>
		</html>
	);
}
