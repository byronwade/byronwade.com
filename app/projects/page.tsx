import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BreadcrumbNav } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
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

	if (sortedProjects.length === 0) {
		return (
			<p className="text-sm leading-relaxed text-muted-foreground">
				No projects yet. Check back soon.
			</p>
		);
	}

	return (
		<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
			{sortedProjects.map((project) => {
				const projectType = project.type || "hobby";
				return (
					<Link
						key={project.slug}
						href={`/projects/${project.slug}`}
						className="group flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-muted"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex min-w-0 items-center gap-3">
								<Badge variant={projectType === "product" ? "success" : "outline"}>
									{typeLabels[projectType]}
								</Badge>
								<span className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
									{project.title}
								</span>
							</div>
							<div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
								{project.date && (
									<time className="hidden sm:inline">
										{format(new Date(project.date), "MMM d, yyyy")}
									</time>
								)}
								<ArrowUpRight className="size-4 text-muted-foreground/60 transition-colors group-hover:text-brand" />
							</div>
						</div>
						{project.excerpt && (
							<p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
								{project.excerpt}
							</p>
						)}
					</Link>
				);
			})}
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
					<header className="reveal flex w-full flex-col gap-3">
						<BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							Projects
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
							Client work, products, and hobby projects — real-world problem solving with React,
							Next.js, and full-stack tools.
						</p>
					</header>

					<div className="reveal reveal-delay-1 w-full">
						<Suspense
							fallback={
								<div className="animate-pulse space-y-2">
									<div className="h-16 rounded-2xl bg-muted" />
									<div className="h-16 rounded-2xl bg-muted" />
									<div className="h-16 rounded-2xl bg-muted" />
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
