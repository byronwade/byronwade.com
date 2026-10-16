import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";

// Thorbis Design: Inter UI/body and Geist Mono. Source: src/styles.css @ 46b6654.
export const interSans = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
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
