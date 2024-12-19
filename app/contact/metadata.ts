import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Byron Wade - Let's Work Together",
	description: "Get in touch with Byron Wade for web development projects, business opportunities, or speaking engagements. I'm always open to discussing new ideas and collaborations.",
	openGraph: {
		title: "Contact Byron Wade - Let's Work Together",
		description: "Get in touch with Byron Wade for web development projects, business opportunities, or speaking engagements. I'm always open to discussing new ideas and collaborations.",
		images: [
			{
				url: new URL("/api/og?title=Contact Byron Wade&description=Let%27s Work Together&type=contact", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString(),
				width: 1200,
				height: 630,
				alt: "Contact Byron Wade",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Byron Wade - Let's Work Together",
		description: "Get in touch with Byron Wade for web development projects, business opportunities, or speaking engagements. I'm always open to discussing new ideas and collaborations.",
		images: [new URL("/api/og?title=Contact Byron Wade&description=Let%27s Work Together&type=contact", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString()],
	},
};
