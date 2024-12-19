"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, Tag, Github, ChartBar } from "lucide-react";

interface Project {
	id: number;
	year: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	url?: string;
	github?: string;
	analysis?: string;
	status?: "completed" | "in-progress" | "planned";
	category?: string;
}

const projects: Project[] = [
	{
		id: 1,
		year: "2023",
		title: "rebuzzle.byronwade.com",
		description: "My personal website, built with Next.js, Tailwind CSS, and Framer Motion.",
		image: "https://placehold.co/600x400",
		tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
		url: "https://rebuzzle.byronwade.com",
		github: "https://github.com/username/rebuzzle",
		analysis: "/analysis/rebuzzle",
		status: "completed",
		category: "AI & Machine Learning",
	},
	{
		id: 2,
		year: "2023",
		title: "wadesplumbingandseptic.com",
		description: "My plumbing and septic business website, built with Next.js, Tailwind CSS, and Framer Motion.",
		image: "https://placehold.co/600x400",
		tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
		url: "https://wadesplumbingandseptic.com",
		github: "https://github.com/username/wadesplumbingandseptic",
		status: "in-progress",
		category: "Travel & Lifestyle",
		analysis: "/analysis/wadesplumbingandseptic",
	},
	{
		id: 3,
		year: "2023",
		title: "reacpress.io",
		description: "A simple, fast, and fun way to generate greeting cards with AI. (Go make carrrds!)",
		image: "https://placehold.co/600x400",
		tags: ["Next.js"],
		url: "https://carrrd.com",
		status: "planned",
		category: "Creative Tools",
		analysis: "/analysis/carrrd",
	},
	{
		id: 4,
		year: "2022",
		title: "NV /",
		description: 'My first try at writing shaders, using the Frame Buffer Object technique to animate lots of particles. A project to explore Chinese characters that have "女" (woman) in them as a component.',
		image: "https://placehold.co/600x400",
		tags: ["WebGL", "Three.js"],
		url: "https://nv.com",
		github: "https://github.com/username/nv",
		status: "completed",
		category: "Graphics & Animation",
		analysis: "/analysis/nv",
	},
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
	const cardVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	const getStatusColor = (status?: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "in-progress":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
			case "planned":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
		}
	};

	return (
		<motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40% 0px -40% 0px" }} className="group relative mt-12">
			{/* Category Label */}
			<motion.div variants={itemVariants} className="absolute -top-8 left-0">
				<span className="text-sm text-muted-foreground flex items-center gap-2">
					<Tag className="w-4 h-4" />
					{project.category}
				</span>
			</motion.div>

			<motion.div className="relative p-4 -m-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
				<motion.div variants={itemVariants} className="flex items-baseline justify-between mb-6">
					<div className="flex items-center gap-4">
						<h2 className="text-3xl font-bold">{project.title}</h2>
						<span className="text-sm text-muted-foreground"># {project.id}</span>
						<span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>{project.status}</span>
					</div>
					<span className="text-sm text-muted-foreground flex items-center gap-1">/{project.year}</span>
				</motion.div>

				<motion.div variants={itemVariants} className="relative aspect-[16/9] overflow-hidden rounded-lg transition-all group-hover:ring-2 ring-zinc-200 dark:ring-zinc-800">
					<Image src={project.image} alt={`Preview of ${project.title}`} fill className="object-cover rounded-lg transition-transform group-hover:scale-[1.02]" />
					<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
						{project.url && (
							<a href={project.url} target="_blank" rel="noopener noreferrer" className="bg-zinc-50/10 backdrop-blur-sm hover:bg-zinc-50/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
								<span>Visit Site</span>
								<ArrowUpRight className="w-4 h-4" />
							</a>
						)}
						{project.github && (
							<a href={project.github} target="_blank" rel="noopener noreferrer" className="bg-zinc-50/10 backdrop-blur-sm hover:bg-zinc-50/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
								<Github className="w-4 h-4" />
								<span>View Code</span>
							</a>
						)}
						{project.analysis && (
							<a href={project.analysis} target="_blank" rel="noopener noreferrer" className="bg-zinc-50/10 backdrop-blur-sm hover:bg-zinc-50/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
								<ChartBar className="w-4 h-4" />
								<span>View Analysis</span>
							</a>
						)}
					</div>
				</motion.div>

				<motion.p variants={itemVariants} className="text-lg text-muted-foreground mt-6">
					{project.description}
				</motion.p>

				<motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-4">
					{project.tags.map((tag, tagIndex) => (
						<motion.span key={tagIndex} variants={itemVariants} className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-full">
							{tag}
						</motion.span>
					))}
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default function ProjectList() {
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="dark:bg-black dark:text-white w-full bg-zinc-50 text-black min-h-screen">
			<div className="max-w-7xl mx-auto py-12 px-4 space-y-24">
				{projects.map((project, index) => (
					<ProjectCard key={index} project={project} index={index} />
				))}
			</div>
		</motion.div>
	);
}
