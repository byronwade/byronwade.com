import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/lib/projects";
import { getFeaturedProjects } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

function FeaturedProject({ project }: { project: Project }) {
	const title = project.title.split(":")[0];
	const metrics = project.metrics?.slice(0, 3) ?? [];
	const tone = statusTone(project.status);

	return (
		<li>
			<Link
				href={`/projects/${project.slug}`}
				className="group/row hover-motion flex flex-col gap-3 border-border border-b py-5 outline-none last:border-b-0 hover:opacity-100! focus-visible:opacity-100! group-hover/list:opacity-40"
			>
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-1.5">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-medium text-foreground transition-colors group-hover/row:text-brand group-focus-visible/row:text-brand">
								{title}
							</span>
							{tone && project.status && (
								<StatusPill tone={tone.tone} pulse={tone.pulse} className="capitalize">
									{project.status}
								</StatusPill>
							)}
						</div>
						{project.tagline && <p className="text-muted-foreground text-sm">{project.tagline}</p>}
					</div>
					<ArrowUpRight
						className="size-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-brand"
						aria-hidden="true"
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
							<li key={`${project.slug}-${metric.label}`} className="flex items-baseline gap-1.5">
								<span className="font-medium text-foreground text-sm">{metric.value}</span>
								<span className="text-muted-foreground text-xs">{metric.label}</span>
							</li>
						))}
					</ul>
				)}
			</Link>
		</li>
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
		<ul className="group/list flex flex-col border-border border-t">
			{featured.map((project) => (
				<FeaturedProject key={project.slug} project={project} />
			))}
		</ul>
	);
}

export function HomeProjects() {
	return (
		// Left-aligned to the shell edge, not centred inside it: the opening and
		// every section share one left margin, which is what holds the page together
		// once the scenes are set this far apart.
		<section className="flex w-full max-w-3xl flex-col gap-5">
			<div className="flex items-baseline justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="font-heading font-semibold text-xl tracking-tight sm:text-2xl">
						Selected work
					</h2>
					<p className="text-muted-foreground text-sm">
						Proof from products and the service business that shaped them.
					</p>
				</div>
				<Link
					href="/projects"
					className="shrink-0 text-muted-foreground text-sm transition-colors hover:text-brand"
				>
					All projects →
				</Link>
			</div>
			<FeaturedList />
			<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
				<Badge variant="muted">Case studies</Badge>
				<span>Full index with client work, concepts, and open source on the projects page.</span>
			</div>
		</section>
	);
}
