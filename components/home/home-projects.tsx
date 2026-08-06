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
				className="group flex flex-col gap-3 border-b border-border py-5 outline-none transition-colors last:border-b-0 focus-visible:bg-muted/60"
			>
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-1.5">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-medium text-foreground transition-colors group-hover:text-brand group-focus-visible:text-brand">
								{title}
							</span>
							{tone && project.status && (
								<StatusPill tone={tone.tone} pulse={tone.pulse} className="capitalize">
									{project.status}
								</StatusPill>
							)}
						</div>
						{project.tagline && <p className="text-sm text-muted-foreground">{project.tagline}</p>}
					</div>
					<ArrowUpRight
						className="size-4 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
						aria-hidden="true"
					/>
				</div>

				{(project.outcome || project.problem) && (
					<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
						{project.outcome || project.problem}
					</p>
				)}

				{metrics.length > 0 && (
					<ul className="flex flex-wrap gap-x-4 gap-y-1.5 tabular-nums">
						{metrics.map((metric) => (
							<li key={`${project.slug}-${metric.label}`} className="flex items-baseline gap-1.5">
								<span className="text-sm font-medium text-foreground">{metric.value}</span>
								<span className="text-xs text-muted-foreground">{metric.label}</span>
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
			<p className="text-sm text-muted-foreground">No featured projects yet. Check back soon.</p>
		);
	}

	return (
		<ul className="overflow-hidden rounded-2xl border border-border bg-card px-4 sm:px-5">
			{featured.map((project) => (
				<FeaturedProject key={project.slug} project={project} />
			))}
		</ul>
	);
}

export function HomeProjects() {
	return (
		<section className="reveal reveal-delay-6 flex w-full flex-col gap-5">
			<div className="flex items-baseline justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
						Selected work
					</h2>
					<p className="text-sm text-muted-foreground">
						Proof from products and the service business that shaped them.
					</p>
				</div>
				<Link
					href="/projects"
					className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-brand"
				>
					All projects →
				</Link>
			</div>
			<FeaturedList />
			<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
				<Badge variant="muted">Case studies</Badge>
				<span>Full index with client work, concepts, and open source on the projects page.</span>
			</div>
		</section>
	);
}
