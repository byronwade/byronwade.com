"use client";

import { motion } from "framer-motion";
import { Code, Database, Globe, Palette, Server, Zap, Cloud, Lock, Smartphone, Cpu, ExternalLink, Star, TrendingUp, Users, Award, CheckCircle, ArrowRight, Layers, Terminal, GitBranch, Package, Monitor, Wrench, Shield, Rocket } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroPages from "@/components/sections/hero-pages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const toolCategories = [
	{
		title: "Frontend Development",
		description: "Modern frameworks and libraries for building exceptional user interfaces",
		icon: Monitor,
		color: "from-blue-500 to-cyan-500",
		tools: [
			{
				name: "Next.js 15",
				icon: Globe,
				description: "The React framework for production with App Router, Server Components, and edge runtime.",
				url: "https://nextjs.org/",
				level: "Expert",
				experience: "4+ years",
				features: ["App Router", "Server Components", "Edge Runtime", "Turbopack"],
			},
			{
				name: "React 18",
				icon: Code,
				description: "Modern React with Hooks, Suspense, Concurrent Features, and Server Components.",
				url: "https://reactjs.org/",
				level: "Expert",
				experience: "5+ years",
				features: ["Hooks", "Suspense", "Concurrent Mode", "Server Components"],
			},
			{
				name: "TypeScript",
				icon: Terminal,
				description: "Strongly typed JavaScript for better development experience and code quality.",
				url: "https://www.typescriptlang.org/",
				level: "Expert",
				experience: "4+ years",
				features: ["Type Safety", "IntelliSense", "Refactoring", "Modern JS"],
			},
			{
				name: "Tailwind CSS",
				icon: Palette,
				description: "Utility-first CSS framework for rapid UI development with modern design systems.",
				url: "https://tailwindcss.com/",
				level: "Expert",
				experience: "3+ years",
				features: ["Utility Classes", "Responsive Design", "Dark Mode", "Custom Themes"],
			},
		],
	},
	{
		title: "Backend & Database",
		description: "Scalable server-side technologies and data management solutions",
		icon: Server,
		color: "from-green-500 to-emerald-500",
		tools: [
			{
				name: "Node.js",
				icon: Server,
				description: "JavaScript runtime for building scalable server-side applications and APIs.",
				url: "https://nodejs.org/",
				level: "Expert",
				experience: "5+ years",
				features: ["Express.js", "Fastify", "API Development", "Microservices"],
			},
			{
				name: "Bun",
				icon: Zap,
				description: "Ultra-fast JavaScript runtime, bundler, and package manager built for speed.",
				url: "https://bun.sh/",
				level: "Advanced",
				experience: "1+ year",
				features: ["Fast Runtime", "Built-in Bundler", "Package Manager", "TypeScript Support"],
			},
			{
				name: "PostgreSQL",
				icon: Database,
				description: "Advanced open-source relational database with powerful features and performance.",
				url: "https://www.postgresql.org/",
				level: "Advanced",
				experience: "3+ years",
				features: ["ACID Compliance", "JSON Support", "Full-text Search", "Extensions"],
			},
			{
				name: "Prisma",
				icon: Layers,
				description: "Next-generation ORM for Node.js and TypeScript with type-safe database access.",
				url: "https://www.prisma.io/",
				level: "Advanced",
				experience: "2+ years",
				features: ["Type Safety", "Auto-generated Client", "Database Migrations", "Query Builder"],
			},
		],
	},
	{
		title: "Cloud & Infrastructure",
		description: "Modern deployment platforms and infrastructure management tools",
		icon: Cloud,
		color: "from-purple-500 to-pink-500",
		tools: [
			{
				name: "Vercel",
				icon: Rocket,
				description: "The platform for frontend developers with global edge network and serverless functions.",
				url: "https://vercel.com/",
				level: "Expert",
				experience: "3+ years",
				features: ["Edge Network", "Serverless Functions", "Preview Deployments", "Analytics"],
			},
			{
				name: "AWS",
				icon: Cloud,
				description: "Comprehensive cloud platform with compute, storage, database, and AI services.",
				url: "https://aws.amazon.com/",
				level: "Advanced",
				experience: "2+ years",
				features: ["EC2", "S3", "RDS", "Lambda", "CloudFront"],
			},
			{
				name: "Docker",
				icon: Package,
				description: "Containerization platform for consistent development and deployment environments.",
				url: "https://www.docker.com/",
				level: "Advanced",
				experience: "2+ years",
				features: ["Containerization", "Multi-stage Builds", "Docker Compose", "Orchestration"],
			},
			{
				name: "GitHub Actions",
				icon: GitBranch,
				description: "CI/CD platform for automating workflows, testing, and deployment processes.",
				url: "https://github.com/features/actions",
				level: "Advanced",
				experience: "3+ years",
				features: ["CI/CD", "Automated Testing", "Deployment", "Workflow Automation"],
			},
		],
	},
	{
		title: "Development Tools",
		description: "Essential tools and utilities for modern development workflows",
		icon: Wrench,
		color: "from-orange-500 to-red-500",
		tools: [
			{
				name: "VS Code",
				icon: Code,
				description: "Powerful code editor with extensive extensions and integrated development features.",
				url: "https://code.visualstudio.com/",
				level: "Expert",
				experience: "5+ years",
				features: ["IntelliSense", "Debugging", "Extensions", "Git Integration"],
			},
			{
				name: "Git",
				icon: GitBranch,
				description: "Distributed version control system for tracking changes and collaboration.",
				url: "https://git-scm.com/",
				level: "Expert",
				experience: "6+ years",
				features: ["Version Control", "Branching", "Merging", "Collaboration"],
			},
			{
				name: "ESLint",
				icon: Shield,
				description: "Static analysis tool for identifying and fixing problems in JavaScript code.",
				url: "https://eslint.org/",
				level: "Expert",
				experience: "4+ years",
				features: ["Code Quality", "Style Enforcement", "Error Prevention", "Custom Rules"],
			},
			{
				name: "Prettier",
				icon: Palette,
				description: "Opinionated code formatter for consistent code style across projects.",
				url: "https://prettier.io/",
				level: "Expert",
				experience: "4+ years",
				features: ["Code Formatting", "Style Consistency", "Editor Integration", "Team Standards"],
			},
		],
	},
];

const getLevelColor = (level: string) => {
	switch (level) {
		case "Expert":
			return "bg-green-600 text-white";
		case "Advanced":
			return "bg-blue-600 text-white";
		case "Intermediate":
			return "bg-yellow-600 text-white";
		default:
			return "bg-gray-600 text-white";
	}
};

const ToolCard = ({ tool, categoryColor }: { tool: (typeof toolCategories)[0]["tools"][0]; categoryColor: string }) => {
	const Icon = tool.icon;
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ y: -5 }}>
			<Card className="h-full flex flex-col group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between mb-3">
						<div className={`p-3 rounded-lg bg-gradient-to-br ${categoryColor} bg-opacity-10`}>
							<Icon className="h-6 w-6 text-yellow-600" />
						</div>
						<Badge className={getLevelColor(tool.level)} variant="secondary">
							{tool.level}
						</Badge>
					</div>
					<CardTitle className="text-xl font-bold text-foreground group-hover:text-yellow-600 transition-colors">{tool.name}</CardTitle>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<TrendingUp className="w-4 h-4" />
						<span>{tool.experience}</span>
					</div>
				</CardHeader>
				<CardContent className="flex-grow space-y-4">
					<p className="text-muted-foreground leading-relaxed">{tool.description}</p>

					{/* Features */}
					<div className="space-y-2">
						<h4 className="text-sm font-semibold text-foreground">Key Features:</h4>
						<div className="flex flex-wrap gap-1">
							{tool.features.map((feature) => (
								<Badge key={feature} variant="outline" className="text-xs border-yellow-600/30 text-yellow-600">
									{feature}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
				<div className="p-6 pt-0">
					<Button asChild variant="outline" className="w-full border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-black transition-colors">
						<Link href={tool.url} target="_blank" rel="noopener noreferrer">
							Learn More
							<ExternalLink className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</Card>
		</motion.div>
	);
};

const CategoryHeader = ({ category }: { category: (typeof toolCategories)[0] }) => {
	const Icon = category.icon;
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
			<div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} bg-opacity-10 mb-6`}>
				<Icon className="h-8 w-8 text-yellow-600" />
			</div>
			<h2 className="text-3xl font-bold text-foreground mb-4">{category.title}</h2>
			<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{category.description}</p>
		</motion.div>
	);
};

export default function ToolsPage() {
	return (
		<>
			<HeroPages title="Developer Tools" subtitle="Modern Technology Stack" />
			<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
				<div className="container mx-auto px-4 py-24">
					{/* Hero Section */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
						<div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30 mb-8">
							<Cpu className="w-4 h-4 mr-2 text-yellow-600" />
							Modern Technology Stack
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-8">
							Tools That Power <span className="text-yellow-600">Innovation</span>
						</h1>
						<p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">I leverage cutting-edge technologies and proven tools to build scalable, performant, and maintainable solutions. Here&apos;s the comprehensive stack that drives exceptional results.</p>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
							<Card className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6 text-center">
									<div className="text-2xl font-bold text-yellow-600 mb-1">25+</div>
									<div className="text-sm text-muted-foreground">Technologies</div>
								</CardContent>
							</Card>
							<Card className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6 text-center">
									<div className="text-2xl font-bold text-yellow-600 mb-1">6+</div>
									<div className="text-sm text-muted-foreground">Years Experience</div>
								</CardContent>
							</Card>
							<Card className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6 text-center">
									<div className="text-2xl font-bold text-yellow-600 mb-1">100+</div>
									<div className="text-sm text-muted-foreground">Projects Built</div>
								</CardContent>
							</Card>
							<Card className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6 text-center">
									<div className="text-2xl font-bold text-yellow-600 mb-1">24/7</div>
									<div className="text-sm text-muted-foreground">Always Learning</div>
								</CardContent>
							</Card>
						</div>
					</motion.div>

					{/* Tool Categories */}
					<div className="space-y-24">
						{toolCategories.map((category, index) => (
							<motion.div key={category.title} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
								<CategoryHeader category={category} />
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
									{category.tools.map((tool) => (
										<ToolCard key={tool.name} tool={tool} categoryColor={category.color} />
									))}
								</div>
							</motion.div>
						))}
					</div>

					{/* CTA Section */}
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-center mt-24 py-16 bg-secondary/30 rounded-2xl border border-border/30">
						<h3 className="text-3xl font-bold text-foreground mb-6">Ready to Build Something Amazing?</h3>
						<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">Let&apos;s leverage these powerful technologies to bring your vision to life. Every project is an opportunity to create something extraordinary.</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
								<Link href="/contact">
									<Rocket className="mr-2 h-5 w-5" />
									Start Your Project
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-black">
								<Link href="/portfolio">
									<Star className="mr-2 h-5 w-5" />
									View My Work
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</>
	);
}
