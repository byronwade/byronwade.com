import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// Thorbis Inter is copied byte-for-byte, declared in globals.css and explicitly
// preloaded in the root layout; this avoids a missing generated font manifest.

// Monospace, code, metrics, technical labels
export const geistMono = Geist_Mono({
	preload: false,
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
});

// Custom signature font for the wordmark / personal branding
export const customFont = localFont({
	preload: false,
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
