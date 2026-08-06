import type { Metadata } from "next";
import { Suspense } from "react";
import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import ContactClient from "./contact-client";

export const metadata: Metadata = generateSEOMetadata({
	title: "Contact",
	description:
		"Get in touch with Byron Wade — full-stack developer. Reach out about development work, collaborations, or software for service businesses.",
	keywords: ["Contact", "Byron Wade", "Hire Developer", "Full Stack Developer", "Web Development"],
	image: generateOGImageUrl({
		title: "Contact",
		description: "Get in touch with Byron Wade",
		type: "website",
	}),
	canonical: `${siteUrl}/contact`,
	type: "website",
});

export default function ContactPage() {
	return (
		<Suspense fallback={null}>
			<ContactClient />
		</Suspense>
	);
}
