"use client";

import { analytics } from "@/lib/analytics";
import { customFont } from "@/lib/fonts";
import { ArrowLeft, Check, Download, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Person, WithContext } from "schema-dts";

// Server-side obfuscated contact info for structured data
const obfuscatedContact = {
	email: `contact${String.fromCharCode(64)}byronwade.com`,
	telephone: "+1-8xx-xxx-xxxx",
};

const jsonLdData: WithContext<Person> = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Byron Wade",
	email: obfuscatedContact.email,
	telephone: obfuscatedContact.telephone,
	url: "https://byronwade.com",
	jobTitle: "General Manager & Technology Professional",
	description:
		"Experienced professional with 8+ years in plumbing operations, business management, and web development. Proven track record of scaling businesses and managing multi-million dollar operations.",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Jasper",
		addressRegion: "GA",
		addressCountry: "US",
	},
	worksFor: [
		{ "@type": "Organization", name: "Lanier Plumbing Services, LLC" },
		{ "@type": "Organization", name: "Wade's Plumbing & Septic" },
		{ "@type": "Organization", name: "Garrison Septic & Plumbing" },
		{ "@type": "Organization", name: "Thorbis LLC" },
	],
	alumniOf: [
		{ "@type": "EducationalOrganization", name: "San Lorenzo Valley High School" },
		{ "@type": "EducationalOrganization", name: "Cherokee High School" },
	],
	knowsAbout: [
		"Plumbing",
		"Septic Systems",
		"Construction Project Management",
		"Project Estimation",
		"Business Development",
		"Web Development",
		"AI Development",
		"SEO",
		"Operations Management",
		"Team Leadership",
	],
};

const workExperience = [
	{
		role: "Service Plumber",
		company: "ServiceWise Electric & Plumbing",
		location: "Georgia",
		period: "April 2024 - Present",
		description:
			"Providing comprehensive residential and commercial plumbing services with focus on customer satisfaction, diagnostic expertise, and efficient problem resolution.",
	},
	{
		role: "General Manager",
		company: "Lanier Plumbing Services, LLC",
		location: "Alpharetta, GA",
		period: "September 2023 - March 2024",
		description:
			"Led operations for a growing commercial plumbing contractor with focus on estimation accuracy, service department development, and operational efficiency.",
	},
	{
		role: "Chief Executive Officer",
		company: "Wade's Plumbing & Septic",
		location: "Los Gatos, CA",
		period: "October 2021 - August 2024",
		description:
			"Built and managed a multi-million dollar plumbing and septic service company. Scaled company from startup to $2.4M annual revenue in second year of business.",
	},
	{
		role: "Foreman Plumber & Project Manager",
		company: "Garrison Septic & Plumbing",
		location: "Scotts Valley, CA",
		period: "January 2016 - October 2021",
		description:
			"Dual role managing field operations and project oversight for residential and commercial plumbing and septic installations.",
	},
	{
		role: "Founder & CTO",
		company: "Thorbis LLC",
		location: "Scotts Valley, CA",
		period: "April 2012 - January 2017",
		description:
			"Founded and led technology startup focused on innovative web hosting solutions with proprietary auto-scaling algorithms.",
	},
];

const skills = [
	"Business Management",
	"Project Management",
	"Team Leadership",
	"Plumbing Systems",
	"Web Development",
	"Strategic Planning",
	"Operations Management",
	"Next.js",
	"React",
	"TypeScript",
	"Python",
];

const certifications = [
	{ name: "C-36 Plumbing License (CA)", year: "2018" },
	{ name: "C-42 Sanitation License (CA)", year: "2020" },
	{ name: "Septic System Installer (Santa Cruz County)", year: "2016" },
	{ name: "Septic System Installer (Santa Clara County)", year: "2017" },
	{ name: "Project Management", year: "2019" },
];

export default function ResumePage() {
	const [emailCopied, setEmailCopied] = useState(false);
	const email = "byron@byronwade.com";

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setEmailCopied(true);
			setTimeout(() => setEmailCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy email:", err);
		}
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
				id="person-jsonld"
			/>
			<div className="relative min-h-screen w-full bg-[var(--background)]">
				{/* Subtle background gradient */}
				<div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10 pointer-events-none" />

				{/* Main content */}
				<div className="relative flex justify-center py-12 px-4 sm:py-16 md:py-20 safe-top safe-bottom">
					<div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-center w-full max-w-2xl">
						{/* Header */}
						<div className="w-full">
							<div className="flex flex-col gap-4 items-start w-full">
								<Link
									href="/"
									className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4 resume-navigation"
								>
									<ArrowLeft className="size-4" />
									<span>Back to home</span>
								</Link>

								<div className="flex flex-col gap-2 w-full">
									<h1
										className={`${customFont.className} text-3xl sm:text-4xl font-medium leading-tight text-[var(--foreground)]`}
									>
										Byron Wade
									</h1>
									<p className="text-lg text-[var(--muted-foreground)]">
										General Manager & Technology Professional
									</p>
								</div>

								{/* Contact & Download */}
								<div className="flex flex-wrap gap-3 sm:gap-4 items-center mt-4 resume-actions">
									<button
										type="button"
										onClick={copyEmail}
										className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none p-2 sm:p-0 resume-action-button touch-target"
										aria-label="Copy email to clipboard"
									>
										{emailCopied ? (
											<Check className="size-4 text-yellow-600 dark:text-yellow-500" />
										) : (
											<Mail className="size-4" />
										)}
										<span className="mobile-text">{emailCopied ? "Copied!" : email}</span>
									</button>
									<div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
										<MapPin className="size-4" />
										<span>Jasper, GA</span>
									</div>
									<a
										href="/api/resume-pdf"
										download="Byron_Wade_Resume.pdf"
										onClick={() => analytics.resumeDownload("pdf")}
										className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors resume-action-button touch-target p-2 sm:p-0"
									>
										<Download className="size-4" />
										<span>Download PDF</span>
									</a>
								</div>
							</div>
						</div>

						{/* Summary */}
						<div className="w-full">
							<p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)] mobile-text">
								Results-driven professional with 8+ years of experience scaling businesses from
								startup to multi-million dollar operations. Expertise in plumbing operations, team
								leadership, and innovative technology solutions.
							</p>
						</div>

						{/* Work Experience */}
						<div className="w-full">
							<h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 sm:mb-8 tracking-tight">
								Experience
							</h2>
							<div className="flex flex-col gap-8 sm:gap-10">
								{workExperience.map((job) => (
									<div key={`${job.company}-${job.role}`} className="flex flex-col gap-2">
										<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
											<div className="flex-1">
												<h3 className="font-semibold text-[var(--foreground)] text-base sm:text-lg mobile-text tracking-tight">
													{job.role}
												</h3>
												<p className="text-sm text-[var(--muted-foreground)] mobile-text mt-0.5">
													{job.company} · {job.location}
												</p>
											</div>
											<p className="text-sm text-[var(--muted-foreground)] whitespace-nowrap">
												{job.period}
											</p>
										</div>
										<p className="text-sm text-[var(--muted-foreground)] leading-relaxed mobile-text mt-1">
											{job.description.split("$2.4M").map((part, i, arr) =>
												i < arr.length - 1 ? (
													<span key={`${part}-${i}`}>
														{part}
														<span className="text-green-600 dark:text-green-500 font-semibold">
															$2.4M
														</span>
													</span>
												) : (
													<span key={`${part}-${i}`}>{part}</span>
												)
											)}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Skills */}
						<div className="w-full">
							<h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 sm:mb-8 tracking-tight">
								Skills
							</h2>
							<div className="flex flex-wrap gap-2">
								{skills.map((skill) => (
									<span
										key={skill}
										className="px-3 py-1.5 text-sm bg-[var(--muted)] rounded-md text-[var(--foreground)] border border-[var(--border)]"
									>
										{skill}
									</span>
								))}
							</div>
						</div>

						{/* Certifications */}
						<div className="w-full">
							<h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 sm:mb-8 tracking-tight">
								Certifications & Licenses
							</h2>
							<div className="flex flex-col gap-3">
								{certifications.map((cert) => (
									<div
										key={`${cert.name}-${cert.year}`}
										className="flex items-center justify-between gap-4 py-1"
									>
										<span className="text-sm text-[var(--foreground)] mobile-text flex-1">
											{cert.name}
										</span>
										<span className="text-sm text-[var(--muted-foreground)] whitespace-nowrap">
											{cert.year}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Footer */}
						<div className="w-full pt-8">
							<div className="flex flex-col gap-4 items-center justify-center">
								<Link
									href="/"
									className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors resume-navigation"
								>
									← Back to home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
