import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

/** Soft modern UI — Geist for body and display (one calm voice) */
export const geist = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist",
	preload: true,
});

/** Monospace — code and dense meta */
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

/** @deprecated transitional aliases — all map to Geist */
export const jakarta = geist;
export const syne = geist;
export const manrope = geist;
export const archivo = geist;
export const geistSans = geist;
