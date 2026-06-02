import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProjectType } from "@/lib/projects";
import { getProjects } from "@/lib/projects";

const typeLabels: Record<ProjectType, string> = {
	client: "Client",
	product: "Product",
	hobby: "Hobby",
};

async function ProjectsList() {
	const projects = await getProjects();

	const sortedProjects = [...projects].sort((a, b) => {
		const typeOrder: Record<ProjectType, number> = { product: 0, client: 1, hobby: 2 };
		const typeA = typeOrder[a.type || "hobby"];
		const typeB = typeOrder[b.type || "hobby"];
		if (typeA !== typeB) return typeA - typeB;
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA;
	});

	if (sortedProjects.length === 0) {
		return <p className="text-sm text-muted-foreground">No projects yet. Check back soon.</p>;
	}

	return (
		<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
			{sortedProjects.map((project) => {
				const projectType = project.type || "hobby";
				const cleanUrl = project.url
					? project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
					: "";
				return (
					<Link
						key={project.slug}
						href={`/projects/${project.slug}`}
						className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted"
					>
						<div className="flex min-w-0 items-center gap-3">
							<Badge variant={projectType === "product" ? "success" : "outline"}>
								{typeLabels[projectType]}
							</Badge>
							<span className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
								{project.title}
							</span>
						</div>
						<div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
							{cleanUrl && <span className="hidden sm:inline">{cleanUrl}</span>}
							<ArrowUpRight className="size-4 text-muted-foreground/60 transition-colors group-hover:text-brand" />
						</div>
					</Link>
				);
			})}
		</div>
	);
}

export function HomeProjects() {
	return (
		<section className="reveal reveal-delay-6 flex w-full flex-col gap-5">
			<div className="flex items-baseline justify-between">
				<h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">Projects</h2>
				<Link
					href="/projects"
					className="text-sm text-muted-foreground transition-colors hover:text-brand"
				>
					All projects →
				</Link>
			</div>
			<ProjectsList />
		</section>
	);
}
