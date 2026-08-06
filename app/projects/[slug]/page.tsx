import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;

	return (
		<Suspense
			fallback={
				<div className="relative min-h-screen w-full bg-[var(--background)]">
					<div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10" />
					<div className="safe-top safe-bottom relative flex justify-center px-4 py-12 sm:py-16 md:py-20">
						<div className="flex w-full max-w-2xl flex-col items-center gap-8 sm:gap-12 md:gap-16">
							<div className="w-full animate-pulse">
								<div className="mb-4 h-8 w-3/4 rounded bg-[var(--muted)]" />
								<div className="h-4 w-1/2 rounded bg-[var(--muted)]" />
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
