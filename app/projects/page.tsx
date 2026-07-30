import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
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

/** Flagships first (by explicit `order`, then recency), then everything else by recency. */
function sortForIndex(projects: Project[]): Project[] {
	return [...projects].sort((a, b) => {
		if (!!a.flagship !== !!b.flagship) return a.flagship ? -1 : 1;
		if (a.flagship && b.flagship) {
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

	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Projects", url: `${baseUrl}/projects` },
	]);

	return (
		<>
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

			<PageHero
				variant="index"
				eyebrow="Index"
				title="Projects"
				description="Client work, products, and hobby projects — real-world problem solving with React, Next.js, and full-stack tools."
			/>

			<SiteShell flush className="pb-[var(--space-section-y)]">
				<div className="reveal w-full">
					<Suspense fallback={<IndexFallback />}>
						<ProjectsList />
					</Suspense>
				</div>
			</SiteShell>
		</>
	);
}
