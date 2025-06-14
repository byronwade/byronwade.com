import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, GitFork, Eye, Calendar, Code, Users, Activity, TrendingUp, Github, Globe, AlertCircle, CheckCircle, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRepo, getLanguages, getReadme } from "@/lib/portfolio-data";
import { GitHubRepo } from "@/types/github";
import { Metadata } from "next";
import { githubLanguageColors } from "@/lib/github-colors";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface GitHubDetailPageProps {
	params: Promise<{ repo: string }>;
}

export async function generateMetadata({ params }: GitHubDetailPageProps): Promise<Metadata> {
	const { repo } = await params;
	const repository = await getRepo(repo);

	if (!repository) {
		return {
			title: "Repository Not Found",
			description: "The requested GitHub repository could not be found.",
		};
	}

	const title = repository.name
		.split("-")
		.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return {
		title: `${title} - GitHub Repository`,
		description: repository.description || `View the ${title} repository on GitHub.`,
		openGraph: {
			title: `${title} - GitHub Repository`,
			description: repository.description || `View the ${title} repository on GitHub.`,
			type: "website",
			url: `https://byronwade.com/portfolio/github/${repo}`,
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} - GitHub Repository`,
			description: repository.description || `View the ${title} repository on GitHub.`,
		},
	};
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatFileSize(bytes: number): string {
	const sizes = ["Bytes", "KB", "MB", "GB"];
	if (bytes === 0) return "0 Bytes";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

export default async function GitHubDetailPage({ params }: GitHubDetailPageProps) {
	const { repo } = await params;
	const [repository, languages, readme] = await Promise.all([getRepo(repo), getLanguages(repo), getReadme(repo)]);

	if (!repository) {
		notFound();
	}

	const title = repository.name
		.split("-")
		.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	// Calculate total bytes for language percentages
	const totalBytes = Object.values(languages).reduce((sum: number, bytes: number) => sum + bytes, 0);
	const languagePercentages = Object.entries(languages).map(([lang, bytes]) => ({
		name: lang,
		bytes,
		percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : "0",
		color: githubLanguageColors[lang] || "#cccccc",
	}));

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
						{/* Repository Header */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold text-foreground">{title}</h1>
								{repository.description && <div className="text-lg text-muted-foreground">{repository.description}</div>}
							</div>

							{/* Repository Statistics */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center p-6">
										<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
											<Star className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<div className="text-2xl font-bold text-foreground">{repository.stargazers_count?.toLocaleString() || "0"}</div>
											<div className="text-sm text-muted-foreground">Stars</div>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center p-6">
										<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
											<GitFork className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<div className="text-2xl font-bold text-foreground">{repository.forks_count?.toLocaleString() || "0"}</div>
											<div className="text-sm text-muted-foreground">Forks</div>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center p-6">
										<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
											<Eye className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<div className="text-2xl font-bold text-foreground">{repository.watchers_count?.toLocaleString() || "0"}</div>
											<div className="text-sm text-muted-foreground">Watchers</div>
										</div>
									</CardContent>
								</Card>
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center p-6">
										<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg mr-4">
											<AlertCircle className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<div className="text-2xl font-bold text-foreground">{repository.open_issues_count?.toLocaleString() || "0"}</div>
											<div className="text-sm text-muted-foreground">Issues</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Repository Owner Info */}
							{repository.owner && (
								<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="flex items-center gap-4 p-6">
										{repository.owner.avatar_url && <img src={repository.owner.avatar_url} alt={repository.owner.login || "Owner"} className="w-12 h-12 rounded-full" />}
										<div className="flex-1">
											<h3 className="font-semibold text-foreground">{repository.owner.login || "Unknown Owner"}</h3>
											<p className="text-sm text-muted-foreground">Repository Owner</p>
										</div>
										<div className="ml-auto">
											<Button variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
												<a href={`https://github.com/${repository.owner.login}`} target="_blank" rel="noopener noreferrer">
													<Users className="w-4 h-4 mr-2" />
													View Profile
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-colors">
									<a href={repository.html_url} target="_blank" rel="noopener noreferrer">
										<Github className="w-4 h-4 mr-2" />
										View on GitHub
									</a>
								</Button>
								{repository.homepage && (
									<Button variant="outline" asChild className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 transition-colors">
										<a href={repository.homepage} target="_blank" rel="noopener noreferrer">
											<Globe className="w-4 h-4 mr-2" />
											Live Demo
										</a>
									</Button>
								)}
							</div>

							{/* Language Breakdown */}
							{languagePercentages.length > 0 && (
								<div className="space-y-3">
									<h3 className="text-lg font-semibold text-foreground">Languages</h3>
									<div className="space-y-4">
										{/* Language Bar */}
										<div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
											<div className="h-full flex">
												{languagePercentages.map((lang, index) => (
													<div key={lang.name} className="h-full transition-all duration-300" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
												))}
											</div>
										</div>

										{/* Language List */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{languagePercentages.map((lang) => (
												<Card key={lang.name} className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
													<CardContent className="flex items-center justify-between px-3 py-2">
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
															<span className="text-sm text-foreground">{lang.name}</span>
														</div>
														<span className="text-sm text-muted-foreground">{lang.percentage}%</span>
													</CardContent>
												</Card>
											))}
										</div>
									</div>
								</div>
							)}

							{/* Topics */}
							{repository.topics && repository.topics.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{repository.topics.map((topic: string) => (
										<Badge key={topic} variant="secondary" className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 hover:bg-yellow-600/20 transition-colors">
											{topic}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* README Content */}
						{readme && (
							<Card className="overflow-hidden bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-foreground">
										<FileText className="w-5 h-5 text-yellow-600" />
										README.md
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose prose-invert prose-yellow max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-yellow-600 prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/30 prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-yellow-600 prose-blockquote:text-muted-foreground prose-th:text-foreground prose-td:text-muted-foreground prose-hr:border-border/30">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											rehypePlugins={[rehypeHighlight]}
											components={{
												// Custom components for better styling
												h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border/30">{children}</h1>,
												h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-6">{children}</h2>,
												h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{children}</h3>,
												p: ({ children }) => <p className="text-muted-foreground mb-3 leading-relaxed">{children}</p>,
												ul: ({ children }) => <ul className="list-disc list-inside text-muted-foreground mb-3 space-y-1">{children}</ul>,
												ol: ({ children }) => <ol className="list-decimal list-inside text-muted-foreground mb-3 space-y-1">{children}</ol>,
												li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
												code: ({ children, className, ...props }: any) => {
													const isInline = !className?.includes("language-");
													if (isInline) {
														return (
															<code className="text-yellow-600 bg-background/50 px-1 py-0.5 rounded text-sm font-mono" {...props}>
																{children}
															</code>
														);
													}
													return (
														<code className={className} {...props}>
															{children}
														</code>
													);
												},
												pre: ({ children }) => <pre className="bg-background/50 border border-border/30 rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>,
												a: ({ href, children }) => (
													<a href={href} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">
														{children}
													</a>
												),
												blockquote: ({ children }) => <blockquote className="border-l-4 border-yellow-600 pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
												table: ({ children }) => (
													<div className="overflow-x-auto mb-4">
														<table className="min-w-full border border-border/30 rounded-lg">{children}</table>
													</div>
												),
												thead: ({ children }) => <thead className="bg-background/50">{children}</thead>,
												th: ({ children }) => <th className="border border-border/30 px-4 py-2 text-left font-semibold text-foreground">{children}</th>,
												td: ({ children }) => <td className="border border-border/30 px-4 py-2 text-muted-foreground">{children}</td>,
												hr: () => <hr className="border-border/30 my-6" />,
											}}
										>
											{readme}
										</ReactMarkdown>
									</div>
								</CardContent>
							</Card>
						)}
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
									<span className="text-sm">Created {formatDate(repository.created_at)}</span>
								</div>
								{repository.updated_at && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Activity className="w-4 h-4 text-yellow-600" />
										<span className="text-sm">Updated {formatDate(repository.updated_at)}</span>
									</div>
								)}
								{repository.size && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Zap className="w-4 h-4 text-yellow-600" />
										<span className="text-sm">Size {formatFileSize(repository.size * 1024)}</span>
									</div>
								)}
								{repository.license && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<CheckCircle className="w-4 h-4 text-yellow-600" />
										<span className="text-sm">License {repository.license.name}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardHeader>
								<CardTitle className="text-foreground">Quick Stats</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Stars</span>
									<span className="font-semibold text-foreground">{repository.stargazers_count?.toLocaleString() || "0"}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Forks</span>
									<span className="font-semibold text-foreground">{repository.forks_count?.toLocaleString() || "0"}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Watchers</span>
									<span className="font-semibold text-foreground">{repository.watchers_count?.toLocaleString() || "0"}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Open Issues</span>
									<span className="font-semibold text-foreground">{repository.open_issues_count?.toLocaleString() || "0"}</span>
								</div>
								{repository.language && (
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Primary Language</span>
										<span className="font-semibold text-foreground">{repository.language}</span>
									</div>
								)}

								{/* Show a note if no detailed stats are available */}
								{!repository.stargazers_count && !repository.forks_count && !repository.watchers_count && !repository.open_issues_count && (
									<Card className="bg-background/80 border-border/30">
										<CardContent className="text-center p-4">
											<p className="text-sm text-muted-foreground">Detailed metrics not available</p>
											<p className="text-xs text-muted-foreground mt-1">Visit GitHub for current stats</p>
										</CardContent>
									</Card>
								)}
							</CardContent>
						</Card>

						{/* Repository Status */}
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardHeader>
								<CardTitle className="text-foreground">Repository Status</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Visibility</span>
									<Badge variant={repository.private ? "destructive" : "default"} className={repository.private ? "" : "bg-green-100 text-green-800 border-green-200"}>
										{repository.private ? "Private" : "Public"}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Archived</span>
									<Badge variant={repository.archived ? "secondary" : "default"} className={repository.archived ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-green-100 text-green-800 border-green-200"}>
										{repository.archived ? "Yes" : "Active"}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Fork</span>
									<Badge variant={repository.fork ? "secondary" : "default"} className={repository.fork ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-green-100 text-green-800 border-green-200"}>
										{repository.fork ? "Yes" : "Original"}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
