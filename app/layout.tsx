import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
// import { PerformanceMonitor } from "@/components/performance-monitor";
// import { PerformanceOptimizer } from "@/components/performance-optimizer";
// import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
// import ErrorBoundary from "@/components/error-boundary";
import Background from "@/components/sections/background";
import { metadata } from "./metadata.config";
// import { Suspense } from "react";

// Force static rendering to fix streaming issue
export const dynamic = "force-static";
export const revalidate = false;

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	preload: true,
	fallback: ["system-ui", "arial"],
});

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Byron Wade",
	url: "https://byronwade.com",
	image: "https://byronwade.com/avatar.avif",
	sameAs: ["https://github.com/byronwade", "https://linkedin.com/in/byronwade", "https://twitter.com/byronwade"],
	jobTitle: "Full Stack Developer",
	worksFor: {
		"@type": "Organization",
		name: "Byron Wade Development",
	},
	knowsAbout: ["Web Development", "JavaScript", "React", "Next.js", "Node.js", "TypeScript", "Performance Optimization", "SEO"],
	description: "Expert full-stack developer specializing in high-performance web applications, modern JavaScript frameworks, and scalable solutions.",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Santa Cruz",
		addressRegion: "CA",
		addressCountry: "US",
	},
	email: "byron@byronwade.com",
	telephone: "+1-831-295-8460",
	alumniOf: {
		"@type": "Organization",
		name: "Self-Taught Developer",
	},
	hasOccupation: {
		"@type": "Occupation",
		name: "Full Stack Developer",
		occupationLocation: {
			"@type": "City",
			name: "Santa Cruz, CA",
		},
		skills: "JavaScript, TypeScript, React, Next.js, Node.js, Python, Web Performance, SEO, Accessibility",
	},
	offers: {
		"@type": "Offer",
		itemOffered: {
			"@type": "Service",
			name: "Web Development Services",
			description: "Custom web application development, performance optimization, and technical consulting",
		},
	},
};

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full dark" suppressHydrationWarning dir="ltr">
			<body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
				<ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
					<Background />
					<div className="relative flex min-h-screen flex-col">
						<Header />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
