import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// Body / UI. Geist, the byronwade/ui design-system typeface
export const geistSans = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
});

// Monospace, code, metrics, technical labels
export const geistMono = Geist_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
});

// Custom signature font for the wordmark / personal branding
export const customFont = localFont({
	src: [
		{
			path: "../public/fonts/Modelistasignature-ownAV.otf",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-signature",
});
