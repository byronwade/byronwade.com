import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { Providers } from "./providers";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Dynamically import heavy components
const Header = dynamic(() => import("@/components/header"), {
	loading: () => <LoadingSpinner />,
});

const Background = dynamic(() => import("@/components/sections/background"), {
	loading: () => <LoadingSpinner />,
});

const Footer = dynamic(() => import("@/components/footer"), {
	loading: () => <LoadingSpinner />,
});

export const metadata: Metadata = {
	title: {
		template: "%s | Byron Wade",
		default: "Byron Wade",
	},
	description: "Fast Web Apps",
};

export const revalidate = 86400; // One day

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
			</head>
			<body className={`${GeistSans.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
					<Providers>
						{/* Split header into its own chunk */}
						<Suspense fallback={<LoadingSpinner />}>
							<Header />
						</Suspense>

						<main>
							{/* Main content chunk */}
							<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>

							{/* Background as separate chunk */}
							<Suspense fallback={<LoadingSpinner />}>
								<Background />
							</Suspense>
						</main>

						{/* Footer as separate chunk */}
						<Suspense fallback={<LoadingSpinner />}>
							<Footer />
						</Suspense>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
