"use client";

import { Check, Download, ExternalLink, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Person, WithContext } from "schema-dts";
import { SiteShell } from "@/components/layout/site-shell";
import { pillLinkClass } from "@/components/ui/pill";
import { StatusPill } from "@/components/ui/status-pill";
import { analytics } from "@/lib/analytics";

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
		{ "@type": "Organization", name: "Grassroots Plumbing" },
		{ "@type": "Organization", name: "Thorbis LLC" },
		{ "@type": "Organization", name: "ServiceWise Electric & Plumbing" },
		{ "@type": "Organization", name: "Lanier Plumbing Services, LLC" },
		{ "@type": "Organization", name: "Wade's Plumbing & Septic" },
		{ "@type": "Organization", name: "Garrison Septic & Plumbing" },
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
	hasCredential: {
		"@type": "EducationalOccupationalCredential",
		credentialCategory: "license",
		name: "Master Plumber License",
		recognizedBy: { "@type": "GovernmentOrganization", name: "State of Georgia" },
	},
};

const workExperience = [
	{
		role: "Service Plumber",
		company: "Grassroots Plumbing",
		location: "Woodstock, GA",
		period: "Dec 2025 - Present",
		description:
			"Residential and commercial service plumbing: diagnostics, repairs, and installations, with an emphasis on getting it right the first visit.",
		current: true,
	},
	{
		role: "Founder & CEO",
		company: "Thorbis",
		companyUrl: "https://thorbis.com",
		location: "Jasper, GA",
		period: "Jun 2025 - Present",
		description:
			"Building a field management system for service professionals. Combining real-world experience running a plumbing company with modern web technologies to solve problems I encountered firsthand.",
		current: true,
	},
	{
		role: "Service Plumber",
		company: "ServiceWise Electric & Plumbing",
		location: "Holly Springs, GA",
		period: "Apr 2025 - Nov 2025",
		description:
			"Provided residential and commercial plumbing services with focus on customer satisfaction, diagnostic expertise, and efficient problem resolution.",
	},
	{
		role: "General Manager",
		company: "Lanier Plumbing Services, LLC",
		location: "Alpharetta, GA",
		period: "Sep 2024 - Apr 2025",
		description:
			"Led operations for a growing commercial plumbing contractor with focus on estimation accuracy, service department development, and operational efficiency.",
	},
	{
		role: "Chief Executive Officer",
		company: "Wade's Plumbing & Septic",
		companyUrl: "https://wadesplumbingandseptic.com",
		location: "Los Gatos, CA",
		period: "2021 - 2024",
		description:
			"Built and managed a multi-million dollar plumbing and septic service company. Scaled company from startup to $2.4M annual revenue in second year of business.",
		highlight: "$2.4M",
	},
	{
		role: "Foreman Plumber & Project Manager",
		company: "Garrison Septic & Plumbing",
		location: "Scotts Valley, CA",
		period: "2016 - 2021",
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

const certifications: { name: string; year: string; pending?: boolean }[] = [
	{ name: "Master Plumber License (GA)", year: "2026" },
	{ name: "C-36 Plumbing License (CA)", year: "2021" },
	{ name: "C-42 Sanitation License (CA)", year: "2021" },
	{ name: "Septic System Installer (Santa Cruz County)", year: "2021" },
	{ name: "Septic System Installer (Santa Clara County)", year: "2021" },
	{ name: "Project Management", year: "2019" },
];

/** Small caps label with a hairline running to the right margin. */
function SectionHeading({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-8 flex items-center gap-4">
			<h2 className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
				{children}
			</h2>
			<span aria-hidden="true" className="h-px flex-1 bg-border" />
		</div>
	);
}

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

			<SiteShell>
				<div className="flex w-full flex-col gap-12 sm:gap-16">
					<header className="reveal flex w-full flex-col gap-7">
						<div className="flex items-center gap-5">
							<div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-[4.5rem]">
								<Image
									alt="Byron Wade"
									className="size-full object-cover"
									src="/avatar.avif"
									width={72}
									height={72}
									priority
								/>
							</div>
							<div className="flex min-w-0 flex-col gap-1.5">
								<h1 className="font-heading text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
									Byron Wade
								</h1>
								<p className="text-muted-foreground">Founder at Thorbis · Full Stack Developer</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button type="button" onClick={copyEmail} className={pillLinkClass}>
								{emailCopied ? (
									<Check className="size-4 text-brand" />
								) : (
									<Mail className="size-4" />
								)}
								{emailCopied ? "Copied!" : email}
							</button>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground">
								<MapPin className="size-4" />
								Jasper, GA
							</span>
							{/* The one filled control on the page, and the only thing the PDF
							    render has no use for. */}
							<a
								href="/api/resume-pdf"
								download="Byron_Wade_Resume.pdf"
								onClick={() => analytics.resumeDownload("pdf")}
								className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 print:hidden"
							>
								<Download className="size-4" />
								Download PDF
							</a>
						</div>
					</header>

					{/* Summary */}
					<section className="reveal reveal-delay-1 w-full">
						<div className="flex flex-col gap-4">
							<p className="text-base leading-relaxed text-foreground sm:text-lg">
								Results-driven professional with 8+ years of experience scaling businesses from
								startup to multi-million dollar operations. Currently building{" "}
								<a
									href="https://thorbis.com"
									target="_blank"
									rel="noopener noreferrer"
									className="link-underline font-medium"
								>
									Thorbis
								</a>
								, a field management system for service professionals.
							</p>
							<p className="leading-relaxed text-muted-foreground">
								<span className="font-medium text-brand">Open to opportunities</span>. Looking for
								full-time roles in software development, technical leadership, or positions where I
								can leverage both my development skills and hands-on business experience.
							</p>
						</div>
					</section>

					{/* Experience is a rail timeline: one continuous thread, a node per role,
					    lit at the roles that are still running. */}
					<section className="reveal reveal-delay-2 w-full">
						<SectionHeading>Experience</SectionHeading>
						<ol className="flex flex-col">
							{workExperience.map((job, i) => {
								const last = i === workExperience.length - 1;
								return (
									// The gap between entries lives on the <article>, not the <li>. The
									// rail is a flex sibling and only stretches to the row's content box,
									// so padding on the <li> would leave the thread short of the next node.
									<li key={`${job.company}-${job.role}`} className="relative flex gap-5">
										<div className="relative flex w-2.5 shrink-0 justify-center">
											<span
												aria-hidden="true"
												className={`absolute top-[0.45rem] size-2.5 rounded-full ring-4 ring-background ${
													job.current ? "bg-brand" : "bg-border"
												}`}
											/>
											{job.current && (
												<span
													aria-hidden="true"
													className="absolute top-[0.45rem] size-2.5 animate-ping rounded-full bg-brand opacity-50"
												/>
											)}
											{!last && (
												<span
													aria-hidden="true"
													className="absolute top-5 bottom-0 w-px bg-border"
												/>
											)}
										</div>

										<article className={`min-w-0 flex-1 ${last ? "" : "pb-10"}`}>
											<div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
												<h3 className="font-medium text-foreground">
													{job.role}
													{job.current && (
														<StatusPill tone="success" className="ml-2 align-middle">
															Current
														</StatusPill>
													)}
												</h3>
												<span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
													{job.period}
												</span>
											</div>
											<p className="mt-1 text-sm text-muted-foreground">
												{job.companyUrl ? (
													<a
														href={job.companyUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="link-underline inline-flex items-center gap-1 font-medium"
													>
														{job.company}
														<ExternalLink className="size-3" />
													</a>
												) : (
													<span className="font-medium text-foreground/80">{job.company}</span>
												)}
												{" · "}
												{job.location}
											</p>
											<p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
												{(() => {
													if (!job.highlight || !job.description.includes(job.highlight)) {
														return job.description;
													}
													const idx = job.description.indexOf(job.highlight);
													return (
														<>
															{job.description.slice(0, idx)}
															<span className="font-medium text-brand">{job.highlight}</span>
															{job.description.slice(idx + job.highlight.length)}
														</>
													);
												})()}
											</p>
										</article>
									</li>
								);
							})}
						</ol>
					</section>

					{/* Skills */}
					<section className="reveal reveal-delay-3 w-full">
						<SectionHeading>Skills</SectionHeading>
						<ul className="flex flex-wrap gap-2">
							{skills.map((skill) => (
								<li
									key={skill}
									className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground"
								>
									{skill}
								</li>
							))}
						</ul>
					</section>

					{/* Licenses: hairline rows, no card. It should read like a document. */}
					<section className="reveal reveal-delay-4 w-full">
						<SectionHeading>Licenses &amp; Certifications</SectionHeading>
						<ul className="flex flex-col">
							{certifications.map((cert) => (
								<li
									key={`${cert.name}-${cert.year}`}
									className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0"
								>
									<span className="text-[15px] text-foreground">{cert.name}</span>
									<span
										className={`shrink-0 font-mono text-xs tabular-nums ${cert.pending ? "text-brand" : "text-muted-foreground"}`}
									>
										{cert.year}
									</span>
								</li>
							))}
						</ul>
					</section>
				</div>
			</SiteShell>
		</>
	);
}
