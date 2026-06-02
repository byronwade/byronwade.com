import { format } from "date-fns";
import Link from "next/link";
import type React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { BreadcrumbNav, ProjectViewTracker } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { FullWidthProjectPreview } from "@/components/project";
import type { Project } from "@/lib/projects";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateProjectStructuredData,
} from "@/lib/seo";

interface ProjectContentProps {
	project: Project;
}

function extractDomain(url?: string): string {
	if (!url) return "";
	try {
		const urlObj = new URL(url);
		return urlObj.hostname.replace("www.", "");
	} catch {
		return url || "";
	}
}

export function ProjectContent({ project }: ProjectContentProps) {
	const domain = extractDomain(project.url);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const url = `${baseUrl}/projects/${project.slug}`;
	const ogImage = generateOGImageUrl({
		title: project.title,
		description: project.excerpt || "",
		type: "project",
		date: project.date,
	});

	// Generate structured data
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
			{/* Analytics Tracking */}
			<ProjectViewTracker slug={project.slug} title={project.title} />

			{/* Structured Data */}
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

			<SiteShell width="wide" className="!max-w-4xl">
				<div className="flex flex-col gap-8 sm:gap-12">
					<div className="animate-in w-full max-w-2xl">
						<BreadcrumbNav
							items={[
								{ label: "Home", href: "/" },
								{ label: "Projects", href: "/projects" },
								{ label: project.title },
							]}
							className="mb-4"
						/>
						<h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
							{project.title}
						</h1>
						<div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
							{project.date && <time>{format(new Date(project.date), "MMMM d, yyyy")}</time>}
							{project.category && (
								<>
									<span aria-hidden="true">·</span>
									<span>{project.category}</span>
								</>
							)}
						</div>
					</div>

					{project.url && domain && (
						<div className="animate-in animate-delay-1 w-full">
							<FullWidthProjectPreview href={project.url} title={project.title} url={domain} />
						</div>
					)}

					<article className="animate-in animate-delay-2 w-full max-w-2xl">
						<div className="font-normal min-w-full relative shrink-0 text-[var(--foreground)] text-base flex flex-col gap-5">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeHighlight]}
								components={{
									p: ({ children, ...props }) => (
										<p className="leading-relaxed" {...props}>
											{children}
										</p>
									),
									a: ({
										children,
										href,
										...props
									}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
										const linkHref = href || "";
										const isExternal = linkHref.startsWith("http");
										return (
											<a
												href={linkHref}
												target={isExternal ? "_blank" : undefined}
												rel={isExternal ? "noopener noreferrer" : undefined}
												className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
												{...props}
											>
												{children}
											</a>
										);
									},
									strong: ({ children, ...props }) => (
										<strong className="font-semibold text-[var(--foreground)]" {...props}>
											{children}
										</strong>
									),
									em: ({ children, ...props }) => (
										<em className="italic" {...props}>
											{children}
										</em>
									),
									code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
										const isInline = !className;
										if (isInline) {
											return (
												<code
													className="text-amber-700 dark:text-yellow-500 bg-[var(--muted)] px-1.5 py-0.5 rounded text-sm font-mono"
													{...props}
												>
													{children}
												</code>
											);
										}
										return (
											<code className={className} {...props}>
												{children}
											</code>
										);
									},
									pre: ({ children, ...props }) => (
										<pre
											className="bg-[var(--muted)] border border-[var(--border)] rounded-lg my-4 p-4 overflow-x-auto text-sm"
											{...props}
										>
											{children}
										</pre>
									),
									ul: ({ children, ...props }) => (
										<ul className="list-disc pl-5 space-y-2" {...props}>
											{children}
										</ul>
									),
									ol: ({ children, ...props }) => (
										<ol className="list-decimal pl-5 space-y-2" {...props}>
											{children}
										</ol>
									),
									li: ({ children, ...props }) => (
										<li className="text-base leading-relaxed pl-1" {...props}>
											{children}
										</li>
									),
									h1: ({ children, ...props }) => (
										<h1
											className="text-2xl font-semibold mt-8 mb-4 text-[var(--foreground)]"
											{...props}
										>
											{children}
										</h1>
									),
									h2: ({ children, ...props }) => (
										<h2
											className="text-xl font-semibold mt-8 mb-4 text-[var(--foreground)]"
											{...props}
										>
											{children}
										</h2>
									),
									h3: ({ children, ...props }) => (
										<h3
											className="text-lg font-semibold mt-6 mb-3 text-[var(--foreground)]"
											{...props}
										>
											{children}
										</h3>
									),
									h4: ({ children, ...props }) => (
										<h4
											className="text-base font-semibold mt-6 mb-3 text-[var(--foreground)]"
											{...props}
										>
											{children}
										</h4>
									),
									blockquote: ({ children, ...props }) => (
										<blockquote
											className="border-l-2 border-amber-700 dark:border-yellow-500 pl-4 py-1 text-[var(--muted-foreground)] italic my-4"
											{...props}
										>
											{children}
										</blockquote>
									),
									hr: ({ ...props }) => <hr className="border-[var(--border)] my-6" {...props} />,
								}}
							>
								{project.content}
							</ReactMarkdown>
						</div>
					</article>

					<div className="animate-in animate-delay-3 w-full">
						<Link
							className="touch-target inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
							aria-label="Go to projects"
							href="/projects"
						>
							← Back to projects
						</Link>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
