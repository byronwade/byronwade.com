import type { Viewport } from "next";
import { notFound } from "next/navigation";
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

/** Only the loader's slugs are pages; see the blog route for why this is not left to `notFound()`. */
export const dynamicParams = false;

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

	return <ProjectPageContent slug={slug} />;
}
