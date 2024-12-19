import Link from "next/link";
import { ExternalLink, ArrowRight, TrendingUp, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const analyses = [
	{
		id: 341,
		clientName: "Santa Cruz Surf School",
		description: "Redesigned and optimized the website for a local surf school, improving user experience and SEO.",
		technologies: ["Next.js", "Tailwind CSS", "Vercel"],
		improvements: ["70% faster load time", "Mobile-responsive design", "Online booking integration", "SEO optimization"],
		originalUrl: "https://old-santacruzsurfschool.com",
		newUrl: "https://www.santacruzsurfschool.com",
		metrics: {
			performanceIncrease: 70,
			completionTime: 3,
			clientSatisfaction: 4.9,
		},
	},
	{
		id: 342,
		clientName: "Coastal Eats Restaurant",
		description: "Developed a modern, performance-focused website for a popular local restaurant, enhancing online presence.",
		technologies: ["SvelteKit", "Shopify", "Cloudflare"],
		improvements: ["Online ordering system", "Real-time menu updates", "95/100 PageSpeed score", "Reservation integration"],
		originalUrl: "https://old-coastaleats.com",
		newUrl: "https://www.coastaleatssc.com",
		metrics: {
			performanceIncrease: 95,
			completionTime: 4,
			clientSatisfaction: 5.0,
		},
	},
	{
		id: 343,
		clientName: "Pacific Grove Yoga Studio",
		description: "Created a serene and functional website for a yoga studio, focusing on class schedules and online bookings.",
		technologies: ["Next.js", "Supabase", "Stripe"],
		improvements: ["Class booking system", "Membership portal", "Virtual class integration", "Newsletter signup"],
		originalUrl: "https://old-pacificgroveyoga.com",
		newUrl: "https://www.pgroveyoga.com",
		metrics: {
			performanceIncrease: 85,
			completionTime: 2,
			clientSatisfaction: 4.8,
		},
	},
];

export default function Component() {
	return (
		<div className="max-w-7xl mx-auto py-12 px-4 space-y-24">
			<h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">300 of a planned 567 Analyses Completed</h1>
			{analyses.map((analysis) => (
				<Card key={analysis.id} className="bg-zinc-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
					<div className="flex flex-col lg:flex-row">
						<CardHeader className="lg:w-1/4 lg:border-r lg:border-neutral-200 dark:lg:border-neutral-700">
							<div className="space-y-1">
								<p className="text-sm text-neutral-500 dark:text-neutral-400">Analysis #{analysis.id}</p>
								<h2 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-100">{analysis.clientName}</h2>
							</div>
							<p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">{analysis.description}</p>
							<div className="flex flex-wrap gap-2 mt-2">
								{analysis.technologies.map((tech, techIndex) => (
									<Badge key={techIndex} variant="secondary" className="bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
										{tech}
									</Badge>
								))}
							</div>
						</CardHeader>
						<CardContent className="lg:w-3/4 p-6 space-y-6 lg:space-y-0 lg:flex lg:space-x-6">
							<div className="lg:w-1/3 space-y-2">
								<h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Key Improvements</h3>
								<ul className="space-y-1">
									{analysis.improvements.map((improvement, improvementIndex) => (
										<li key={improvementIndex} className="flex items-center text-neutral-600 dark:text-neutral-300 text-sm">
											<ArrowRight className="h-3 w-3 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
											<span>{improvement}</span>
										</li>
									))}
								</ul>
							</div>
							<div className="lg:w-1/3 space-y-2">
								<h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100 mb-2">Website Comparison</h3>
								<div className="space-y-2">
									<Button variant="secondary" className="w-full justify-start bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600" asChild>
										<a href={analysis.originalUrl} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-4 w-4 mr-2" />
											Original Website
										</a>
									</Button>
									<Button variant="outline" className="w-full justify-start border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700" asChild>
										<a href={analysis.newUrl} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-4 w-4 mr-2" />
											New Website
										</a>
									</Button>
								</div>
							</div>
							<div className="lg:w-1/3 space-y-4">
								<h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Project Metrics</h3>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
											<TrendingUp className="h-4 w-4 mr-2 text-green-500" />
											Performance Increase
										</span>
										<span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{analysis.metrics.performanceIncrease}%</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
											<Clock className="h-4 w-4 mr-2 text-blue-500" />
											Completion Time
										</span>
										<span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{analysis.metrics.completionTime} weeks</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
											<Star className="h-4 w-4 mr-2 text-yellow-500" />
											Client Satisfaction
										</span>
										<span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{analysis.metrics.clientSatisfaction}/5.0</span>
									</div>
								</div>
								<Button variant="link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 mt-4">
									<Link prefetch={true} className="flex items-center" href={`/analysis/${analysis.id}`}>
										View Full Analysis
										<ArrowRight className="h-4 w-4 ml-2" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</div>
				</Card>
			))}
		</div>
	);
}
