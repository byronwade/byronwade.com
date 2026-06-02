import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

// Body / UI — warm, friendly, highly legible
export const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700"],
});

// Display / editorial headings — elegant serif that pairs with the copper accent
export const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
	weight: "400",
	style: ["normal", "italic"],
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
