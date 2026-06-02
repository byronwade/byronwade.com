import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { BreadcrumbNav, Markdown, ProjectViewTracker } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { FullWidthProjectPreview, ProjectToc } from "@/components/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractToc, safeFormatDate, safeISODate, stripLeadingH1 } from "@/lib/markdown-utils";
import type { Project, ProjectType } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateProjectStructuredData,
} from "@/lib/seo";

interface ProjectContentProps {
	project: Project;
}

const typeLabels: Record<ProjectType, string> = {
	client: "Client",
	product: "Product",
	hobby: "Hobby",
};

const typeBadgeVariant: Record<ProjectType, "success" | "secondary" | "outline"> = {
	product: "success",
	client: "secondary",
	hobby: "outline",
};

function extractDomain(url?: string): string {
	if (!url) return "";
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

/** Find the first GitHub repository link in the body, if any. */
function extractSourceUrl(content: string): string | null {
	const match = content.match(/https?:\/\/github\.com\/[^\s)<>"']+/i);
	if (!match) return null;
	return match[0].replace(/[.,]+$/, "");
}

export function ProjectContent({ project }: ProjectContentProps) {
	const domain = extractDomain(project.url);
	const projectType = project.type ?? "hobby";
	const formattedDate = safeFormatDate(project.date);
	const isoDate = safeISODate(project.date);
	const body = stripLeadingH1(project.content);
	const toc = extractToc(body);
	const sourceUrl = extractSourceUrl(project.content);
	const hasContent = Boolean(body?.trim());

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const url = `${baseUrl}/projects/${project.slug}`;
	const ogImage = generateOGImageUrl({
		title: project.title,
		description: project.excerpt || "",
		type: "project",
		date: project.date,
	});

	const projectStructuredData = generateProjectStructuredData({
		title: project.title,
		description: project.excerpt || "",
		url: project.url,
		image: ogImage,
		datePublished: project.date,
		category: project.category,
	});

	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Projects", url: `${baseUrl}/projects` },
		{ name: project.title, url },
	]);

	return (
		<>
			<ProjectViewTracker slug={project.slug} title={project.title} />

			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
			/>

			<SiteShell width="wide">
				<div className="flex flex-col gap-10 sm:gap-12">
					{/* Header */}
					<header className="reveal flex w-full max-w-2xl flex-col gap-4">
						<BreadcrumbNav
							items={[
								{ label: "Home", href: "/" },
								{ label: "Projects", href: "/projects" },
								{ label: project.title },
							]}
						/>

						<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
							<Badge variant={typeBadgeVariant[projectType]}>{typeLabels[projectType]}</Badge>
							{project.category && project.category !== typeLabels[projectType] && (
								<>
									<span aria-hidden="true" className="text-border">
										·
									</span>
									<span>{project.category}</span>
								</>
							)}
							{formattedDate && (
								<>
									<span aria-hidden="true" className="text-border">
										·
									</span>
									<time dateTime={isoDate}>{formattedDate}</time>
								</>
							)}
						</div>

						<h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
							{project.title}
						</h1>

						{project.excerpt && (
							<p className="text-lg leading-relaxed text-pretty text-muted-foreground">
								{project.excerpt}
							</p>
						)}

						{(project.url || sourceUrl) && (
							<div className="mt-1 flex flex-wrap items-center gap-2">
								{project.url && (
									<Button
										size="sm"
										render={
											<a href={project.url} target="_blank" rel="noopener noreferrer">
												Visit site
												<ArrowUpRight aria-hidden="true" />
											</a>
										}
									/>
								)}
								{sourceUrl && (
									<Button
										size="sm"
										variant="outline"
										render={
											<a href={sourceUrl} target="_blank" rel="noopener noreferrer">
												<Github aria-hidden="true" />
												Source
											</a>
										}
									/>
								)}
							</div>
						)}
					</header>

					{/* Live preview */}
					{project.url && domain && (
						<div className="reveal reveal-delay-1 w-full">
							<FullWidthProjectPreview href={project.url} title={project.title} url={domain} />
						</div>
					)}

					{/* Body + table of contents */}
					<div className="reveal reveal-delay-2 grid w-full grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,1fr)_15rem]">
						<article className="w-full max-w-2xl">
							{hasContent ? (
								<Markdown content={body} />
							) : (
								<p className="text-base leading-relaxed text-muted-foreground">
									Details for this project are coming soon.
								</p>
							)}
						</article>

						{toc.length >= 3 && (
							<aside className="hidden xl:block">
								<div className="sticky top-24">
									<ProjectToc items={toc} />
								</div>
							</aside>
						)}
					</div>

					{/* Footer nav */}
					<div className="reveal reveal-delay-3 w-full border-t border-border pt-8">
						<Link
							className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
							aria-label="Back to projects"
							href="/projects"
						>
							<ArrowLeft className="size-4" aria-hidden="true" />
							Back to projects
						</Link>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
