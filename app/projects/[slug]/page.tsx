import { getAllProjectSlugs, getProject } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateProjectStructuredData,
	generateMetadata as generateSEOMetadata,
} from "@/lib/seo";
import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const url = `${baseUrl}/projects/${slug}`;
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

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;

	return (
		<Suspense
			fallback={
				<div className="relative min-h-screen w-full bg-[var(--background)]">
					<div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10 pointer-events-none" />
					<div className="relative flex justify-center py-12 px-4 sm:py-16 md:py-20 safe-top safe-bottom">
						<div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-center w-full max-w-2xl">
							<div className="animate-pulse w-full">
								<div className="h-8 bg-[var(--muted)] rounded w-3/4 mb-4" />
								<div className="h-4 bg-[var(--muted)] rounded w-1/2" />
							</div>
						</div>
					</div>
				</div>
			}
		>
			<ProjectPageContent slug={slug} />
		</Suspense>
	);
}
