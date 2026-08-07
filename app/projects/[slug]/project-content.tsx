import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { Markdown, ProjectViewTracker } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
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
import { siteUrl } from "@/lib/site";

// Hoisted so each is compiled once rather than on every call.
const WWW_PREFIX = /^www\./;
const GITHUB_URL = /https?:\/\/github\.com\/[^\s)<>"']+/i;
const TRAILING_PUNCTUATION = /[.,]+$/;

interface ProjectContentProps {
	project: Project;
}

const typeLabels: Record<ProjectType, string> = {
	client: "Client",
	product: "Product",
	concept: "Concept",
	hobby: "Hobby",
};

const typeBadgeVariant: Record<ProjectType, "success" | "secondary" | "outline"> = {
	product: "success",
	client: "secondary",
	concept: "outline",
	hobby: "outline",
};

function extractDomain(url?: string): string {
	if (!url) {
		return "";
	}
	try {
		return new URL(url).hostname.replace(WWW_PREFIX, "");
	} catch {
		return url;
	}
}

/** Find the first GitHub repository link in the body, if any. */
function extractSourceUrl(content: string): string | null {
	const match = content.match(GITHUB_URL);
	if (!match) {
		return null;
	}
	return match[0].replace(TRAILING_PUNCTUATION, "");
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

	const url = `${siteUrl}/projects/${project.slug}`;
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
		{ name: "Home", url: siteUrl },
		{ name: "Projects", url: `${siteUrl}/projects` },
		{ name: project.title, url },
	]);

	return (
		<>
			<ProjectViewTracker slug={project.slug} title={project.title} />

			<JsonLd data={projectStructuredData} />
			<JsonLd data={breadcrumbStructuredData} />

			<SiteShell width="wide">
				<div className="flex flex-col gap-10 sm:gap-12">
					{/* Header */}
					<header className="reveal flex w-full max-w-2xl flex-col gap-4">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground text-sm">
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

						<h1 className="text-balance font-heading font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
							{project.title}
						</h1>

						{project.excerpt && (
							<p className="text-pretty text-lg text-muted-foreground leading-relaxed">
								{project.excerpt}
							</p>
						)}

						{/* Problem and outcome are the argument of an Evidence page (§3.2), so
						    they are set as a plain definition list on a hairline rather than
						    in two tinted cards with all-caps labels. §13 rejects the card
						    wrapper and the eyebrow, and §3.2 says the comparison itself is the
						    dominant object, not the box around it. */}
						{(project.problem || project.outcome) && (
							<dl className="mt-1 flex flex-col gap-4 border-border border-t pt-4 sm:flex-row sm:gap-10">
								{project.problem && (
									<div className="flex flex-1 flex-col gap-1">
										<dt className="text-muted-foreground text-xs">Problem</dt>
										<dd className="text-foreground text-sm leading-relaxed">{project.problem}</dd>
									</div>
								)}
								{project.outcome && (
									<div className="flex flex-1 flex-col gap-1">
										<dt className="text-muted-foreground text-xs">Outcome</dt>
										<dd className="text-foreground text-sm leading-relaxed">{project.outcome}</dd>
									</div>
								)}
							</dl>
						)}

						{project.metrics && project.metrics.length > 0 && (
							<ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 border-border border-y py-3 tabular-nums">
								{project.metrics.map((metric) => (
									<li key={`${project.slug}-${metric.label}`} className="flex flex-col gap-0.5">
										<span className="font-semibold text-base text-foreground">{metric.value}</span>
										<span className="text-muted-foreground text-xs">{metric.label}</span>
									</li>
								))}
							</ul>
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
								<p className="text-base text-muted-foreground leading-relaxed">
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
					<div className="reveal reveal-delay-3 flex w-full flex-col gap-4 border-border border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
						<Link
							className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
							href="/projects"
						>
							<ArrowLeft aria-hidden="true" className="size-4" />
							Back to projects
						</Link>
						{/* Brand is not a link colour (§5.1). The underline carries the
						    affordance; weight carries the emphasis. */}
						<div className="flex flex-wrap items-center gap-3 text-sm">
							<span className="text-muted-foreground">Want something like this?</span>
							<Link className="link-underline font-medium" href="/contact">
								Start a conversation →
							</Link>
						</div>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
