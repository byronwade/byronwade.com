// next-seo.config.ts
import type { NextSeoProps } from "next-seo";

export const NEXT_SEO_DEFAULT: NextSeoProps = {
	title: "Byron Wade",
	description: "I am a programmer, entrepreneur, plumber and teacher.",
	openGraph: {
		type: "website",
		locale: "en_IE",
		url: "https://www.byronwade.com",
		title: "Byron Wade",
		description: "I am a programmer, entrepreneur, plumber and teacher.",
		images: [
			{
				url: "https://byronwade.com/api/og?title=Programmer.%20Plumber.%20Entrepuner.",
				width: 800,
				height: 600,
				alt: "Og Image Alt A",
				type: "image/jpeg",
				secureUrl:
					"https://byronwade.com/api/og?title=Programmer.%20Plumber.%20Entrepuner.",
			},
		],
		siteName: "Byron Wade",
	},
	twitter: {
		handle: "@byron_c_wade",
		site: "https://byronwade.com/",
		cardType: "summary_large_image",
	},
};
