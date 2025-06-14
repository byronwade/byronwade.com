"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { Github, ExternalLink, Star, GitFork, Eye, Heart, Calendar, Code, Figma, Dribbble, ArrowRight, TrendingUp, Award, Users, Zap } from "lucide-react";
import { DribbbleShot } from "@/types/dribbble";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import Image from "next/image";
import { ClientImage } from "@/components/ui/client-image";

// Metadata moved to layout since this is now a client component

// Enable static generation with ISR
// export const revalidate = 3600; // 1 hour

// Dynamic portfolio stats function
// Icon mapping for portfolio stats
const iconMap: { [key: string]: any } = {
	Award,
	Github,
	Figma,
	Users,
};

const whyChoosePortfolio = [
	{
		icon: Code,
		title: "Full-Stack Expertise",
		description: "From frontend React applications to backend APIs and databases, I build complete solutions.",
		stat: "10+ technologies mastered",
	},
	{
		icon: Figma,
		title: "Design-First Approach",
		description: "Every project starts with thoughtful design, ensuring beautiful and functional user experiences.",
		stat: "Design systems created",
	},
	{
		icon: Github,
		title: "Open Source Contributor",
		description: "Active in the developer community with public repositories and contributions to open source.",
		stat: "Public repositories",
	},
	{
		icon: TrendingUp,
		title: "Performance Focused",
		description: "Optimized applications with fast load times, SEO best practices, and excellent user experience.",
		stat: "95+ PageSpeed scores",
	},
];

export default function PortfolioPage() {
	const [repos, setRepos] = useState<any[]>([]);
	const [shots, setShots] = useState<any[]>([]);
	const [figmaFiles, setFigmaFiles] = useState<any[]>([]);
	const [portfolioStats, setPortfolioStats] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				// Fetch data from API route instead of calling server functions directly
				const response = await fetch("/api/portfolio");
				if (!response.ok) {
					throw new Error("Failed to fetch portfolio data");
				}

				const data = await response.json();

				const reposData = data.repos.slice(0, 6);
				const shotsData = data.shots.slice(0, 6);
				const figmaData = data.figmaFiles.slice(0, 6);

				// Use portfolio stats from API response
				const portfolioStatsData = data.portfolioStats || [];

				setRepos(reposData);
				setShots(shotsData);
				setFigmaFiles(figmaData);
				setPortfolioStats(portfolioStatsData);
			} catch (error) {
				console.error("Error loading portfolio data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading portfolio...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<PageHeader title="Portfolio">
				<Link prefetch={true} href="https://github.com/byronwade" className="text-[#181717] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">GitHub</CodedText>
				</Link>
				<Link prefetch={true} href="https://dribbble.com/byronwade" className="text-[#ea4c89] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Dribbble</CodedText>
				</Link>
				<Link prefetch={true} href="https://figma.com/@byronwade" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Figma</CodedText>
				</Link>
			</PageHeader>

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<Award className="w-4 h-4 mr-2 text-yellow-600" />
							Featured Work
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Crafting Digital <span className="text-yellow-600">Experiences</span>
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">A curated collection of projects showcasing full-stack development, thoughtful design, and innovative solutions. From concept to deployment, see how I bring ideas to life.</p>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Code className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Full-Stack Development</span>
						</div>
						<div className="flex items-center gap-2">
							<Figma className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">UI/UX Design</span>
						</div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Performance Optimized</span>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
						{portfolioStats.map((stat: any, index: number) => {
							const IconComponent = iconMap[stat.icon] || Award;
							return (
								<Card key={index} className="text-center bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
									<CardContent className="p-6">
										<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
											<IconComponent className="w-6 h-6 text-yellow-600" />
										</div>
										<div className="text-3xl font-bold mb-2 text-foreground">{stat.number}</div>
										<div className="text-muted-foreground font-medium text-sm mb-2">{stat.label}</div>
										<Badge variant="outline" className="text-xs border-green-500/50 text-green-600">
											<TrendingUp className="w-3 h-3 mr-1" />
											{stat.trend}
										</Badge>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* GitHub Projects Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Development Projects</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Open source projects and applications built with modern technologies and best practices.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{repos.map((repo) => {
							const title = repo.name
								.split("-")
								.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ");

							return (
								<Card key={repo.id} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-lg text-foreground group-hover:text-yellow-600 transition-colors">
													<Link href={`/portfolio/github/${repo.name}`} className="hover:underline">
														{title}
													</Link>
												</CardTitle>
												<div className="flex items-center gap-3 text-sm text-muted-foreground">
													<div className="flex items-center gap-1">
														<Star className="w-3 h-3" />
														<span>{repo.stargazers_count}</span>
													</div>
													<div className="flex items-center gap-1">
														<GitFork className="w-3 h-3" />
														<span>{repo.forks_count}</span>
													</div>
													{repo.language && (
														<Badge variant="secondary" className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-500">
															{repo.language}
														</Badge>
													)}
												</div>
											</div>
											<Code className="w-5 h-5 text-yellow-600" />
										</div>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-muted-foreground text-sm mb-4 line-clamp-2">{repo.description || "No description available"}</p>

										{repo.topics && repo.topics.length > 0 && (
											<div className="flex flex-wrap gap-1 mb-4">
												{repo.topics.slice(0, 3).map((topic: string) => (
													<Badge key={topic} variant="outline" className="text-xs border-yellow-500/30 text-muted-foreground hover:border-yellow-500/60 hover:text-yellow-500 transition-colors">
														{topic}
													</Badge>
												))}
											</div>
										)}

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Button size="sm" variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
													<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
														<Github className="w-3 h-3 mr-1" />
														Code
													</a>
												</Button>
												{repo.homepage && (
													<Button size="sm" asChild className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
														<a href={repo.homepage} target="_blank" rel="noopener noreferrer">
															<ExternalLink className="w-3 h-3 mr-1" />
															Live
														</a>
													</Button>
												)}
											</div>
											<span className="text-xs text-muted-foreground">{new Date(repo.updated_at).toLocaleDateString()}</span>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
					<div className="text-center mt-12">
						<Button variant="outline" size="lg" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
							<a href="https://github.com/byronwade" target="_blank" rel="noopener noreferrer">
								<Github className="w-4 h-4 mr-2" />
								View All on GitHub
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Figma Projects Section */}
			{figmaFiles.length > 0 && (
				<section className="py-24 bg-secondary/10">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Design Systems & Prototypes</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Interactive prototypes and design systems built in Figma, showcasing component libraries and user flows.</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							{figmaFiles.map((file) => (
								<Card key={file.key} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 overflow-hidden">
									<div className="aspect-[4/3] relative overflow-hidden bg-secondary">
										<ClientImage src={file.thumbnail_url} alt={file.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
									</div>
									<CardHeader className="pb-2">
										<CardTitle className="text-lg text-foreground group-hover:text-yellow-600 transition-colors line-clamp-1">
											<Link href={`/portfolio/figma/${file.key}`} className="hover:underline">
												{file.name}
											</Link>
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Badge variant="secondary" className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-500">
													<Figma className="w-3 h-3 mr-1" />
													Figma
												</Badge>
											</div>
											<span className="text-xs text-muted-foreground">{new Date(file.last_modified).toLocaleDateString()}</span>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
						<div className="text-center mt-12">
							<Button variant="outline" size="lg" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
								<a href="https://figma.com/@byronwade" target="_blank" rel="noopener noreferrer">
									<Figma className="w-4 h-4 mr-2" />
									View All on Figma
								</a>
							</Button>
						</div>
					</div>
				</section>
			)}

			{/* Dribbble Design Projects Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Visual Design Shots</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Creative designs and visual concepts shared on Dribbble, showcasing artistic exploration and design trends.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{shots.map((shot) => (
							<Card key={shot.id} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 overflow-hidden">
								<div className="aspect-[4/3] relative overflow-hidden bg-secondary">
									<Image src={shot.images.normal || shot.images.teaser} alt={shot.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
								</div>
								<CardHeader className="pb-2">
									<CardTitle className="text-lg text-foreground group-hover:text-yellow-600 transition-colors line-clamp-1">
										<Link href={`/portfolio/dribbble/${shot.id}`} className="hover:underline">
											{shot.title}
										</Link>
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-500">
												<Dribbble className="w-3 h-3 mr-1" />
												Design
											</Badge>
											{shot.likes_count && (
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<Heart className="w-3 h-3" />
													<span>{shot.likes_count}</span>
												</div>
											)}
										</div>
										<span className="text-xs text-muted-foreground">{shot.published_at ? new Date(shot.published_at).toLocaleDateString() : "N/A"}</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="text-center mt-12">
						<Button variant="outline" size="lg" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
							<a href="https://dribbble.com/byronwade" target="_blank" rel="noopener noreferrer">
								<Dribbble className="w-4 h-4 mr-2" />
								View All on Dribbble
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Why Choose My Work Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Why My Work Stands Out</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Every project combines technical excellence with thoughtful design and user-centered thinking.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
						{whyChoosePortfolio.map((reason, index) => (
							<Card key={reason.title} className="text-center bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardContent className="p-8">
									<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-600/10 rounded-full">
										<reason.icon className="w-8 h-8 text-yellow-600" />
									</div>
									<h3 className="text-xl font-bold mb-4 text-foreground">{reason.title}</h3>
									<p className="text-muted-foreground leading-relaxed mb-4">{reason.description}</p>
									<Badge variant="outline" className="text-xs border-yellow-600/30 text-yellow-600">
										{reason.stat}
									</Badge>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
