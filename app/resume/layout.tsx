import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
	title: "Resume",
	description:
		"Byron Wade's professional resume. 8+ years of experience in business management, plumbing operations, and web development. Proven track record scaling businesses from startup to multi-million dollar operations.",
	keywords: [
		"Resume",
		"CV",
		"Byron Wade",
		"Experience",
		"Skills",
		"Professional Resume",
		"Full Stack Developer",
		"Business Manager",
		"Plumbing Contractor",
	],
	image: generateOGImageUrl({
		title: "Resume - Byron Wade",
		description: "Professional resume and experience",
		type: "website",
	}),
	canonical: "https://byronwade.com/resume",
	type: "website",
});

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
	return children;
}
