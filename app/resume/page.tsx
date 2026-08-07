"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Person, WithContext } from "schema-dts";
import { IndexList, IndexRow } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { useRevealedEmail } from "@/hooks/use-revealed-email";
import { analytics } from "@/lib/analytics";
import { ArrowRight, Check, Download, ExternalLink, Mail, MapPin } from "@/lib/icons";

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
		"Founder at Thorbis, building field management software for service professionals. About eight years running service businesses and writing the software they need.",
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
	hasCredential: {
		"@type": "EducationalOccupationalCredential",
		credentialCategory: "license",
		name: "Master Plumber License",
		recognizedBy: { "@type": "GovernmentOrganization", name: "State of Georgia" },
	},
};

const workExperience = [
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
		location: "Georgia",
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
		// The homepage now states plainly that this company closed, so the resume
		// says so too. §9 keeps claims qualified, and a résumé that reports the
		// revenue without the ending contradicts the opening of the site.
		description:
			"Built and ran a plumbing and septic service company. Scaled it from startup to $2.4M in annual revenue in the second year. The company did not survive that growth and closed in 2024. The operational problems behind that are what I built Thorbis to fix.",
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
	{ name: "C-36 Plumbing License (CA)", year: "2018" },
	{ name: "C-42 Sanitation License (CA)", year: "2020" },
	{ name: "Septic System Installer (Santa Cruz County)", year: "2016" },
	{ name: "Septic System Installer (Santa Clara County)", year: "2017" },
	{ name: "Project Management", year: "2019" },
];

export default function ResumePage() {
	const [emailCopied, setEmailCopied] = useState(false);
	const email = useRevealedEmail();

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
			<JsonLd data={jsonLdData} />

			<SiteShell>
				<div className="flex w-full flex-col gap-12 sm:gap-16">
					<header className="reveal w-full">
						<div className="flex w-full flex-col gap-6">
							<div className="flex items-start gap-5">
								<div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-16">
									<Image
										alt="Byron Wade"
										className="size-full object-cover"
										src="/avatar.avif"
										width={64}
										height={64}
										priority
									/>
								</div>
								<div className="flex flex-col gap-1 pt-1">
									<h1 className="font-medium font-signature text-2xl text-foreground sm:text-3xl">
										Byron Wade
									</h1>
									<p className="text-muted-foreground">Founder at Thorbis · Full Stack Developer</p>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground text-sm">
								<button
									type="button"
									onClick={copyEmail}
									className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 transition-colors hover:text-brand"
								>
									{emailCopied ? (
										<Check className="size-4 text-brand" />
									) : (
										<Mail className="size-4" />
									)}
									<span>{emailCopied ? "Copied!" : email}</span>
								</button>
								<span className="flex items-center gap-2">
									<MapPin className="size-4" />
									Jasper, GA
								</span>
							</div>
						</div>
					</header>

					{/* Summary */}
					<section className="reveal reveal-delay-1 w-full">
						<div className="flex flex-col gap-4">
							<p className="text-base text-foreground leading-relaxed sm:text-lg">
								I have spent about eight years running service businesses and building the software
								they need. I grew a plumbing company from nothing to $2.4M and then lost it, and
								that is where most of what I know about this work came from. Right now I am building{" "}
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
							<p className="text-muted-foreground leading-relaxed">
								<span className="font-medium text-foreground">Open to opportunities.</span> I am
								looking for full time work in software development or technical leadership, or
								anywhere that both the engineering side and the running-a-business side are useful.
							</p>
							<div className="flex flex-wrap items-center gap-2 pt-1">
								<Button
									size="sm"
									render={
										<Link href="/contact">
											Start a conversation
											<ArrowRight className="size-3.5" aria-hidden="true" />
										</Link>
									}
								/>
								<Button
									size="sm"
									variant="outline"
									render={
										<a
											href="/api/resume-pdf"
											download="Byron_Wade_Resume.pdf"
											onClick={() => analytics.resumeDownload("pdf")}
										>
											<Download className="size-3.5" aria-hidden="true" />
											Download PDF
										</a>
									}
								/>
							</div>
						</div>
					</section>

					{/* Experience */}
					<section className="reveal reveal-delay-2 w-full">
						<h2 className="mb-8 font-heading font-semibold text-foreground text-xl tracking-tight">
							Experience
						</h2>
						<div className="flex flex-col gap-10">
							{workExperience.map((job) => (
								<article key={`${job.company}-${job.role}`} className="flex flex-col gap-2">
									<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
										<h3 className="font-medium text-foreground">
											{job.role}
											{job.current && (
												<StatusPill tone="success" pulse className="ml-2 align-middle">
													Current
												</StatusPill>
											)}
										</h3>
										<span className="shrink-0 text-muted-foreground text-sm tabular-nums">
											{job.period}
										</span>
									</div>
									<p className="text-muted-foreground text-sm">
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
											job.company
										)}
										{" · "}
										{job.location}
									</p>
									<p className="mt-2 text-muted-foreground leading-relaxed">
										{(() => {
											if (!(job.highlight && job.description.includes(job.highlight))) {
												return job.description;
											}
											const idx = job.description.indexOf(job.highlight);
											return (
												<>
													{job.description.slice(0, idx)}
													<span className="font-medium text-foreground">{job.highlight}</span>
													{job.description.slice(idx + job.highlight.length)}
												</>
											);
										})()}
									</p>
								</article>
							))}
						</div>
					</section>

					{/* Skills */}
					<section className="reveal reveal-delay-3 w-full">
						<h2 className="mb-6 font-heading font-semibold text-foreground text-xl tracking-tight">
							Skills
						</h2>
						{/* Not pills. These are read, not pressed. §5.4 makes a pill a
						    semantic shape, and giving forty static strings the shape of a
						    control made the section look like a filter bar. */}
						<ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-muted-foreground">
							{skills.map((skill) => (
								<li className="text-sm" key={skill}>
									{skill}
								</li>
							))}
						</ul>
					</section>

					{/* Certifications */}
					<section className="reveal reveal-delay-4 w-full">
						<h2 className="mb-6 font-heading font-semibold text-foreground text-xl tracking-tight">
							Licenses and certifications
						</h2>
						{/* Hairlines, not a bordered card. §13 rejects both the card wrapper
						    and a border around every row; the site already has one index
						    grammar and this is a list like any other. `pending` is stated in
						    words rather than tinted, so it survives print and colour blindness. */}
						<IndexList>
							{certifications.map((cert) => (
								<IndexRow key={`${cert.name}-${cert.year}`}>
									<div className="flex items-center justify-between gap-4 py-3">
										<span className="text-foreground">{cert.name}</span>
										<span className="shrink-0 text-muted-foreground text-sm tabular-nums">
											{cert.year}
											{cert.pending && " · in progress"}
										</span>
									</div>
								</IndexRow>
							))}
						</IndexList>
					</section>

					<section className="reveal reveal-delay-5 w-full border-border border-t pt-10">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex flex-col gap-1">
								<h2 className="font-heading font-semibold text-lg tracking-tight">
									Interested in working together?
								</h2>
								<p className="text-muted-foreground text-sm">
									Tell me what you’re building. Product roles, service software, or just an intro.
								</p>
							</div>
							<Button
								render={
									<Link href="/contact">
										Contact Byron
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								}
							/>
						</div>
					</section>
				</div>
			</SiteShell>
		</>
	);
}
