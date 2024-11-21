import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";

const Header = dynamic(() => import("@/components/header"));
const Background = dynamic(() => import("@/components/sections/background"));

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
			<body className={`${GeistSans.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
					<Header />
					<main>
						{children}
						<Background />
					</main>
					<Footer />
				</ThemeProvider>
				<GoogleAnalytics gaId="G-WE1RMQ935W" />
			</body>
		</html>
	);
}
