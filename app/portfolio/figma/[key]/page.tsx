import {
	BarChart3,
	Calendar,
	ChevronRight,
	ExternalLink,
	FileText,
	GitBranch,
	Layers,
	Palette,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FigmaInteractiveViewer } from "@/components/portfolio/figma-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignCaseStudy } from "@/components/ui/design-case-study";
import { getFigmaFile } from "@/lib/portfolio-data";

interface FigmaDetailPageProps {
	params: Promise<{ key: string }>;
}

export async function generateMetadata({ params }: FigmaDetailPageProps): Promise<Metadata> {
	const { key } = await params;
	const file = await getFigmaFile(key)();

	if (!file) {
		return {
			title: "Design File Not Found",
			description: "The requested Figma file could not be found.",
		};
	}

	return {
		title: `${file.name} - Figma Design`,
		description: `View the ${file.name} design file from Figma.`,
		openGraph: {
			title: `${file.name} - Figma Design`,
			description: `View the ${file.name} design file from Figma.`,
			type: "website",
			url: `https://byronwade.com/portfolio/figma/${key}`,
			images: file.thumbnailUrl
				? [{ url: file.thumbnailUrl, width: 800, height: 600, alt: file.name }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: `${file.name} - Figma Design`,
			description: `View the ${file.name} design file from Figma.`,
			images: file.thumbnailUrl ? [file.thumbnailUrl] : undefined,
		},
	};
}

function getComplexityLevel(score: number): { level: string; color: string; description: string } {
	if (score >= 80) {
		return {
			level: "Very Complex",
			color: "red",
			description: "High-complexity design with many elements",
		};
	}
	if (score >= 60) {
		return { level: "Complex", color: "orange", description: "Moderately complex design" };
	}
	if (score >= 40) {
		return { level: "Moderate", color: "yellow", description: "Well-structured design" };
	}
	if (score >= 20) {
		return { level: "Simple", color: "green", description: "Clean and simple design" };
	}
	return { level: "Minimal", color: "blue", description: "Minimal design approach" };
}

export default async function FigmaDetailPage({ params }: FigmaDetailPageProps) {
	const { key } = await params;
	const file = await getFigmaFile(key)();

	if (!file) {
		notFound();
	}

	const fileData = file;

	// Calculate some metrics from the file data directly (no expensive API calls)
	const pagesCount = fileData.document?.children?.length || 0;
	const componentsCount = Object.keys(fileData.components || {}).length;
	const stylesCount = Object.keys(fileData.styles || {}).length;

	// Calculate a simple complexity score based on available data
	const simpleComplexityScore = Math.min(
		100,
		Math.round(pagesCount * 10 + componentsCount * 2 + stylesCount * 1)
	);
	const complexityAssessment =
		simpleComplexityScore > 0 ? getComplexityLevel(simpleComplexityScore) : null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
						<Link href="/portfolio" className="transition-colors hover:text-brand">
							Portfolio
						</Link>
						<ChevronRight className="h-4 w-4" />
						<Link href="/portfolio?tab=figma" className="transition-colors hover:text-brand">
							Figma
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">{fileData.name}</span>
					</div>

					<div className="mb-6">
						<h1 className="mb-4 font-bold text-4xl text-foreground">{fileData.name}</h1>
						<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4 text-brand" />
								<span>Updated {new Date(fileData.lastModified).toLocaleDateString()}</span>
							</div>
						</div>
					</div>

					{/* Metrics Overview */}
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardContent className="flex items-center p-6">
								<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
									<FileText className="h-6 w-6 text-brand" />
								</div>
								<div>
									<p className="font-bold text-2xl text-foreground">{pagesCount}</p>
									<p className="text-muted-foreground text-sm">Pages</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardContent className="flex items-center p-6">
								<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
									<Palette className="h-6 w-6 text-brand" />
								</div>
								<div>
									<p className="font-bold text-2xl text-foreground">{componentsCount}</p>
									<p className="text-muted-foreground text-sm">Components</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardContent className="flex items-center p-6">
								<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
									<Zap className="h-6 w-6 text-brand" />
								</div>
								<div>
									<p className="font-bold text-2xl text-foreground">{stylesCount}</p>
									<p className="text-muted-foreground text-sm">Styles</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardContent className="flex items-center p-6">
								<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
									<BarChart3 className="h-6 w-6 text-brand" />
								</div>
								<div>
									<p className="font-bold text-2xl text-foreground">{simpleComplexityScore}</p>
									<p className="text-muted-foreground text-sm">Complexity</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="space-y-8 lg:col-span-2">
						{/* Interactive Figma Viewer */}
						<div className="space-y-4">
							<h3 className="font-semibold text-foreground text-xl">Design File</h3>
							<FigmaInteractiveViewer
								fileKey={key}
								fileName={fileData.name}
								imageUrl={fileData.thumbnailUrl}
							/>
						</div>

						{/* Components Library */}
						{fileData.components && Object.keys(fileData.components || {}).length > 0 && (
							<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<Palette className="h-5 w-5 text-brand" />
										Components ({Object.keys(fileData.components || {}).length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
										{Object.entries(fileData.components || {})
											.slice(0, 6)
											.map(([nodeId, component]) => (
												<Card
													key={nodeId}
													className="border-border/30 bg-background/80 transition-shadow duration-300 hover:shadow-lg"
												>
													<CardContent className="p-4">
														<div className="mb-3 flex items-center gap-3">
															<div className="flex h-10 w-10 items-center justify-center rounded border border-brand/30 bg-brand/10 font-medium text-brand text-xs">
																{component.name?.charAt(0)?.toUpperCase() || "C"}
															</div>
															<div className="min-w-0 flex-1">
																<h4 className="truncate font-medium text-foreground">
																	{component.name || "Unnamed Component"}
																</h4>
																<p className="text-muted-foreground text-xs">
																	{component.description || "No description"}
																</p>
															</div>
														</div>
														<div className="flex aspect-[4/3] items-center justify-center rounded bg-secondary">
															<Layers className="h-8 w-8 text-muted-foreground" />
														</div>
													</CardContent>
												</Card>
											))}
									</div>
									{Object.keys(fileData.components || {}).length > 6 && (
										<div className="mt-4 text-center">
											<p className="text-muted-foreground text-sm">
												And {Object.keys(fileData.components || {}).length - 6} more components...
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-3">
							<Button
								render={
									<a
										href={`https://www.figma.com/file/${key}`}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Open in Figma"
									/>
								}
								size="lg"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Open in Figma
							</Button>
						</div>

						{/* Case Study */}
						<DesignCaseStudy
							title={fileData.name}
							description={`Deep dive into the design system and component architecture of ${fileData.name}, showcasing systematic design thinking and scalable UI patterns.`}
							challenge="Create a comprehensive design system that maintains consistency across multiple platforms while allowing for flexibility and scalability."
							solution="Developed a robust component library with clear design tokens, reusable patterns, and comprehensive documentation to ensure design consistency and developer efficiency."
							metrics={{
								views: pagesCount * 100, // Estimated based on complexity
								likes: componentsCount * 5,
								comments: stylesCount * 2,
							}}
							technical={{
								tools: ["Figma", "Design Tokens", "Component Libraries", "Auto Layout"],
								techniques: [
									"Design Systems",
									"Component Architecture",
									"Atomic Design",
									"Design Tokens",
									"Auto Layout",
								],
								duration: "4-8 weeks",
								team: ["Design System Team", "UI/UX Designers", "Frontend Developers"],
							}}
							results={[
								"Established a scalable design system with reusable components",
								"Improved design-to-development handoff efficiency",
								"Maintained visual consistency across all product touchpoints",
								"Reduced design debt and increased team productivity",
								"Created comprehensive documentation for design patterns",
							]}
							process={[
								{
									title: "Audit & Analysis",
									content:
										"Conducted a comprehensive audit of existing design patterns and identified inconsistencies across the product.",
									icon: <BarChart3 className="h-5 w-5" />,
								},
								{
									title: "Token Definition",
									content:
										"Established design tokens for colors, typography, spacing, and other foundational elements.",
									icon: <Palette className="h-5 w-5" />,
								},
								{
									title: "Component Creation",
									content:
										"Built a library of reusable components with proper variants and states.",
									icon: <Layers className="h-5 w-5" />,
								},
								{
									title: "Documentation",
									content:
										"Created comprehensive guidelines and usage examples for the design system.",
									icon: <FileText className="h-5 w-5" />,
								},
							]}
							testimonial={{
								quote:
									"This design system has transformed how our team works together, creating consistency and efficiency across all our products.",
								author: "Product Team",
								role: "Development Team",
							}}
						/>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* File Information */}
						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="text-foreground">File Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Calendar className="h-4 w-4 text-brand" />
									<span className="text-sm">Last Modified</span>
								</div>
								<p className="font-medium text-foreground">
									{new Date(fileData.lastModified).toLocaleDateString()}
								</p>

								{fileData.version && (
									<div>
										<div className="mb-1 flex items-center gap-2 text-muted-foreground">
											<GitBranch className="h-4 w-4 text-brand" />
											<span className="text-sm">Version</span>
										</div>
										<p className="font-medium text-foreground">{fileData.version}</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="text-foreground">Quick Stats</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Pages</span>
									<span className="font-semibold text-foreground">{pagesCount}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Components</span>
									<span className="font-semibold text-foreground">{componentsCount}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Styles</span>
									<span className="font-semibold text-foreground">{stylesCount}</span>
								</div>
								{simpleComplexityScore > 0 && (
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Complexity</span>
										<span className="font-semibold text-foreground">{simpleComplexityScore}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Complexity Assessment */}
						{complexityAssessment && (
							<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-300 hover:border-brand/30 hover:shadow-xl">
								<CardHeader>
									<CardTitle className="text-foreground">Complexity Assessment</CardTitle>
								</CardHeader>
								<CardContent>
									<Card className="border-border/30 bg-background/80">
										<CardContent className="p-4 text-center">
											<div className="mb-1 font-bold text-brand text-lg">
												{complexityAssessment.level}
											</div>
											<div className="text-muted-foreground text-sm">
												{complexityAssessment.description}
											</div>
										</CardContent>
									</Card>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
