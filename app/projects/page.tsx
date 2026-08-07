import { Suspense } from "react";
import { JsonLd } from "@/components/common/json-ld";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsIndex } from "@/components/project";
import { getProjects, type Project } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export async function generateMetadata() {
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
		canonical: `${siteUrl}/projects`,
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
		if (aLead !== bLead) {
			return aLead ? -1 : 1;
		}
		if (aLead && bLead) {
			const orderA = a.order ?? Number.POSITIVE_INFINITY;
			const orderB = b.order ?? Number.POSITIVE_INFINITY;
			if (orderA !== orderB) {
				return orderA - orderB;
			}
		}
		return timeOf(b.date) - timeOf(a.date);
	});
}

async function ProjectsList() {
	const projects = await getProjects();
	const sorted = sortForIndex(projects);

	if (sorted.length === 0) {
		return (
			<p className="text-muted-foreground text-sm leading-relaxed">
				No projects yet. Check back soon.
			</p>
		);
	}

	return <ProjectsIndex projects={sorted} />;
}

/** Mirrors the real row's height and rules so the swap does not shift layout. */
function IndexFallback() {
	return (
		<div aria-busy="true" className="flex animate-pulse flex-col border-border border-t">
			<p className="sr-only" role="status">
				Loading projects…
			</p>
			{["a", "b", "c", "d", "e", "f"].map((id) => (
				<div className="flex items-center gap-4 border-border border-b py-5" key={`skeleton-${id}`}>
					<div className="h-4 w-40 rounded bg-muted" />
					<div className="h-3 w-56 rounded bg-muted/70" />
					<div className="ml-auto h-3 w-10 rounded bg-muted" />
				</div>
			))}
		</div>
	);
}

export default async function ProjectsPage() {
	// Generate structured data
	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Projects", url: `${siteUrl}/projects` },
	]);

	return (
		<>
			{/* Structured Data */}
			<JsonLd data={websiteStructuredData} />
			<JsonLd data={breadcrumbStructuredData} />

			<SiteShell>
				<div className="flex flex-col gap-8 sm:gap-12">
					<PageHeader
						lede="Selected products, client work, and experiments. Case studies carry the outcome where there is one to report."
						title="Projects"
					/>

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
