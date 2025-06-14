import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Github, Star, GitFork, Eye, ArrowLeft, Calendar, ExternalLink, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { githubLanguageColors } from "@/lib/github-colors";
import { getRepo, getReadme, getLanguages, GitHubRepo } from "@/lib/portfolio-data";

interface ProjectDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

interface Languages {
	[key: string]: number;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const repo = await getRepo(slug);
	if (!repo) {
		return {
			title: "Project Not Found",
			description: "The requested project could not be found.",
		};
	}

	const title = repo.name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return {
		title: `${title} - Project Details`,
		description: repo.description || `Details and documentation for the ${title} project.`,
		openGraph: {
			title: `${title} - Project Details`,
			description: repo.description || `Details and documentation for the ${title} project.`,
			type: "website",
			url: `https://byronwade.com/portfolio/${slug}`,
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} - Project Details`,
			description: repo.description || `Details and documentation for the ${title} project.`,
		},
	};
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
	const { slug } = await params;
	const repo = await getRepo(slug);
	const languages = await getLanguages(slug);
	const readme = await getReadme(slug);

	if (!repo) {
		notFound();
	}

	const title = repo.name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	const totalBytes = Object.values(languages).reduce((acc, bytes) => acc + bytes, 0);
	const languageStats = Object.entries(languages).map(([lang, bytes]) => ({
		name: lang,
		percentage: ((bytes / totalBytes) * 100).toFixed(1),
		bytes,
	}));

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const components = {
		img: ({ node, ...props }: any) => {
			let src = props.src;
			if (src && src.startsWith("./")) {
				src = src.slice(2);
			}
			const finalSrc = src && !src.startsWith("http") ? `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${src}` : src;

			// eslint-disable-next-line @next/next/no-img-element
			return <img {...props} src={finalSrc} alt={props.alt || ""} className="rounded-lg border border-gray-200" />;
		},
		h1: ({ children }: any) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
		h2: ({ children }: any) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
		h3: ({ children }: any) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>,
		p: ({ children }: any) => <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>,
		code: ({ children }: any) => <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{children}</code>,
		pre: ({ children }: any) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-6">{children}</pre>,
		ul: ({ children }: any) => <ul className="text-gray-600 mb-4 space-y-2">{children}</ul>,
		ol: ({ children }: any) => <ol className="text-gray-600 mb-4 space-y-2">{children}</ol>,
		li: ({ children }: any) => <li className="text-gray-600">{children}</li>,
		a: ({ href, children }: any) => (
			<a href={href} className="text-blue-600 hover:text-blue-700 transition-colors underline" target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		),
		blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
		br: () => null,
	};

	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Navigation */}
				<div className="mb-8">
					<Button variant="outline" asChild className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
						<Link href="/portfolio">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Portfolio
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Project Header */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
								{repo.description && <p className="text-xl text-gray-600 dark:text-gray-300">{repo.description}</p>}
							</div>

							{/* Project Meta */}
							<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
								</div>
								<div className="flex items-center gap-2">
									<Star className="w-4 h-4" />
									<span>{repo.stargazers_count} stars</span>
								</div>
								<div className="flex items-center gap-2">
									<GitFork className="w-4 h-4" />
									<span>{repo.forks_count} forks</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3">
								<Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
									<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
										<Github className="w-4 h-4 mr-2" />
										View on GitHub
									</a>
								</Button>
								{repo.homepage && (
									<Button variant="outline" asChild className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
										<a href={repo.homepage} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="w-4 h-4 mr-2" />
											Live Demo
										</a>
									</Button>
								)}
							</div>

							{/* Topics */}
							{repo.topics && repo.topics.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{repo.topics.map((topic) => (
										<Badge key={topic} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
											{topic}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* README */}
						{readme && (
							<Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
								<CardHeader>
									<CardTitle className="text-gray-900 dark:text-white">Documentation</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose prose-gray dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
										<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
											{readme}
										</ReactMarkdown>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Project Stats */}
						<Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
							<CardHeader>
								<CardTitle className="text-gray-900 dark:text-white">Project Stats</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
											<Star className="w-4 h-4" />
										</div>
										<div className="text-2xl font-bold text-gray-900 dark:text-white">{repo.stargazers_count}</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">Stars</div>
									</div>
									<div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
											<GitFork className="w-4 h-4" />
										</div>
										<div className="text-2xl font-bold text-gray-900 dark:text-white">{repo.forks_count}</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">Forks</div>
									</div>
									<div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
											<Eye className="w-4 h-4" />
										</div>
										<div className="text-2xl font-bold text-gray-900 dark:text-white">{repo.watchers_count}</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">Watchers</div>
									</div>
									<div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
										<div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
											<Code className="w-4 h-4" />
										</div>
										<div className="text-2xl font-bold text-gray-900 dark:text-white">{formatBytes(repo.size * 1024)}</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">Size</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Languages */}
						{languageStats.length > 0 && (
							<Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
								<CardHeader>
									<CardTitle className="text-gray-900 dark:text-white">Languages</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{languageStats.map(({ name, percentage, bytes }) => (
										<div key={name} className="space-y-2">
											<div className="flex justify-between items-center">
												<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
												<span className="text-sm text-gray-500 dark:text-gray-400">{percentage}%</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
												<div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						)}

						{/* Quick Links */}
						<Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
							<CardHeader>
								<CardTitle className="text-gray-900 dark:text-white">Quick Links</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button variant="outline" size="sm" asChild className="w-full justify-start border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
									<a href={`${repo.html_url}/issues`} target="_blank" rel="noopener noreferrer">
										Issues ({repo.open_issues_count})
									</a>
								</Button>
								<Button variant="outline" size="sm" asChild className="w-full justify-start border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
									<a href={`${repo.html_url}/pulls`} target="_blank" rel="noopener noreferrer">
										Pull Requests
									</a>
								</Button>
								<Button variant="outline" size="sm" asChild className="w-full justify-start border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
									<a href={`${repo.html_url}/commits`} target="_blank" rel="noopener noreferrer">
										Commit History
									</a>
								</Button>
							</CardContent>
						</Card>

						{/* Project Info */}
						<Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
							<CardHeader>
								<CardTitle className="text-gray-900 dark:text-white">Project Info</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-500 dark:text-gray-400">Created</span>
									<span className="text-gray-900 dark:text-white">{new Date(repo.created_at).toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500 dark:text-gray-400">Updated</span>
									<span className="text-gray-900 dark:text-white">{new Date(repo.updated_at).toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500 dark:text-gray-400">Default Branch</span>
									<span className="text-gray-900 dark:text-white">{repo.default_branch}</span>
								</div>
								{repo.language && (
									<div className="flex justify-between">
										<span className="text-gray-500 dark:text-gray-400">Primary Language</span>
										<span className="text-gray-900 dark:text-white">{repo.language}</span>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
