import { Archivo, Geist_Mono, Manrope } from "next/font/google";
import localFont from "next/font/local";

/** Body / UI — humanist sans for long-form readability */
export const manrope = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-manrope",
	preload: true,
	weight: ["400", "700"],
});

/**
 * Display face — squared grotesque against Manrope's humanist body.
 * Headings get their own voice instead of running the body face at weight 800.
 */
export const archivo = Archivo({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-archivo",
	preload: false,
	weight: ["700", "800"],
});

/** Monospace — code, metrics, spec labels */
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

/** @deprecated Use `manrope` — kept for transitional imports */
export const geistSans = manrope;
