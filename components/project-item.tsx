"use client";

import { ProjectPreview } from "@/components/project-preview";
import { analytics } from "@/lib/analytics";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectItemProps {
	slug: string;
	title: string;
	url?: string;
	category?: string;
	date?: string;
	excerpt?: string;
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

export function ProjectItem({ slug, title, url, category, date, excerpt }: ProjectItemProps) {
	const domain = extractDomain(url);

	return (
		<div className="flex flex-col gap-3 w-full group">
			<div className="flex items-start justify-between gap-4 w-full">
				<div className="flex-1">
					{/* Title linking to project detail page */}
					<Link
						href={`/projects/${slug}`}
						className="block hover:opacity-70 transition-all duration-200 focus-ring touch-target"
					>
						<p className="font-medium text-[var(--foreground)] text-base underline-animate mobile-text">
							{title}
						</p>
					</Link>
					{excerpt && (
						<p className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mt-1">
							{excerpt}
						</p>
					)}
					<div className="flex items-center gap-2 mt-2">
						{category && <p className="text-xs text-[var(--muted-foreground)]">{category}</p>}
						{date && category && <span className="text-xs text-[var(--muted-foreground)]">•</span>}
						{date && (
							<p className="text-xs text-[var(--muted-foreground)]">
								{format(new Date(date), "MMM d, yyyy")}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* External link with preview - positioned prominently */}
			{url && domain && (
				<div className="flex items-center gap-2">
					<ProjectPreview href={url} title={title} url={domain}>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/90 transition-all duration-200 touch-target py-2 px-3 rounded-md hover:bg-accent/10 group/link border border-accent/20 hover:border-accent/40"
							onClick={(e) => {
								e.stopPropagation();
								analytics.externalLinkClick(url, `Visit ${domain}`);
								analytics.projectClick(slug, title, url);
							}}
						>
							<span className="underline-animate">Visit {domain}</span>
							<ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
						</a>
					</ProjectPreview>
					<span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
						(Hover to preview)
					</span>
				</div>
			)}
		</div>
	);
}
