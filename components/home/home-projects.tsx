import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Section } from "@/components/layout/page";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowUpRight } from "@/lib/icons";
import type { Project } from "@/lib/projects";
import { getFeaturedProjects } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

// Thorbis evidence rows; existing content contract and status owner retained.
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
								<StatusPill className="capitalize" tone={tone.tone}>
									{project.status}
								</StatusPill>
							)}
						</div>
						{project.tagline && <p className="text-muted-foreground text-sm">{project.tagline}</p>}
					</div>
					<ArrowUpRight
						aria-hidden="true"
						className="size-4 shrink-0 text-muted-foreground transition-[transform,color] group-hover/row:text-brand"
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
	const featured = await getFeaturedProjects(3);

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
		<Section
			className=""
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
