import { JsonLd } from "@/components/common/json-ld";
import { PageHeader, Section } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsIndex } from "@/components/project/projects-index";
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

	const current = sorted.filter((project) => project.status?.toLowerCase() !== "archived");
	const earlier = sorted.filter((project) => project.status?.toLowerCase() === "archived");

	return (
		<div className="flex flex-col gap-12">
			{current.length > 0 && (
				<Section
					title="Current work"
					description={`${current.length} projects · What I’m working on now. Write-ups grow as the work develops.`}
				>
					<ProjectsIndex projects={current} />
				</Section>
			)}
			{earlier.length > 0 && (
				<Section
					title="Earlier work"
					description={`${earlier.length} projects · Older portfolio entries, kept here with their original write-ups. Archived here does not imply the repository or site is offline.`}
				>
					<ProjectsIndex projects={earlier} />
				</Section>
			)}
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
						lede="What I’m building now, followed by earlier products, client work, and experiments. Every project stays listed."
						title="Projects"
					/>

					<div className="reveal reveal-delay-1 w-full">
						<ProjectsList />
					</div>
				</div>
			</SiteShell>
		</>
	);
}
