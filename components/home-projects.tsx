import { Card3DTilt } from "@/components/card-3d-tilt";
import { GradientText } from "@/components/gradient-text";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getProjects } from "@/lib/projects";
import type { Project, ProjectType } from "@/lib/projects";
import Link from "next/link";

// Color classes for project types - subtle differentiation
const typeColors: Record<ProjectType, string> = {
	client: "text-blue-600 dark:text-blue-400",
	product: "text-accent",
	hobby: "text-purple-600 dark:text-purple-400",
};

const typeLabels: Record<ProjectType, string> = {
	client: "Client",
	product: "Product",
	hobby: "Hobby",
};

async function ProjectsList() {
	const projects = await getProjects();

	// Sort: Products first, then clients, then hobby. Within each, by date
	const sortedProjects = [...projects].sort((a, b) => {
		const typeOrder: Record<ProjectType, number> = { product: 0, client: 1, hobby: 2 };
		const typeA = typeOrder[a.type || "hobby"];
		const typeB = typeOrder[b.type || "hobby"];
		if (typeA !== typeB) return typeA - typeB;
		// Within same type, sort by date (newest first)
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA;
	});

	return (
		<div className="flex flex-col gap-1 sm:gap-1.5">
			{sortedProjects.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No projects yet. Check back soon!
				</p>
			) : (
				sortedProjects.map((project, index) => {
					const projectType = project.type || "hobby";
					const cleanUrl = project.url
						? project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
						: "";
					return (
						<ScrollReveal key={project.slug} direction="up" delay={index * 50}>
							<Card3DTilt intensity={3}>
								<Link
									href={`/projects/${project.slug}`}
									className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-1.5 sm:py-2 gap-2 sm:gap-4"
								>
									<div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
										<div className="flex items-center gap-2 min-w-0">
											<span className={`text-xs shrink-0 type-badge ${typeColors[projectType]}`}>
												{typeLabels[projectType]}
											</span>
											<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text truncate">
												{project.title}
											</p>
										</div>
									</div>
									{project.url && cleanUrl && (
										<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors truncate sm:whitespace-nowrap sm:ml-2 sm:shrink-0 max-w-full sm:max-w-none">
											{cleanUrl}
										</p>
									)}
								</Link>
							</Card3DTilt>
						</ScrollReveal>
					);
				})
			)}
		</div>
	);
}

export function HomeProjects() {
	return (
		<ScrollReveal direction="up" delay={100}>
			<div className="animate-in animate-delay-5 w-full">
				<div className="flex flex-col gap-6 sm:gap-7 md:gap-8 w-full items-start">
					<div className="flex flex-col gap-2 sm:gap-3 w-full">
						<GradientText
							as="h2"
							variant="accent"
							className="text-2xl sm:text-3xl font-semibold tracking-tight"
						>
							Projects
						</GradientText>
					</div>
					<ProjectsList />
				</div>
			</div>
		</ScrollReveal>
	);
}
