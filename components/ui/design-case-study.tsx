"use client";

import {
	CheckCircle,
	Clock,
	Code,
	Eye,
	Heart,
	Lightbulb,
	MessageCircle,
	Palette,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CaseStudySection {
	content: string;
	icon?: React.ReactNode;
	title: string;
}

interface DesignMetrics {
	comments?: number;
	downloads?: number;
	likes?: number;
	shares?: number;
	views?: number;
}

interface TechnicalDetails {
	challenges?: string[];
	duration: string;
	solutions?: string[];
	team?: string[];
	techniques: string[];
	tools: string[];
}

interface DesignCaseStudyProps {
	challenge?: string;
	className?: string;
	colors?: string[];
	description: string;
	metrics?: DesignMetrics;
	process?: CaseStudySection[];
	results?: string[];
	solution?: string;
	tags?: string[];
	technical?: TechnicalDetails;
	testimonial?: {
		quote: string;
		author: string;
		role?: string;
	};
	title: string;
}

export function DesignCaseStudy({
	title,
	description,
	challenge,
	solution,
	process = [],
	results = [],
	metrics,
	technical,
	colors = [],
	tags = [],
	testimonial,
	className,
}: DesignCaseStudyProps) {
	const defaultProcess: CaseStudySection[] = [
		{
			title: "Research & Discovery",
			content:
				"Understanding user needs, market research, and competitive analysis to inform design decisions.",
			icon: <Users className="h-5 w-5" />,
		},
		{
			title: "Ideation & Concepts",
			content:
				"Brainstorming sessions, sketching initial concepts, and exploring different design directions.",
			icon: <Lightbulb className="h-5 w-5" />,
		},
		{
			title: "Design & Iteration",
			content:
				"Creating high-fidelity designs, gathering feedback, and iterating based on user testing.",
			icon: <Palette className="h-5 w-5" />,
		},
		{
			title: "Implementation",
			content: "Working with developers to ensure design integrity and optimal user experience.",
			icon: <Code className="h-5 w-5" />,
		},
	];

	const processSteps = process.length > 0 ? process : defaultProcess;

	return (
		<div className={cn("space-y-8", className)}>
			{/* Header */}
			<div className="space-y-4 text-center">
				<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
					Case Study
				</p>
				<h2 className="font-bold text-3xl text-foreground">{title}</h2>
				<p className="mx-auto max-w-3xl text-lg text-muted-foreground">{description}</p>
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
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{challenge && (
							<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<Target className="h-5 w-5 text-brand" />
										The Challenge
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{challenge}</p>
								</CardContent>
							</Card>
						)}

						{solution && (
							<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<CheckCircle className="h-5 w-5 text-green-600" />
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
						<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<TrendingUp className="h-5 w-5 text-brand" />
									Project Impact
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
									{metrics.views && (
										<div className="text-center">
											<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
												<Eye className="h-6 w-6 text-brand" />
											</div>
											<div className="font-bold text-2xl text-foreground">
												{metrics.views.toLocaleString()}
											</div>
											<div className="text-muted-foreground text-sm">Views</div>
										</div>
									)}
									{metrics.likes && (
										<div className="text-center">
											<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
												<Heart className="h-6 w-6 text-red-500" />
											</div>
											<div className="font-bold text-2xl text-foreground">
												{metrics.likes.toLocaleString()}
											</div>
											<div className="text-muted-foreground text-sm">Likes</div>
										</div>
									)}
									{metrics.comments && (
										<div className="text-center">
											<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
												<MessageCircle className="h-6 w-6 text-brand" />
											</div>
											<div className="font-bold text-2xl text-foreground">
												{metrics.comments.toLocaleString()}
											</div>
											<div className="text-muted-foreground text-sm">Comments</div>
										</div>
									)}
									{metrics.shares && (
										<div className="text-center">
											<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
												<TrendingUp className="h-6 w-6 text-green-500" />
											</div>
											<div className="font-bold text-2xl text-foreground">
												{metrics.shares.toLocaleString()}
											</div>
											<div className="text-muted-foreground text-sm">Shares</div>
										</div>
									)}
									{metrics.downloads && (
										<div className="text-center">
											<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
												<Zap className="h-6 w-6 text-brand" />
											</div>
											<div className="font-bold text-2xl text-foreground">
												{metrics.downloads.toLocaleString()}
											</div>
											<div className="text-muted-foreground text-sm">Downloads</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Color Palette */}
					{colors.length > 0 && (
						<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<Palette className="h-5 w-5 text-brand" />
									Color Palette
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-4">
									{colors.map((color) => (
										<div key={color} className="flex items-center gap-3">
											<div
												className="h-12 w-12 rounded-lg border border-border shadow-sm"
												style={{ backgroundColor: color }}
											/>
											<div>
												<div className="font-mono text-foreground text-sm">{color}</div>
												<div className="text-muted-foreground text-xs">
													{color.startsWith("#") ? "HEX" : "RGB"}
												</div>
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
								<Badge
									key={tag}
									variant="secondary"
									className="border border-brand/30 bg-brand/10 text-brand transition-colors hover:bg-brand/20"
								>
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
							<Card
								key={step.title}
								className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl"
							>
								<CardHeader>
									<CardTitle className="flex items-center gap-3 text-foreground">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 font-bold text-brand text-sm">
											{index + 1}
										</div>
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
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{/* Tools & Duration */}
							<div className="space-y-6">
								<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-foreground">
											<Code className="h-5 w-5 text-brand" />
											Tools Used
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{technical.tools.map((tool) => (
												<Badge key={tool} variant="outline" className="border-brand/30 text-brand">
													{tool}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>

								<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-foreground">
											<Clock className="h-5 w-5 text-brand" />
											Project Duration
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-semibold text-foreground text-lg">{technical.duration}</p>
									</CardContent>
								</Card>
							</div>

							{/* Techniques & Team */}
							<div className="space-y-6">
								{technical.techniques.length > 0 && (
									<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-foreground">
												<Zap className="h-5 w-5 text-brand" />
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
									<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-foreground">
												<Users className="h-5 w-5 text-brand" />
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
						<Card className="border-border/30 bg-secondary/50 transition-all duration-300 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-foreground">
									<TrendingUp className="h-5 w-5 text-brand" />
									Key Results
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{results.map((result) => (
										<div key={result} className="flex items-start gap-3">
											<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
											<p className="text-muted-foreground">{result}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Testimonial */}
					{testimonial && (
						<Card className="border-brand/20 bg-gradient-to-br from-brand/5 to-brand/10 transition-all duration-300 hover:shadow-xl">
							<CardContent className="p-8">
								<blockquote className="mb-4 text-foreground text-lg italic">
									"{testimonial.quote}"
								</blockquote>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-semibold text-foreground">{testimonial.author}</div>
										{testimonial.role && (
											<div className="text-muted-foreground text-sm">{testimonial.role}</div>
										)}
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
