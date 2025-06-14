"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, Lightbulb, Palette, Code, TrendingUp, CheckCircle, Clock, Zap, Heart, Eye, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudySection {
	title: string;
	content: string;
	icon?: React.ReactNode;
}

interface DesignMetrics {
	views?: number;
	likes?: number;
	comments?: number;
	shares?: number;
	downloads?: number;
}

interface TechnicalDetails {
	tools: string[];
	techniques: string[];
	duration: string;
	team?: string[];
	challenges?: string[];
	solutions?: string[];
}

interface DesignCaseStudyProps {
	title: string;
	description: string;
	challenge?: string;
	solution?: string;
	process?: CaseStudySection[];
	results?: string[];
	metrics?: DesignMetrics;
	technical?: TechnicalDetails;
	colors?: string[];
	tags?: string[];
	testimonial?: {
		quote: string;
		author: string;
		role?: string;
	};
	className?: string;
}

export function DesignCaseStudy({ title, description, challenge, solution, process = [], results = [], metrics, technical, colors = [], tags = [], testimonial, className }: DesignCaseStudyProps) {
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

	const toggleSection = (sectionId: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
		} else {
			newExpanded.add(sectionId);
		}
		setExpandedSections(newExpanded);
	};

	const defaultProcess: CaseStudySection[] = [
		{
			title: "Research & Discovery",
			content: "Understanding user needs, market research, and competitive analysis to inform design decisions.",
			icon: <Users className="w-5 h-5" />,
		},
		{
			title: "Ideation & Concepts",
			content: "Brainstorming sessions, sketching initial concepts, and exploring different design directions.",
			icon: <Lightbulb className="w-5 h-5" />,
		},
		{
			title: "Design & Iteration",
			content: "Creating high-fidelity designs, gathering feedback, and iterating based on user testing.",
			icon: <Palette className="w-5 h-5" />,
		},
		{
			title: "Implementation",
			content: "Working with developers to ensure design integrity and optimal user experience.",
			icon: <Code className="w-5 h-5" />,
		},
	];

	const processSteps = process.length > 0 ? process : defaultProcess;

	return (
		<div className={cn("space-y-8", className)}>
			{/* Header */}
			<div className="text-center space-y-4">
				<h2 className="text-3xl font-bold text-foreground">Case Study</h2>
				<p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="process">Process</TabsTrigger>
					<TabsTrigger value="technical">Technical</TabsTrigger>
					<TabsTrigger value="results">Results</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{/* Challenge & Solution */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{challenge && (
							<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<Target className="w-5 h-5 text-yellow-600" />
										The Challenge
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{challenge}</p>
								</CardContent>
							</Card>
						)}

						{solution && (
							<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<CheckCircle className="w-5 h-5 text-green-600" />
										The Solution
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{solution}</p>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Metrics */}
					{metrics && (
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<TrendingUp className="w-5 h-5 text-yellow-600" />
									Project Impact
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
									{metrics.views && (
										<div className="text-center">
											<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mx-auto mb-2">
												<Eye className="w-6 h-6 text-yellow-600" />
											</div>
											<div className="text-2xl font-bold text-foreground">{metrics.views.toLocaleString()}</div>
											<div className="text-sm text-muted-foreground">Views</div>
										</div>
									)}
									{metrics.likes && (
										<div className="text-center">
											<div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-lg mx-auto mb-2">
												<Heart className="w-6 h-6 text-red-500" />
											</div>
											<div className="text-2xl font-bold text-foreground">{metrics.likes.toLocaleString()}</div>
											<div className="text-sm text-muted-foreground">Likes</div>
										</div>
									)}
									{metrics.comments && (
										<div className="text-center">
											<div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-2">
												<MessageCircle className="w-6 h-6 text-blue-500" />
											</div>
											<div className="text-2xl font-bold text-foreground">{metrics.comments.toLocaleString()}</div>
											<div className="text-sm text-muted-foreground">Comments</div>
										</div>
									)}
									{metrics.shares && (
										<div className="text-center">
											<div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-2">
												<TrendingUp className="w-6 h-6 text-green-500" />
											</div>
											<div className="text-2xl font-bold text-foreground">{metrics.shares.toLocaleString()}</div>
											<div className="text-sm text-muted-foreground">Shares</div>
										</div>
									)}
									{metrics.downloads && (
										<div className="text-center">
											<div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mx-auto mb-2">
												<Zap className="w-6 h-6 text-purple-500" />
											</div>
											<div className="text-2xl font-bold text-foreground">{metrics.downloads.toLocaleString()}</div>
											<div className="text-sm text-muted-foreground">Downloads</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Color Palette */}
					{colors.length > 0 && (
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<Palette className="w-5 h-5 text-yellow-600" />
									Color Palette
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-4">
									{colors.map((color, index) => (
										<div key={index} className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-lg border border-border shadow-sm" style={{ backgroundColor: color }} />
											<div>
												<div className="font-mono text-sm text-foreground">{color}</div>
												<div className="text-xs text-muted-foreground">{color.startsWith("#") ? "HEX" : "RGB"}</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Tags */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 hover:bg-yellow-600/20 transition-colors">
									{tag}
								</Badge>
							))}
						</div>
					)}
				</TabsContent>

				{/* Process Tab */}
				<TabsContent value="process" className="space-y-6">
					<div className="space-y-4">
						{processSteps.map((step, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-3 text-foreground">
										<div className="flex items-center justify-center w-8 h-8 bg-yellow-600/10 rounded-full text-yellow-600 text-sm font-bold">{index + 1}</div>
										{step.icon}
										{step.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{step.content}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Technical Tab */}
				<TabsContent value="technical" className="space-y-6">
					{technical && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Tools & Duration */}
							<div className="space-y-6">
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-foreground">
											<Code className="w-5 h-5 text-yellow-600" />
											Tools Used
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{technical.tools.map((tool) => (
												<Badge key={tool} variant="outline" className="border-yellow-600/30 text-yellow-600">
													{tool}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>

								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-foreground">
											<Clock className="w-5 h-5 text-yellow-600" />
											Project Duration
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-lg font-semibold text-foreground">{technical.duration}</p>
									</CardContent>
								</Card>
							</div>

							{/* Techniques & Team */}
							<div className="space-y-6">
								{technical.techniques.length > 0 && (
									<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-foreground">
												<Zap className="w-5 h-5 text-yellow-600" />
												Techniques
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-2">
												{technical.techniques.map((technique) => (
													<Badge key={technique} variant="secondary">
														{technique}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{technical.team && technical.team.length > 0 && (
									<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-foreground">
												<Users className="w-5 h-5 text-yellow-600" />
												Team
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{technical.team.map((member) => (
													<div key={member} className="text-muted-foreground">
														{member}
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					)}
				</TabsContent>

				{/* Results Tab */}
				<TabsContent value="results" className="space-y-6">
					{/* Results List */}
					{results.length > 0 && (
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<TrendingUp className="w-5 h-5 text-yellow-600" />
									Key Results
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{results.map((result, index) => (
										<div key={index} className="flex items-start gap-3">
											<CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
											<p className="text-muted-foreground">{result}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Testimonial */}
					{testimonial && (
						<Card className="bg-gradient-to-br from-yellow-600/5 to-yellow-600/10 border-yellow-600/20 hover:shadow-xl transition-all duration-300">
							<CardContent className="p-8">
								<blockquote className="text-lg italic text-foreground mb-4">"{testimonial.quote}"</blockquote>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-semibold text-foreground">{testimonial.author}</div>
										{testimonial.role && <div className="text-sm text-muted-foreground">{testimonial.role}</div>}
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
