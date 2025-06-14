"use client";;
import { use } from "react";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/portfolio-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function ProjectDetailsPage(props: { params: Promise<{ slug: string[] }> }) {
    const params = use(props.params);
    const slug = params.slug?.join("/");
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
		notFound();
	}

    return (
		<div className="bg-background text-foreground">
			{/* Hero Section */}
			<div className="relative bg-secondary/50">
				<div className="container mx-auto px-4 py-24 sm:py-32">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
						<Badge variant="outline">{project.status}</Badge>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-4">{project.title}</h1>
						<p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">{project.longDescription}</p>
						<div className="mt-8 flex flex-wrap gap-4">
							{project.liveUrl && (
								<Button asChild size="lg">
									<Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="mr-2 h-5 w-5" />
										Live Demo
									</Link>
								</Button>
							)}
							{project.githubUrl && (
								<Button asChild size="lg" variant="outline">
									<Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
										<Github className="mr-2 h-5 w-5" />
										View on GitHub
									</Link>
								</Button>
							)}
						</div>
					</motion.div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
					{/* Left Column */}
					<div className="lg:col-span-2">
						{/* Gallery */}
						<div className="mb-16">
							<h2 className="text-3xl font-bold mb-8">Gallery</h2>
							<div className="grid grid-cols-1 gap-8">
								{project.gallery.map((src, index) => (
									<motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
										<Image src={src} alt={`${project.title} gallery image ${index + 1}`} width={1200} height={800} className="rounded-lg shadow-lg object-cover" />
									</motion.div>
								))}
							</div>
						</div>

						<Separator className="my-16" />

						{/* Project Deep Dive */}
						<div>
							<h2 className="text-3xl font-bold mb-8">Project Deep Dive</h2>
							<div className="space-y-12">
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Problem</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{project.problem}</p>
								</div>
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Solution</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{project.solution}</p>
								</div>
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Outcome</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{project.outcome}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column (Sidebar) */}
					<aside>
						<div className="sticky top-24 space-y-12">
							{/* Tech Stack */}
							<div>
								<h3 className="text-2xl font-semibold mb-4">Tech Stack</h3>
								<div className="flex flex-wrap gap-3">
									{project.techStack.map((tech) => (
										<Badge key={tech.name} variant="secondary" className="text-sm px-3 py-1">
											{tech.name}
										</Badge>
									))}
								</div>
							</div>

							{/* Key Features */}
							<div>
								<h3 className="text-2xl font-semibold mb-4">Key Features</h3>
								<ul className="space-y-3">
									{project.keyFeatures.map((feature) => (
										<li key={feature} className="flex items-start">
											<CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1" />
											<span className="text-muted-foreground">{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Tags */}
							<div>
								<h3 className="text-2xl font-semibold mb-4">Project Tags</h3>
								<div className="flex flex-wrap gap-2">
									{project.tags.map((tag) => (
										<Badge key={tag} variant="outline">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
