import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsIndex } from "@/components/project";
import { getProjects, type Project } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";

export async function generateMetadata() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const ogImage = generateOGImageUrl({
		title: "Projects",
		description:
			"Explore my portfolio of web development projects, products, and client work showcasing modern JavaScript, React, and Next.js expertise.",
		type: "project",
	});

	return generateSEOMetadata({
		title: "Projects",
		description:
			"Explore my portfolio of web development projects, products, and client work. Showcasing modern JavaScript, React, Next.js, and full-stack development expertise.",
		keywords: [
			"Projects",
			"Portfolio",
			"Web Development",
			"Case Studies",
			"React Projects",
			"Next.js Projects",
		],
		image: ogImage,
		type: "website",
		canonical: `${baseUrl}/projects`,
	});
}

function timeOf(date?: string): number {
	return date ? new Date(date).getTime() : 0;
}

/** Featured/flagships first (by explicit `order`, then recency), then everything else by recency. */
function sortForIndex(projects: Project[]): Project[] {
	return [...projects].sort((a, b) => {
		const aLead = Boolean(a.flagship || a.featured);
		const bLead = Boolean(b.flagship || b.featured);
		if (aLead !== bLead) return aLead ? -1 : 1;
		if (aLead && bLead) {
			const orderA = a.order ?? Number.POSITIVE_INFINITY;
			const orderB = b.order ?? Number.POSITIVE_INFINITY;
			if (orderA !== orderB) return orderA - orderB;
		}
		return timeOf(b.date) - timeOf(a.date);
	});
}

async function ProjectsList() {
	const projects = await getProjects();
	const sorted = sortForIndex(projects);

	if (sorted.length === 0) {
		return (
			<p className="text-sm leading-relaxed text-muted-foreground">
				No projects yet. Check back soon.
			</p>
		);
	}

	return <ProjectsIndex projects={sorted} />;
}

function IndexFallback() {
	return (
		<div className="flex animate-pulse flex-col">
			<div className="h-8 border-b border-border" />
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
					key={i}
					className="flex items-center gap-4 border-b border-border py-5"
				>
					<div className="h-3 w-6 rounded bg-muted" />
					<div className="h-4 w-32 rounded bg-muted" />
					<div className="ml-auto h-3 w-10 rounded bg-muted" />
				</div>
			))}
		</div>
	);
}

export default async function ProjectsPage() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

	// Generate structured data
	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Projects", url: `${baseUrl}/projects` },
	]);

	return (
		<>
			{/* Structured Data */}
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
			/>

			<SiteShell>
				<div className="flex flex-col gap-8 sm:gap-12">
					<header className="reveal flex w-full flex-col gap-3">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							Projects
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
							Selected products, client work, and experiments — case studies with outcomes where it
							matters, built with React, Next.js, and full-stack tools.
						</p>
					</header>

					<div className="reveal reveal-delay-1 w-full">
						<Suspense fallback={<IndexFallback />}>
							<ProjectsList />
						</Suspense>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
