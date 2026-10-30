import Link from "next/link";
import { IndexList, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Section } from "@/components/layout/page";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowRight } from "@/lib/icons";
import type { Project } from "@/lib/projects";
import { getFeaturedProjects } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

// Thorbis evidence rows; existing content contract and status owner retained.
function FeaturedProject({ project }: { project: Project }) {
	const title = project.title.split(":")[0];
	const metrics = project.metrics?.slice(0, 3) ?? [];
	const tone = statusTone(project.status);

	return (
		<li>
			<Link prefetch={false} className={indexRowLinkClass} href={`/projects/${project.slug}`}>
				<div className="grid grid-cols-[minmax(0,1fr)_auto_1rem] items-center gap-x-3">
					<span
						className={`min-w-0 font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}
					>
						{title}
					</span>
					{tone && project.status ? (
						<StatusPill className="justify-self-end capitalize" tone={tone.tone}>
							{project.status}
						</StatusPill>
					) : (
						<span />
					)}
					<ArrowRight
						aria-hidden="true"
						className="size-4 justify-self-end text-muted-foreground transition-colors duration-(--motion-fast) ease-(--ease-out) group-hover/row:text-foreground group-focus-visible/row:text-foreground motion-reduce:transition-none"
					/>
				</div>

				{(project.outcome || project.excerpt) && (
					<p className="max-w-2xl text-pretty text-body text-copy-14">
						{project.outcome || project.excerpt}
					</p>
				)}

				{metrics.length > 0 && (
					<ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 tabular-nums">
						{metrics.map((metric) => (
							<li className="flex items-baseline gap-1.5" key={`${project.slug}-${metric.label}`}>
								<span className="font-medium text-copy-14 text-foreground">{metric.value}</span>
								<span className="text-copy-12 text-muted-foreground">{metric.label}</span>
							</li>
						))}
					</ul>
				)}
			</Link>
		</li>
	);
}

async function FeaturedList() {
	const featured = await getFeaturedProjects(3);

	if (featured.length === 0) {
		return (
			<p className="text-copy-14 text-muted-foreground">
				Nothing is featured right now.{" "}
				<Link className="link-underline" href="/projects" prefetch={false}>
					Every project is listed on the projects page
				</Link>
				.
			</p>
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
			description="Proof from products and the service business that shaped them."
			link={
				<Link prefetch={false} className="link-action shrink-0" href="/projects">
					All projects
				</Link>
			}
			title="Selected work"
		>
			<FeaturedList />
		</Section>
	);
}
