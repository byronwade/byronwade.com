"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Github, ExternalLink, BarChart } from "lucide-react";

interface PortfolioProject {
	id: number;
	year: string;
	title: string;
	description: string;
	image: string;
	url?: string;
	github?: string;
	analysis?: string;
	category?: string;
}

const projects: PortfolioProject[] = [
	{
		id: 1,
		year: "2023",
		title: "rebuzzle.byronwade.com",
		description: "My personal website, built with Next.js, Tailwind CSS, and Framer Motion.",
		image: "https://placehold.co/1200x800",
		url: "https://rebuzzle.byronwade.com",
		github: "https://github.com/username/rebuzzle",
		analysis: "/analysis/rebuzzle",
		category: "Personal Projects",
	},
	{
		id: 2,
		year: "2023",
		title: "wadesplumbingandseptic.com",
		description: "My plumbing and septic business website, built with Next.js, Tailwind CSS, and Framer Motion.",
		image: "https://placehold.co/1200x800",
		url: "https://wadesplumbingandseptic.com",
		github: "https://github.com/username/wadesplumbingandseptic",
		analysis: "/analysis/wadesplumbingandseptic",
		category: "Client Work",
	},
	{
		id: 3,
		year: "2023",
		title: "reacpress.io",
		description: "A simple, fast, and fun way to generate greeting cards with AI. (Go make carrrds!)",
		image: "https://placehold.co/1200x800",
		url: "https://carrrd.com",
		category: "Side Projects",
	},
	{
		id: 4,
		year: "2022",
		title: "NV /",
		description: 'My first try at writing shaders, using the Frame Buffer Object technique to animate lots of particles. A project to explore Chinese characters that have "女" (woman) in them as a component.',
		image: "https://placehold.co/1200x800",
		url: "https://nv.com",
		github: "https://github.com/username/nv",
		category: "Experiments",
	},
];

const PortfolioProjectCard = ({ project }: { project: PortfolioProject }) => {
	return (
		<motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-100px" }} className="bg-zinc-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:flex lg:items-center lg:justify-between">
					<div className="lg:w-1/2 pr-8">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-3xl font-extrabold text-black dark:text-white">{project.title}</h2>
							<span className="text-2xl font-bold text-gray-400 dark:text-gray-600">#{project.id}</span>
						</div>
						<div className="flex items-center gap-4 mb-4">
							<span className="text-sm text-gray-500 dark:text-gray-400">/{project.year}</span>
							<span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
								<Tag className="w-4 h-4" />
								{project.category}
							</span>
						</div>
						<p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
						<div className="flex flex-wrap gap-4">
							{project.url && (
								<Link href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-zinc-50 dark:hover:bg-gray-200 transition-colors duration-150 ease-in-out">
									Visit Project
									<ExternalLink className="ml-2 h-5 w-5" />
								</Link>
							)}
							{project.github && (
								<Link href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-black bg-zinc-50 hover:bg-gray-100 dark:text-white dark:bg-black dark:hover:bg-gray-900 transition-colors duration-150 ease-in-out">
									<Github className="mr-2 h-5 w-5" />
									View Code
								</Link>
							)}
							{project.analysis && (
								<Link href={project.analysis} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-black bg-zinc-50 hover:bg-gray-100 dark:text-white dark:bg-black dark:hover:bg-gray-900 transition-colors duration-150 ease-in-out">
									<BarChart className="mr-2 h-5 w-5" />
									View Analysis
								</Link>
							)}
						</div>
					</div>
					<div className="mt-10 lg:mt-0 lg:w-1/2">
						<div className="relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
							<Image src={project.image} alt={`${project.title} preview`} width={1200} height={800} layout="responsive" className="object-cover" quality={90} />
							<div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
								<span className="text-white text-xl font-semibold">View Project</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default function PortfolioProjectList() {
	return (
		<div className="bg-zinc-50 dark:bg-black text-black dark:text-white min-h-screen">
			<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-extrabold text-center mb-16">My Portfolio</h1>
				<div className="space-y-24">
					{projects.map((project) => (
						<PortfolioProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
		</div>
	);
}

