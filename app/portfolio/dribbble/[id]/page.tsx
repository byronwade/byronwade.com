"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Heart, Eye, Calendar, User, Palette, Activity, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DribbbleShot } from "@/types/dribbble";
import Image from "next/image";
import { InteractiveImageViewer } from "@/components/ui/interactive-image-viewer";
import { DesignCaseStudy } from "@/components/ui/design-case-study";
import { useEffect, useState } from "react";

interface DribbbleDetailPageProps {
	params: Promise<{ id: string }>;
}

// Metadata moved to layout since this is now a client component

export default function DribbbleDetailPage({ params }: DribbbleDetailPageProps) {
	const [shot, setShot] = useState<DribbbleShot | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [id, setId] = useState<string>("");

	useEffect(() => {
		const loadData = async () => {
			try {
				const resolvedParams = await params;
				setId(resolvedParams.id);

				// Fetch data from API route instead of calling server functions directly
				const response = await fetch(`/api/portfolio/dribbble/${resolvedParams.id}`);
				if (!response.ok) {
					if (response.status === 404) {
						setError("Shot not found");
					} else {
						throw new Error("Failed to fetch shot data");
					}
					return;
				}

				const data = await response.json();
				setShot(data.shot);
			} catch (err) {
				console.error("Error loading shot:", err);
				setError("Failed to load shot data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [params]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading design...</p>
				</div>
			</div>
		);
	}

	if (error || !shot) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-4">Design Not Found</h1>
					<p className="text-muted-foreground mb-6">{error || "The requested design could not be found."}</p>
					<Button variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
						<Link href="/portfolio">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Portfolio
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Navigation */}
				<div className="mb-8">
					<Button variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
						<Link href="/portfolio">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Portfolio
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Design Header */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold text-foreground">{shot.title}</h1>
								{shot.description && <div className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: shot.description }} />}
							</div>

							{/* Enhanced Engagement Metrics - Only show if we have meaningful stats */}
							{(shot.views_count || shot.likes_count || shot.comments_count || shot.rebounds_count) && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{shot.views_count !== undefined && (
										<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
											<CardContent className="flex items-center p-6">
												<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
													<Eye className="w-6 h-6 text-yellow-600" />
												</div>
												<div>
													<div className="text-2xl font-bold text-foreground">{shot.views_count.toLocaleString()}</div>
													<div className="text-sm text-muted-foreground">Views</div>
												</div>
											</CardContent>
										</Card>
									)}
									{shot.likes_count !== undefined && (
										<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
											<CardContent className="flex items-center p-6">
												<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
													<Heart className="w-6 h-6 text-yellow-600" />
												</div>
												<div>
													<div className="text-2xl font-bold text-foreground">{shot.likes_count.toLocaleString()}</div>
													<div className="text-sm text-muted-foreground">Likes</div>
												</div>
											</CardContent>
										</Card>
									)}
									{shot.comments_count !== undefined && (
										<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
											<CardContent className="flex items-center p-6">
												<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
													<MessageCircle className="w-6 h-6 text-yellow-600" />
												</div>
												<div>
													<div className="text-2xl font-bold text-foreground">{shot.comments_count.toLocaleString()}</div>
													<div className="text-sm text-muted-foreground">Comments</div>
												</div>
											</CardContent>
										</Card>
									)}
									{shot.rebounds_count !== undefined && (
										<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
											<CardContent className="flex items-center p-6">
												<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
													<TrendingUp className="w-6 h-6 text-yellow-600" />
												</div>
												<div>
													<div className="text-2xl font-bold text-foreground">{shot.rebounds_count.toLocaleString()}</div>
													<div className="text-sm text-muted-foreground">Rebounds</div>
												</div>
											</CardContent>
										</Card>
									)}
								</div>
							)}

							{/* Designer Info */}
							{shot.user && (
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center gap-4 p-6">
										{shot.user.avatar_url && <Image src={shot.user.avatar_url} alt={shot.user.name || "Designer"} width={48} height={48} className="rounded-full" />}
										<div className="flex-1">
											<h3 className="font-semibold text-foreground">{shot.user.name || "Unknown Designer"}</h3>
											{shot.user.login && <p className="text-sm text-muted-foreground">@{shot.user.login}</p>}
											{shot.user.bio && <p className="text-sm text-muted-foreground mt-1">{shot.user.bio}</p>}
										</div>
										{shot.user.html_url && (
											<div className="ml-auto">
												<Button variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
													<a href={shot.user.html_url} target="_blank" rel="noopener noreferrer">
														<User className="w-4 h-4 mr-2" />
														View Profile
													</a>
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							)}

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-colors">
									<a href={shot.html_url} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="w-4 h-4 mr-2" />
										View on Dribbble
									</a>
								</Button>
							</div>

							{/* Color Palette */}
							{shot.colors && shot.colors.length > 0 && (
								<div className="space-y-3">
									<h3 className="text-lg font-semibold text-foreground">Color Palette</h3>
									<div className="flex flex-wrap gap-2">
										{shot.colors.map((color: string, index: number) => (
											<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
												<CardContent className="flex items-center gap-2 px-3 py-2">
													<div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: color }}></div>
													<span className="text-sm font-mono text-muted-foreground">{color}</span>
												</CardContent>
											</Card>
										))}
									</div>
								</div>
							)}

							{/* Tags */}
							{shot.tags && shot.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{shot.tags.map((tag: string) => (
										<Badge key={tag} variant="secondary" className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 hover:bg-yellow-600/20 transition-colors">
											{tag}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* Interactive Design Viewer */}
						<div className="space-y-4">
							<h3 className="text-xl font-semibold text-foreground">Design Preview</h3>
							<InteractiveImageViewer src={shot.images.hidpi || shot.images.normal || shot.images.teaser} alt={shot.title} title={shot.title} downloadUrl={shot.images.hidpi || shot.images.normal} className="min-h-[500px]" />
						</div>

						{/* Additional Images */}
						{shot.attachments && shot.attachments.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold text-foreground">Additional Images</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{shot.attachments.map((attachment: any, index: number) => (
										<InteractiveImageViewer key={index} src={attachment.url} alt={`${shot.title} attachment ${index + 1}`} title={`${shot.title} - Image ${index + 1}`} downloadUrl={attachment.url} className="min-h-[300px]" />
									))}
								</div>
							</div>
						)}

						{/* Case Study */}
						<DesignCaseStudy
							title={shot.title}
							description={`Explore the design process and impact of ${shot.title}, a creative project that showcases modern design principles and user-centered thinking.`}
							challenge="Create a visually compelling design that stands out in a crowded digital landscape while maintaining usability and brand consistency."
							solution="Developed a clean, modern design approach that balances aesthetic appeal with functional clarity, using strategic color choices and typography to guide user attention."
							metrics={{
								views: shot.views_count,
								likes: shot.likes_count,
								comments: shot.comments_count,
								shares: shot.rebounds_count,
							}}
							technical={{
								tools: ["Figma", "Adobe Creative Suite", "Sketch", "Principle"],
								techniques: ["User Interface Design", "Visual Design", "Prototyping", "Design Systems"],
								duration: "2-3 weeks",
								team: shot.user?.name ? [shot.user.name] : ["Design Team"],
							}}
							colors={shot.colors}
							tags={shot.tags}
							results={["Achieved high engagement rates with strong visual appeal", "Successfully communicated brand message through design", "Received positive feedback from the design community", "Demonstrated effective use of color and typography", "Created a memorable and impactful visual experience"]}
							testimonial={
								shot.user?.bio
									? {
											quote: shot.user.bio,
											author: shot.user.name || "Designer",
											role: "Creative Professional",
										}
									: undefined
							}
						/>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Project Details */}
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardHeader>
								<CardTitle className="text-foreground">Project Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Calendar className="w-4 h-4 text-yellow-600" />
									<span className="text-sm">Published {shot.published_at ? new Date(shot.published_at).toLocaleDateString() : "Unknown"}</span>
								</div>
								{shot.updated_at && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Activity className="w-4 h-4 text-yellow-600" />
										<span className="text-sm">Updated {new Date(shot.updated_at).toLocaleDateString()}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quick Stats - Only show if we have stats */}
						{(shot.views_count || shot.likes_count || shot.comments_count || shot.rebounds_count || shot.buckets_count) && (
							<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardHeader>
									<CardTitle className="text-foreground">Quick Stats</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{shot.views_count !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Views</span>
											<span className="font-semibold text-foreground">{shot.views_count.toLocaleString()}</span>
										</div>
									)}
									{shot.likes_count !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Likes</span>
											<span className="font-semibold text-foreground">{shot.likes_count.toLocaleString()}</span>
										</div>
									)}
									{shot.comments_count !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Comments</span>
											<span className="font-semibold text-foreground">{shot.comments_count.toLocaleString()}</span>
										</div>
									)}
									{shot.rebounds_count !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Rebounds</span>
											<span className="font-semibold text-foreground">{shot.rebounds_count.toLocaleString()}</span>
										</div>
									)}
									{shot.buckets_count !== undefined && (
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Collections</span>
											<span className="font-semibold text-foreground">{shot.buckets_count.toLocaleString()}</span>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
