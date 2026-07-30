import { Geist_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import localFont from "next/font/local";

/** Body / UI — contemporary geometric sans */
export const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jakarta",
	preload: true,
	weight: ["400", "500", "600", "700"],
});

/**
 * Display face — Syne gives headings a modern studio voice
 * without looking like a default AI portfolio stack.
 */
export const syne = Syne({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-syne",
	preload: false,
	weight: ["600", "700", "800"],
});

/** Monospace — code, metrics, meta labels */
export const geistMono = Geist_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
});

/** Signature wordmark font for personal branding accents */
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

/** @deprecated transitional aliases */
export const manrope = jakarta;
export const archivo = syne;
export const geistSans = jakarta;
