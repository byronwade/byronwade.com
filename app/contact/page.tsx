import type { Metadata } from "next";
import { Suspense } from "react";
import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import ContactClient from "./contact-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

export const metadata: Metadata = generateSEOMetadata({
	title: "Contact",
	description:
		"Get in touch with Byron Wade, full-stack developer. Reach out about development work, collaborations, or software for service businesses.",
	keywords: ["Contact", "Byron Wade", "Hire Developer", "Full Stack Developer", "Web Development"],
	image: generateOGImageUrl({
		title: "Contact",
		description: "Get in touch with Byron Wade",
		type: "website",
	}),
	canonical: `${baseUrl}/contact`,
	type: "website",
});

export default function ContactPage() {
	return (
		<Suspense fallback={null}>
			<ContactClient />
		</Suspense>
	);
}
