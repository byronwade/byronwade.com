import { type ProjectType, getProjects } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { format } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

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
	product: "text-yellow-600 dark:text-yellow-500",
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
		<div className="flex flex-col gap-3 sm:gap-4">
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
							className="flex flex-col gap-2 w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className={`text-xs ${typeColors[projectType]}`}>
											{typeLabels[projectType]}
										</span>
										<p className="font-medium text-[var(--foreground)] text-base underline-animate mobile-text">
											{project.title}
										</p>
									</div>
									{project.excerpt && (
										<p className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mt-1">
											{project.excerpt}
										</p>
									)}
								</div>
								{project.date && (
									<p className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors whitespace-nowrap ml-2">
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

			<div className="relative min-h-screen w-full bg-[var(--background)]">
				{/* Subtle background gradient */}
				<div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10 pointer-events-none" />

				{/* Main content */}
				<div className="relative flex justify-center py-12 px-4 sm:py-16 md:py-20 safe-top safe-bottom">
					<div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-center w-full max-w-2xl">
						{/* Header Section */}
						<div className="animate-in w-full">
							<div className="flex flex-col gap-6 items-start w-full">
								<Link
									className="group flex items-center gap-2 w-full touch-target"
									aria-label="Go to home"
									href="/"
								>
									<span className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200">
										← Back to home
									</span>
								</Link>

								<h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight">
									Projects
								</h1>
								<p className="text-[var(--muted-foreground)] text-base leading-relaxed max-w-2xl">
									A collection of client work, products, and hobby projects showcasing modern web
									development with React, Next.js, and full-stack technologies. Each project
									represents real-world problem-solving and clean code practices.
								</p>
							</div>
						</div>

						{/* Projects List */}
						<div className="animate-in animate-delay-1 w-full">
							<Suspense
								fallback={
									<div className="animate-pulse">
										<div className="h-16 bg-[var(--muted)] rounded mb-4" />
										<div className="h-16 bg-[var(--muted)] rounded mb-4" />
										<div className="h-16 bg-[var(--muted)] rounded" />
									</div>
								}
							>
								<ProjectsList />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
