import Link from "next/link";
import { JsonLd } from "@/components/common/json-ld";
import { PageHeader, Section } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsIndex } from "@/components/project/projects-index";
import { getProjects, isArchivedProject, sortProjectsForIndex } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export async function generateMetadata() {
	return generateSEOMetadata({
		title: "Projects",
		description:
			"Byron Wade's current work, including Thorbis, followed by earlier products, client work, and experiments.",
		keywords: ["Projects", "Portfolio", "Case Studies", "Products", "Client Work", "Experiments"],
		type: "website",
		canonical: `${siteUrl}/projects`,
	});
}

async function ProjectsList() {
	const projects = await getProjects();
	const sorted = sortProjectsForIndex(projects);

	if (sorted.length === 0) {
		return (
			<p className="text-body text-copy-16 leading-relaxed">
				No project write-ups are published yet. Open-source work is listed on the{" "}
				<Link className="link-underline" href="/portfolio" prefetch={false}>
					portfolio
				</Link>{" "}
				in the meantime.
			</p>
		);
	}

	const current = sorted.filter((project) => !isArchivedProject(project));
	const earlier = sorted.filter(isArchivedProject);

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

			<SiteShell profile="showcase">
				<PageHeader
					lede="What I’m building now, followed by earlier products, client work, and experiments. Every project stays listed."
					title="Projects"
				/>
				<ProjectsList />
			</SiteShell>
		</>
	);
}
