"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlumbingWorkCard, PlumbingProject } from "@/components/plumbing-work-card";
import HeroPages from "@/components/sections/hero-pages";

type FilterType = "all" | "plumbing" | "septic";

export default function OurWorkClientPage({ projects }: { projects: PlumbingProject[] }) {
	const [filter, setFilter] = useState<FilterType>("all");

	const filteredProjects = useMemo(() => {
		if (filter === "all") {
			return projects;
		}
		return projects.filter((p) => p.category.toLowerCase() === filter);
	}, [projects, filter]);

	return (
		<>
			<HeroPages
				title="Our Work"
				subtitle="A showcase of our commitment to quality plumbing and septic solutions. See the difference that professional, experienced service makes."
				backgroundImage="/images/plumbing-hero.jpg" // Add a relevant hero image
			/>
			<main className="container mx-auto px-4 pb-16 sm:pb-24">
				<div className="flex justify-center items-center gap-2 mb-12">
					<Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
						All
					</Button>
					<Button variant={filter === "plumbing" ? "default" : "outline"} onClick={() => setFilter("plumbing")}>
						Plumbing
					</Button>
					<Button variant={filter === "septic" ? "default" : "outline"} onClick={() => setFilter("septic")}>
						Septic
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredProjects.map((project) => (
						<PlumbingWorkCard key={project.id} project={project} />
					))}
				</div>
			</main>
		</>
	);
}
