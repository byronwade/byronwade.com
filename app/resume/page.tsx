import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Person, WithContext } from "schema-dts";
import { IndexList, IndexRow } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { getContactForStructuredData } from "@/lib/contact";
import { ArrowRight, ExternalLink, MapPin } from "@/lib/icons";
import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { CopyEmailButton, DownloadResumeButton, PrintInLightTheme } from "./resume-actions";

// Rendered on the server so the record is in the HTML itself; only the email
// line and the download button hydrate. Print rules live here (print:*), so
// browser printing and /api/resume-pdf produce the same document.

export const metadata: Metadata = generateSEOMetadata({
	title: "Resume",
	// Restates the page rather than embellishing it: one company reached $2.4M
	// and then closed, and the summary below says so.
	description:
		"Byron Wade's resume: about eight years running plumbing and septic businesses and building the software they need. Founder of Thorbis, field management software for service professionals.",
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
		"Master Plumber",
		"Georgia Master Plumber",
	],
	image: generateOGImageUrl({
		title: "Resume - Byron Wade",
		description: "Professional resume and experience",
		type: "website",
	}),
	canonical: `${siteUrl}/resume`,
	type: "website",
});

const jsonLdData: WithContext<Person> = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Byron Wade",
	...getContactForStructuredData(),
	url: siteUrl,
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
	return (
		<>
			<JsonLd data={jsonLdData} />
			<PrintInLightTheme />

			<SiteShell className="print:max-w-none print:p-0" profile="evidence">
				<div className="flex w-full flex-col gap-12 sm:gap-16 print:gap-6">
					<header className="w-full">
						<div className="flex w-full flex-col gap-6 print:gap-3">
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
									<h1 className="font-medium font-signature text-foreground text-heading-32">
										Byron Wade
									</h1>
									<p className="text-body text-copy-16">
										Founder at Thorbis · Full Stack Developer
									</p>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-copy-14 text-muted-foreground">
								<CopyEmailButton />
								<span className="flex items-center gap-2">
									<MapPin className="size-4" aria-hidden="true" />
									Jasper, GA
								</span>
							</div>
						</div>
					</header>

					{/* Summary */}
					<section className="w-full">
						<div className="flex flex-col gap-4">
							<p className="text-pretty text-copy-16 text-foreground leading-relaxed">
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
									<span className="sr-only"> (opens in a new tab)</span>
								</a>
								, a field management system for service professionals.
							</p>
							<p className="text-body text-copy-16 leading-relaxed">
								<span className="font-medium text-foreground">Open to opportunities.</span> I am
								looking for full time work in software development or technical leadership, or
								anywhere that both the engineering side and the running-a-business side are useful.
							</p>
							<div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
								<Button
									render={
										<Link href="/contact">
											Start a conversation
											<ArrowRight className="size-3.5" aria-hidden="true" />
										</Link>
									}
								/>
								<DownloadResumeButton />
							</div>
						</div>
					</section>

					{/* Experience */}
					<section className="w-full">
						<h2 className="mb-6 font-heading font-medium text-foreground text-heading-20 tracking-tight print:mb-3">
							Experience
						</h2>
						{/* The site's chronology grammar: the period leads in a tabular column,
						    the record sits beside it. Paper keeps the same two columns. */}
						<div className="flex flex-col gap-8 print:gap-4">
							{workExperience.map((job) => (
								<article
									key={`${job.company}-${job.role}`}
									className="flex flex-col gap-x-6 gap-y-1 sm:flex-row print:break-inside-avoid"
								>
									<p className="text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:pt-1">
										{job.period}
									</p>
									<div className="flex min-w-0 flex-1 flex-col gap-1 print:gap-0.5">
										<h3 className="flex flex-wrap items-center gap-2 font-medium text-copy-16 text-foreground">
											{job.role}
											{job.current && <StatusPill tone="success">Current</StatusPill>}
										</h3>
										<p className="flex min-h-11 flex-wrap items-center gap-x-1.5 text-copy-14 text-muted-foreground print:min-h-0">
											{job.companyUrl ? (
												<a
													href={job.companyUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="link-underline inline-flex min-h-11 items-center gap-1 font-medium print:min-h-0"
												>
													{job.company}
													<ExternalLink className="size-3 print:hidden" aria-hidden="true" />
													<span className="sr-only"> (opens in a new tab)</span>
													{/* Paper has no links, so print where it goes. */}
													<span className="hidden font-normal print:inline">
														({new URL(job.companyUrl).host})
													</span>
												</a>
											) : (
												job.company
											)}
											<span aria-hidden="true">·</span>
											{job.location}
										</p>
										<p className="text-body text-copy-14 leading-relaxed">
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
									</div>
								</article>
							))}
						</div>
					</section>

					{/* Skills */}
					<section className="w-full">
						<h2 className="mb-4 font-heading font-medium text-foreground text-heading-20 tracking-tight print:mb-2">
							Skills
						</h2>
						{/* Not pills. These are read, not pressed. §5.4 makes a pill a
						    semantic shape, and giving forty static strings the shape of a
						    control made the section look like a filter bar. */}
						<ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-body text-copy-14">
							{skills.map((skill) => (
								<li key={skill}>{skill}</li>
							))}
						</ul>
					</section>

					{/* Certifications */}
					<section className="w-full">
						<h2 className="mb-4 font-heading font-medium text-foreground text-heading-20 tracking-tight print:mb-2">
							Licenses and certifications
						</h2>
						{/* The site's index grammar: rows separated by space, not rules or a
						    card (Thorbis D-017). `pending` is stated in words rather than tinted,
						    so it survives print and colour blindness. */}
						<IndexList>
							{certifications.map((cert) => (
								<IndexRow key={`${cert.name}-${cert.year}`}>
									<div className="flex items-baseline justify-between gap-4 py-2 print:py-0.5">
										<span className="text-copy-14 text-foreground">{cert.name}</span>
										<span className="shrink-0 text-copy-12 text-muted-foreground tabular-nums">
											{cert.year}
											{cert.pending && " · in progress"}
										</span>
									</div>
								</IndexRow>
							))}
						</IndexList>
					</section>

					<section className="w-full print:hidden">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex flex-col gap-1">
								<h2 className="font-heading font-medium text-heading-20 tracking-tight">
									Interested in working together?
								</h2>
								<p className="text-body text-copy-14">
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
