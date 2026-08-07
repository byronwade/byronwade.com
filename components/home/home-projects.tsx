import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Section } from "@/components/layout/page";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/lib/projects";
import { getFeaturedProjects } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

/**
 * Homepage "selected work". The first turn after the opening.
 *
 * Rebuilt onto the shared index primitives rather than its own copy of the
 * spotlight markup. What stays local is the *content* of a row: this section's
 * job is proof, so each row carries outcome and up to three metrics, which the
 * blog index below deliberately does not.
 *
 * The trailing "Case studies" badge line was removed. It restated what the
 * "All projects" link already offers and put a second, weaker route to the same
 * place at the foot of the section.
 */
function FeaturedProject({ project }: { project: Project }) {
	const title = project.title.split(":")[0];
	const metrics = project.metrics?.slice(0, 3) ?? [];
	const tone = statusTone(project.status);

	return (
		<IndexRow>
			<Link className={indexRowLinkClass} href={`/projects/${project.slug}`}>
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-1.5">
						<div className="flex flex-wrap items-center gap-2">
							<span className={`font-medium text-foreground ${indexRowAccentClass}`}>{title}</span>
							{tone && project.status && (
								<StatusPill className="capitalize" pulse={tone.pulse} tone={tone.tone}>
									{project.status}
								</StatusPill>
							)}
						</div>
						{project.tagline && <p className="text-muted-foreground text-sm">{project.tagline}</p>}
					</div>
					<ArrowUpRight
						aria-hidden="true"
						className="size-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-brand"
					/>
				</div>

				{(project.outcome || project.problem) && (
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						{project.outcome || project.problem}
					</p>
				)}

				{metrics.length > 0 && (
					<ul className="flex flex-wrap gap-x-4 gap-y-1.5 tabular-nums">
						{metrics.map((metric) => (
							<li className="flex items-baseline gap-1.5" key={`${project.slug}-${metric.label}`}>
								<span className="font-medium text-foreground text-sm">{metric.value}</span>
								<span className="text-muted-foreground text-xs">{metric.label}</span>
							</li>
						))}
					</ul>
				)}
			</Link>
		</IndexRow>
	);
}

async function FeaturedList() {
	const featured = await getFeaturedProjects(5);

	if (featured.length === 0) {
		return (
			<p className="text-muted-foreground text-sm">No featured projects yet. Check back soon.</p>
		);
	}

	return (
		<IndexList>
			{featured.map((project) => (
				<FeaturedProject key={project.slug} project={project} />
			))}
		</IndexList>
	);
}

export function HomeProjects() {
	return (
		// Left-aligned to the shell edge, not centred inside it: the opening and
		// every section share one left margin, which is what holds the page
		// together once the scenes are set this far apart.
		<Section
			className="max-w-3xl"
			description="Proof from products and the service business that shaped them."
			link={
				<Link
					className="shrink-0 text-muted-foreground text-sm transition-colors hover:text-brand"
					href="/projects"
				>
					All projects →
				</Link>
			}
			title="Selected work"
		>
			<FeaturedList />
		</Section>
	);
}
