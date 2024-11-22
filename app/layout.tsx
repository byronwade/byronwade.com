import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { Providers } from "./providers";

const Header = dynamic(() => import("@/components/header"));
const Background = dynamic(() => import("@/components/sections/background"));
const Footer = dynamic(() => import("@/components/footer"));

export const metadata: Metadata = {
	title: "Byron Wade",
	description: "Fast Web Apps",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Preconnect to Shopify CDN */}
				<link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
			</head>
			<body className={`${GeistSans.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
					<Providers>
						<Header />
						<main>
							{children}
							<Background />
						</main>
						<Footer />
					</Providers>
				</ThemeProvider>
				<GoogleAnalytics gaId="G-WE1RMQ935W" />
			</body>
		</html>
	);
}
