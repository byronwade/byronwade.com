import { Metadata } from "next";
// import { Suspense } from "react";
import ContactClient from "./contact-client";

// Temporarily disable ISR to fix streaming issue
// export const revalidate = 43200; // 12 hours

export const metadata: Metadata = {
	title: "Contact | Byron Wade - Expert Digital & Plumbing Solutions",
	description: "Ready to build something amazing? Get in touch for your web development project or plumbing service needs. Free consultations available for both digital and plumbing solutions.",
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
	},
	openGraph: {
		title: "Contact Byron Wade - Digital & Plumbing Expert",
		description: "Get expert help with web development or plumbing services. Free consultations available. Serving Santa Cruz, CA and Jasper, GA for plumbing, worldwide for digital solutions.",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
		type: "website",
	},
};

export default function ContactPage() {
	return <ContactClient />;
}
