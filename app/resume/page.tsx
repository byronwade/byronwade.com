"use client";

import { analytics } from "@/lib/analytics";
import { customFont } from "@/lib/fonts";
import { ArrowLeft, Check, Download, ExternalLink, Mail, MapPin } from "lucide-react";
import Image from "next/image";
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
	jobTitle: "Founder & Full Stack Developer",
	description:
		"Founder at Thorbis, building field management software for service professionals. 8+ years experience scaling businesses from startup to multi-million dollar operations.",
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
		role: "Founder & CEO",
		company: "Thorbis",
		companyUrl: "https://thorbis.com",
		location: "Jasper, GA",
		period: "Jun 2025 — Present",
		description:
			"Building a field management system for service professionals. Combining real-world experience running a plumbing company with modern web technologies to solve problems I encountered firsthand.",
		current: true,
	},
	{
		role: "Service Plumber",
		company: "ServiceWise Electric & Plumbing",
		location: "Georgia",
		period: "Apr 2025 — Nov 2025",
		description:
			"Provided residential and commercial plumbing services with focus on customer satisfaction, diagnostic expertise, and efficient problem resolution.",
	},
	{
		role: "General Manager",
		company: "Lanier Plumbing Services, LLC",
		location: "Alpharetta, GA",
		period: "Sep 2024 — Apr 2025",
		description:
			"Led operations for a growing commercial plumbing contractor with focus on estimation accuracy, service department development, and operational efficiency.",
	},
	{
		role: "Chief Executive Officer",
		company: "Wade's Plumbing & Septic",
		companyUrl: "https://wadesplumbingandseptic.com",
		location: "Los Gatos, CA",
		period: "2021 — 2024",
		description:
			"Built and managed a multi-million dollar plumbing and septic service company. Scaled company from startup to $2.4M annual revenue in second year of business.",
		highlight: "$2.4M",
	},
	{
		role: "Foreman Plumber & Project Manager",
		company: "Garrison Septic & Plumbing",
		location: "Scotts Valley, CA",
		period: "2016 — 2021",
		description:
			"Dual role managing field operations and project oversight for residential and commercial plumbing and septic installations.",
	},
];

const skills = [
	"Business Management",
	"Project Management",
	"Team Leadership",
	"Plumbing Systems",
	"Web Development",
	"Next.js",
	"React",
	"TypeScript",
];

const certifications = [
	{ name: "Georgia Plumbing License", year: "Pending", pending: true },
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
				<div className="relative flex justify-center py-8 px-4 sm:py-12 md:py-16 lg:py-20 safe-top safe-bottom">
					<div className="flex flex-col gap-12 sm:gap-16 md:gap-20 items-center w-full max-w-2xl">
						{/* Header */}
						<header className="animate-in w-full">
							<div className="flex flex-col gap-6 items-start w-full">
								<Link
									href="/"
									className="group flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"
								>
									<ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
									<span>Back</span>
								</Link>

								<div className="flex items-start gap-5">
									<div className="relative shrink-0">
										<div className="rounded-full size-14 sm:size-16 overflow-hidden">
											<Image
												alt="Byron Wade"
												className="object-cover size-full"
												src="/avatar.avif"
												width={64}
												height={64}
												priority
											/>
										</div>
									</div>
									<div className="flex flex-col gap-1 pt-1">
										<h1
											className={`${customFont.className} text-2xl sm:text-3xl font-medium text-[var(--foreground)]`}
										>
											Byron Wade
										</h1>
										<p className="text-[var(--muted-foreground)]">
											Founder at Thorbis · Full Stack Developer
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-sm text-[var(--muted-foreground)]">
									<button
										type="button"
										onClick={copyEmail}
										className="flex items-center gap-2 hover:text-amber-700 dark:hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none p-0"
									>
										{emailCopied ? (
											<Check className="size-4 text-green-600 dark:text-green-500" />
										) : (
											<Mail className="size-4" />
										)}
										<span>{emailCopied ? "Copied!" : email}</span>
									</button>
									<span className="flex items-center gap-2">
										<MapPin className="size-4" />
										Jasper, GA
									</span>
									<a
										href="/api/resume-pdf"
										download="Byron_Wade_Resume.pdf"
										onClick={() => analytics.resumeDownload("pdf")}
										className="flex items-center gap-2 hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"
									>
										<Download className="size-4" />
										<span>Download PDF</span>
									</a>
								</div>
							</div>
						</header>

						{/* Summary */}
						<section className="animate-in animate-delay-1 w-full">
							<div className="flex flex-col gap-4">
								<p className="text-[var(--foreground)] leading-relaxed text-base sm:text-lg">
									Results-driven professional with 8+ years of experience scaling businesses from
									startup to multi-million dollar operations. Currently building{" "}
									<a
										href="https://thorbis.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-amber-700 dark:text-yellow-500 hover:underline underline-offset-2"
									>
										Thorbis
									</a>
									, a field management system for service professionals.
								</p>
								<p className="text-[var(--muted-foreground)] leading-relaxed">
									<span className="text-amber-700 dark:text-yellow-500">Open to opportunities</span>{" "}
									— Looking for full-time roles in software development, technical leadership, or
									positions where I can leverage both my development skills and hands-on business
									experience.
								</p>
							</div>
						</section>

						{/* Experience */}
						<section className="animate-in animate-delay-2 w-full">
							<h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-8">
								Experience
							</h2>
							<div className="flex flex-col gap-10">
								{workExperience.map((job) => (
									<article key={`${job.company}-${job.role}`} className="flex flex-col gap-2">
										<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
											<h3 className="font-medium text-[var(--foreground)]">
												{job.role}
												{job.current && (
													<span className="ml-2 text-xs font-normal text-amber-700 dark:text-yellow-500">
														Current
													</span>
												)}
											</h3>
											<span className="text-sm text-[var(--muted-foreground)] shrink-0 tabular-nums">
												{job.period}
											</span>
										</div>
										<p className="text-sm text-[var(--muted-foreground)]">
											{job.companyUrl ? (
												<a
													href={job.companyUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 hover:text-amber-700 dark:hover:text-yellow-500 transition-colors underline decoration-[var(--muted-foreground)]/30 underline-offset-2 hover:decoration-amber-700 dark:hover:decoration-yellow-500"
												>
													{job.company}
													<ExternalLink className="size-3" />
												</a>
											) : (
												job.company
											)}
											{" · "}
											{job.location}
										</p>
										<p className="text-[var(--muted-foreground)] mt-2 leading-relaxed">
											{job.highlight
												? job.description.split(job.highlight).map((part, i, arr) =>
														i < arr.length - 1 ? (
															<span key={`${job.company}-part-${i}`}>
																{part}
																<span className="text-green-600 dark:text-green-500 font-medium">
																	{job.highlight}
																</span>
															</span>
														) : (
															<span key={`${job.company}-part-${i}`}>{part}</span>
														)
													)
												: job.description}
										</p>
									</article>
								))}
							</div>
						</section>

						{/* Skills */}
						<section className="animate-in animate-delay-3 w-full">
							<h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
								Skills
							</h2>
							<p className="text-[var(--foreground)] leading-relaxed">{skills.join(" · ")}</p>
						</section>

						{/* Certifications */}
						<section className="animate-in animate-delay-4 w-full">
							<h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
								Licenses & Certifications
							</h2>
							<div className="flex flex-col gap-3">
								{certifications.map((cert) => (
									<div
										key={`${cert.name}-${cert.year}`}
										className="flex items-center justify-between gap-4"
									>
										<span className="text-[var(--foreground)]">{cert.name}</span>
										<span
											className={`text-sm shrink-0 tabular-nums ${cert.pending ? "text-amber-700 dark:text-yellow-500" : "text-[var(--muted-foreground)]"}`}
										>
											{cert.year}
										</span>
									</div>
								))}
							</div>
						</section>

						{/* Footer */}
						<footer className="animate-in animate-delay-5 w-full pt-4">
							<div className="flex items-center justify-between">
								<Link
									href="/"
									className="text-sm text-[var(--muted-foreground)] hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"
								>
									← Back to home
								</Link>
								<span className="text-sm text-[var(--muted-foreground)]">byronwade.com</span>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</>
	);
}
