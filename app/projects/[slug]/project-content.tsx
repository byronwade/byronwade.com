import { Markdown, ProjectViewTracker } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { measureClass, SiteShell } from "@/components/layout/site-shell";
import { FullWidthProjectPreview, ProjectToc } from "@/components/project";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ArrowLeft, ArrowUpRight, Github } from "@/lib/icons";
import { extractToc } from "@/lib/markdown";
import { safeFormatDate, safeISODate, stripLeadingH1 } from "@/lib/markdown-utils";
import type { Project, ProjectType } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateProjectStructuredData,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

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

/** The argument (problem, outcome) and the numbers: the executive read's evidence. */
function ProjectProof({ project }: { project: Project }) {
	return (
		<>
			{/* Problem and outcome are the argument of an Evidence page (§3.2):
			    a plain definition list, separated from the lede by space. */}
			{(project.problem || project.outcome) && (
				<dl className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-10">
					{project.problem && (
						<div className="flex flex-1 flex-col gap-1">
							<dt className="text-copy-12 text-muted-foreground">Problem</dt>
							<dd className="text-body text-copy-14 leading-relaxed">{project.problem}</dd>
						</div>
					)}
					{project.outcome && (
						<div className="flex flex-1 flex-col gap-1">
							<dt className="text-copy-12 text-muted-foreground">Outcome</dt>
							<dd className="text-body text-copy-14 leading-relaxed">{project.outcome}</dd>
						</div>
					)}
				</dl>
			)}

			{project.metrics && project.metrics.length > 0 && (
				<dl className="flex flex-wrap gap-x-10 gap-y-3 pt-2 tabular-nums">
					{project.metrics.map((metric) => (
						<div key={`${project.slug}-${metric.label}`} className="flex flex-col gap-0.5">
							<dt className="text-copy-12 text-muted-foreground">{metric.label}</dt>
							<dd className="order-first font-medium text-foreground text-heading-20">
								{metric.value}
							</dd>
						</div>
					))}
				</dl>
			)}
		</>
	);
}
export function ProjectContent({ project }: ProjectContentProps) {
	const domain = extractDomain(project.url);
	const projectType = project.type;
	const projectTypeLabel = projectType ? typeLabels[projectType] : "Project";
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

			{/* Only the live artifact spans the wide shell; the story keeps the
			    header's 42rem measure so title, prose and chrome share one edge. */}
			<SiteShell profile="evidence" width="wide">
				{/* Executive read: identity, claim, the argument, the numbers, the way in. */}
				<header className={cn(measureClass, "flex flex-col gap-4")}>
					<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-copy-13 text-muted-foreground">
						<span>{projectTypeLabel}</span>
						{project.category && project.category !== projectTypeLabel && (
							<>
								<span aria-hidden="true">·</span>
								<span>{project.category}</span>
							</>
						)}
						{formattedDate && (
							<>
								<span aria-hidden="true">·</span>
								<time dateTime={isoDate}>{formattedDate}</time>
							</>
						)}
					</p>

					<h1 className="text-balance font-heading font-medium text-foreground text-heading-32 tracking-tight">
						{project.title}
					</h1>

					{project.excerpt && (
						<p className="text-pretty text-body text-copy-16 leading-relaxed">{project.excerpt}</p>
					)}

					<ProjectProof project={project} />

					{(project.url || sourceUrl) && (
						<div className="flex flex-wrap items-center gap-3 pt-2">
							{project.url && (
								<Button
									render={
										<a href={project.url} target="_blank" rel="noopener noreferrer">
											Visit site
											<ArrowUpRight aria-hidden="true" />
											<span className="sr-only"> (opens in a new tab)</span>
										</a>
									}
								/>
							)}
							{sourceUrl && (
								<Button
									variant="secondary"
									render={
										<a href={sourceUrl} target="_blank" rel="noopener noreferrer">
											<Github aria-hidden="true" />
											Source
											<span className="sr-only"> (opens in a new tab)</span>
										</a>
									}
								/>
							)}
						</div>
					)}
				</header>

				{/* The live artifact, beside the story (§7.1). */}
				{project.url && domain && (
					<figure className="flex w-full flex-col gap-3.5">
						<FullWidthProjectPreview href={project.url} title={project.title} url={domain} />
						<figcaption className="text-copy-12 text-muted-foreground">
							A capture of {domain}, refreshed from the live site. Switch the viewport, drag the
							side handles, or use the arrow keys on a handle to resize.
						</figcaption>
					</figure>
				)}

				{/* Audit read: the write-up on the measure, its outline docked in the
					    right gutter on wide screens so it never moves the text's edge. */}
				<div className={cn(measureClass, "relative")}>
					<article className="min-w-0">
						{hasContent ? (
							<Markdown content={body} />
						) : (
							<p className="text-body text-copy-16 leading-relaxed">
								The write-up for this project isn’t published yet.
								{project.url || sourceUrl
									? " The live site and source above are the record for now."
									: " Ask me about it through the contact page."}
							</p>
						)}
					</article>

					{toc.length >= 3 && (
						<aside className="absolute inset-y-0 left-full ml-10 hidden w-60 xl:block">
							<div className="sticky top-24">
								<ProjectToc items={toc} />
							</div>
						</aside>
					)}
				</div>

				<div
					className={cn(
						measureClass,
						"flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
					)}
				>
					<Link className="link-action" href="/projects">
						<ArrowLeft aria-hidden="true" className="size-4" />
						Back to projects
					</Link>
					<p className="flex flex-wrap items-center gap-x-2 text-copy-14 text-muted-foreground">
						Want something like this?
						<Link className="link-action" href="/contact">
							Start a conversation
						</Link>
					</p>
				</div>
			</SiteShell>
		</>
	);
}
