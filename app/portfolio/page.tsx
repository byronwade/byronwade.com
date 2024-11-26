import { ExternalLink, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Using server-side data fetching for better performance
import { unstable_cache } from "next/cache";

const getProjects = unstable_cache(
	async () => {
		// This would typically fetch from a database or CMS
		return {
			clientProjects: [
				{
					title: "Lanier Plumbing Services",
					description: "A modern web platform for a plumbing business featuring service booking, emergency requests, and customer management.",
					technologies: ["Next.js 14", "TypeScript", "TanStack Query", "Tailwind CSS", "Stripe"],
					features: ["Online Booking", "Service Management", "Payment Integration", "Admin Dashboard"],
					link: "/lanier-plumbing-services",
					icon: "🔧",
					status: "under_development",
				},
				{
					title: "Impact Marine Service",
					description: "A modern web platform for a marine service business featuring boat maintenance scheduling, emergency repairs, and customer management.",
					technologies: ["Next.js 14", "TypeScript", "TanStack Query", "Tailwind CSS", "Stripe"],
					features: ["Online Scheduling", "Service Management", "Payment Integration", "Admin Dashboard"],
					link: "/impact-marine-service",
					icon: "⚓",
					status: "under_development",
				},
				{
					title: "Zugzology",
					description: "A modern e-commerce platform for a gourmet mushroom cultivation company featuring product ordering, grow kit tutorials, and subscription management.",
					technologies: ["Next.js 14", "TypeScript", "TanStack Query", "Tailwind CSS", "Stripe"],
					features: ["Online Store", "Subscription Service", "Growing Guides", "Admin Dashboard"],
					link: "/zugzology",
					icon: "🍄",
					status: "under_development",
				},
			],
			hobbyProjects: [
				{
					title: "Thorbis",
					description: "A comprehensive website orchestration platform designed for freelancers, business owners and agencies to streamline their web development workflow.",
					technologies: ["Next.js 14", "TanStack Query", "Prisma", "tRPC", "Stripe Connect"],
					features: ["Client Management", "Project Automation", "Team Collaboration", "Billing & Invoicing"],
					link: "https://thorbis.com",
					icon: "⚡",
					status: "under_development",
				},
				{
					title: "EmailMeWork",
					description: "A minimalist email-based lead platform that simplifies client communication and project inquiries through a streamlined email workflow.",
					technologies: ["Next.js 14", "TanStack Query", "Resend", "Prisma", "Stripe"],
					features: ["Email-Based Leads", "Automated Responses", "Simple Dashboard", "Lead Tracking"],
					link: "https://emailmework.com",
					icon: "📧",
					status: "under_development",
				},
			],
		};
	},
	["projects"],
	{
		revalidate: 3600, // Revalidate every hour
	}
);

const getStatusBadge = (status: string) => {
	const statusConfig = {
		under_development: {
			label: "Under Development",
			className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
		},
		live: {
			label: "Live",
			className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
		},
		maintenance: {
			label: "Maintenance",
			className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
		},
		archived: {
			label: "Archived",
			className: "bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20",
		},
	}[status] || { label: "Unknown", className: "bg-neutral-500/10 text-neutral-500" };

	return (
		<Badge variant="secondary" className={`${statusConfig.className} ml-2`}>
			{statusConfig.label}
		</Badge>
	);
};

const isExternalUrl = (url: string) => {
	return url.startsWith("http") || url.startsWith("https");
};

export default async function PortfolioPage() {
	const { clientProjects, hobbyProjects } = await getProjects();

	return (
		<div className="bg-zinc-50 dark:bg-[#121212] min-h-screen px-4 py-8 space-y-12">
			{/* Client Projects Section */}
			<section>
				<h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Client Projects</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{clientProjects.map((project, index) => (
						<Card key={index} className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
							<CardHeader className="flex justify-between items-center py-6 border-b border-zinc-200 dark:border-zinc-800">
								<div className="flex items-center">
									<div className="h-8 w-8 flex items-center justify-center text-2xl">{project.icon}</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 p-6">
								<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{project.title}</h2>
								<p className="text-zinc-500 dark:text-zinc-400 text-sm">{project.description}</p>
								<div className="flex flex-wrap gap-2">
									{project.technologies.map((tech, i) => (
										<Badge key={i} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
											{tech}
										</Badge>
									))}
								</div>
								<Separator className="bg-zinc-200 dark:bg-zinc-800" />
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-zinc-900 dark:text-white">Key Features:</h3>
									<ul className="space-y-1">
										{project.features.map((feature, i) => (
											<li key={i} className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
												<Check className="h-4 w-4 mr-2 text-green-500" />
												{feature}
											</li>
										))}
									</ul>
								</div>
							</CardContent>
							<CardFooter className="border-t border-zinc-200 dark:border-zinc-800 p-6 flex justify-between items-center">
								{isExternalUrl(project.link) ? (
									<a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
										View Project
										<ExternalLink className="h-4 w-4" />
									</a>
								) : (
									<Link prefetch={true} href={project.link} className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
										View Project
										<ExternalLink className="h-4 w-4" />
									</Link>
								)}
								{project.status && getStatusBadge(project.status)}
							</CardFooter>
						</Card>
					))}
				</div>
			</section>

			{/* Hobby Projects Section */}
			<section>
				<h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Hobby Projects</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{hobbyProjects.map((project, index) => (
						<Card key={index} className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
							<CardHeader className="flex justify-between items-center py-6 border-b border-zinc-200 dark:border-zinc-800">
								<div className="flex items-center">
									<div className="h-8 w-8 flex items-center justify-center text-2xl">{project.icon}</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 p-6">
								<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{project.title}</h2>
								<p className="text-zinc-500 dark:text-zinc-400 text-sm">{project.description}</p>
								<div className="flex flex-wrap gap-2">
									{project.technologies.map((tech, i) => (
										<Badge key={i} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
											{tech}
										</Badge>
									))}
								</div>
								<Separator className="bg-zinc-200 dark:bg-zinc-800" />
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-zinc-900 dark:text-white">Key Features:</h3>
									<ul className="space-y-1">
										{project.features.map((feature, i) => (
											<li key={i} className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
												<Check className="h-4 w-4 mr-2 text-green-500" />
												{feature}
											</li>
										))}
									</ul>
								</div>
							</CardContent>
							<CardFooter className="border-t border-zinc-200 dark:border-zinc-800 p-6 flex justify-between items-center">
								{isExternalUrl(project.link) ? (
									<a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
										View Project
										<ExternalLink className="h-4 w-4" />
									</a>
								) : (
									<Link prefetch={true} href={project.link} className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
										View Project
										<ExternalLink className="h-4 w-4" />
									</Link>
								)}
								{project.status && getStatusBadge(project.status)}
							</CardFooter>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
