"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/lib/portfolio-data";

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
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Badge variant="outline">{project.status}</Badge>
						<h1 className="mt-4 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
							{project.title}
						</h1>
						<p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
							{project.longDescription}
						</p>
						<div className="mt-8 flex flex-wrap gap-4">
							{project.liveUrl && (
								<Button
									render={<Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" />}
									size="lg"
								>
									<ExternalLink className="mr-2 h-5 w-5" />
									Live Demo
								</Button>
							)}
							{project.githubUrl && (
								<Button
									render={
										<Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" />
									}
									size="lg"
									variant="outline"
								>
									<Github className="mr-2 h-5 w-5" />
									View on GitHub
								</Button>
							)}
						</div>
					</motion.div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-16 sm:py-24">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
					{/* Left Column */}
					<div className="lg:col-span-2">
						{/* Gallery */}
						<div className="mb-16">
							<h2 className="mb-8 font-bold text-3xl">Gallery</h2>
							<div className="grid grid-cols-1 gap-8">
								{project.gallery.map((src, index) => (
									<motion.div
										key={src}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: index * 0.1 }}
									>
										<Image
											src={src}
											alt={`${project.title} gallery image ${index + 1}`}
											width={1200}
											height={800}
											className="rounded-lg object-cover shadow-lg"
										/>
									</motion.div>
								))}
							</div>
						</div>

						<Separator className="my-16" />

						{/* Project Deep Dive */}
						<div>
							<h2 className="mb-8 font-bold text-3xl">Project Deep Dive</h2>
							<div className="space-y-12">
								<div>
									<h3 className="mb-4 font-semibold text-2xl text-primary">The Problem</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{project.problem}</p>
								</div>
								<div>
									<h3 className="mb-4 font-semibold text-2xl text-primary">The Solution</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">
										{project.solution}
									</p>
								</div>
								<div>
									<h3 className="mb-4 font-semibold text-2xl text-primary">The Outcome</h3>
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
								<h3 className="mb-4 font-semibold text-2xl">Tech Stack</h3>
								<div className="flex flex-wrap gap-3">
									{project.techStack.map((tech) => (
										<Badge key={tech.name} variant="secondary" className="px-3 py-1 text-sm">
											{tech.name}
										</Badge>
									))}
								</div>
							</div>

							{/* Key Features */}
							<div>
								<h3 className="mb-4 font-semibold text-2xl">Key Features</h3>
								<ul className="space-y-3">
									{project.keyFeatures.map((feature) => (
										<li key={feature} className="flex items-start">
											<CheckCircle className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-success" />
											<span className="text-muted-foreground">{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Tags */}
							<div>
								<h3 className="mb-4 font-semibold text-2xl">Project Tags</h3>
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
