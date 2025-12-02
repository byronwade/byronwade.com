import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

// Plus Jakarta Sans - warm, friendly, approachable font perfect for retro/warm aesthetic
export const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Custom signature font for branding
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
