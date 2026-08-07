import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllProjectSlugs, getProject } from "@/lib/projects";
import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { ProjectContent } from "./project-content";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getAllProjectSlugs();
	return slugs.map((slug) => ({
		slug,
	}));
}

export async function generateMetadata({
	params,
}: ProjectPageProps): Promise<import("next").Metadata> {
	const { slug } = await params;
	const project = await getProject(slug);

	if (!project) {
		return {};
	}

	const url = `${siteUrl}/projects/${slug}`;
	const ogImage = generateOGImageUrl({
		title: project.title,
		description: project.excerpt || "",
		type: "project",
		date: project.date,
	});

	return generateSEOMetadata({
		title: project.title,
		description:
			project.excerpt ||
			`Explore ${project.title} by Byron Wade. A showcase of modern web development projects, innovative solutions, and creative implementations.`,
		keywords: ["Projects", "Portfolio", "Web Development", project.category || "", "Case Study"],
		image: ogImage,
		type: "project",
		canonical: url,
	});
}

async function ProjectPageContent({ slug }: { slug: string }) {
	const project = await getProject(slug);

	if (!project) {
		notFound();
	}

	return <ProjectContent project={project} />;
}

/**
 * Sits inside the real shell so the loading state and the loaded page share one
 * gutter and one measure. The previous fallback built its own full-screen
 * container with a decorative gradient over it — a second layout, and a
 * decorative gradient §5.1 rejects, shown only while the page was blank.
 */
function ProjectFallback() {
	return (
		<SiteShell width="wide">
			<div aria-busy="true" className="flex w-full animate-pulse flex-col gap-4">
				<p className="sr-only" role="status">
					Loading project…
				</p>
				<div className="h-4 w-24 rounded bg-muted/70" />
				<div className="h-9 w-3/4 max-w-2xl rounded bg-muted" />
				<div className="h-4 w-1/2 max-w-xl rounded bg-muted/70" />
			</div>
		</SiteShell>
	);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;

	return (
		<Suspense fallback={<ProjectFallback />}>
			<ProjectPageContent slug={slug} />
		</Suspense>
	);
}
