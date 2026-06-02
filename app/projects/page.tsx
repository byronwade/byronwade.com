import { format } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";
import { BreadcrumbNav } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { getProjects, type ProjectType } from "@/lib/projects";
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

// Color classes for project types - subtle differentiation
const typeColors: Record<ProjectType, string> = {
	client: "text-blue-600 dark:text-blue-400",
	product: "text-accent",
	hobby: "text-purple-600 dark:text-purple-400",
};

const typeLabels: Record<ProjectType, string> = {
	client: "Client",
	product: "Product",
	hobby: "Hobby",
};

async function ProjectsList() {
	const projects = await getProjects();

	// Sort: Products first, then clients, then hobby. Within each, by date
	const sortedProjects = [...projects].sort((a, b) => {
		const typeOrder: Record<ProjectType, number> = { product: 0, client: 1, hobby: 2 };
		const typeA = typeOrder[a.type || "hobby"];
		const typeB = typeOrder[b.type || "hobby"];
		if (typeA !== typeB) return typeA - typeB;
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA;
	});

	return (
		<div className="flex flex-col gap-1.5 sm:gap-2">
			{sortedProjects.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No projects yet. Check back soon!
				</p>
			) : (
				sortedProjects.map((project) => {
					const projectType = project.type || "hobby";
					return (
						<Link
							key={project.slug}
							href={`/projects/${project.slug}`}
							className="flex flex-col gap-3 sm:gap-2 w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1.5"
						>
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<span className={`text-xs shrink-0 ${typeColors[projectType]}`}>
											{typeLabels[projectType]}
										</span>
										<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text">
											{project.title}
										</p>
									</div>
									{project.excerpt && (
										<p className="text-sm sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mt-2 sm:mt-1 leading-relaxed">
											{project.excerpt}
										</p>
									)}
								</div>
								{project.date && (
									<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors shrink-0 sm:ml-2">
										{format(new Date(project.date), "MMM d, yyyy")}
									</p>
								)}
							</div>
						</Link>
					);
				})
			)}
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
				<div className="flex flex-col gap-8 sm:gap-10">
					<div className="animate-in w-full">
						<BreadcrumbNav
							items={[{ label: "Home", href: "/" }, { label: "Projects" }]}
							className="mb-4"
						/>
						<h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
							Projects
						</h1>
						<p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
							Client work, products, and hobby projects — real-world problem solving with React,
							Next.js, and full-stack tools.
						</p>
					</div>

					<div className="animate-in animate-delay-1 w-full">
						<Suspense
							fallback={
								<div className="animate-pulse space-y-4">
									<div className="h-16 rounded-lg bg-muted" />
									<div className="h-16 rounded-lg bg-muted" />
									<div className="h-16 rounded-lg bg-muted" />
								</div>
							}
						>
							<ProjectsList />
						</Suspense>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
