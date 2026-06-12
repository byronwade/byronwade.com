"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ArrowSquareOut as ExternalLink, GitFork, GithubLogo as Github, Star } from "@/lib/icons";

interface Repo {
	id: number;
	name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	topics?: string[];
	pushed_at?: string;
	archived?: boolean;
	fork?: boolean;
}

const languageColors: Record<string, string> = {
	TypeScript: "bg-blue-500",
	JavaScript: "bg-yellow-400",
	Python: "bg-sky-500",
	Go: "bg-cyan-500",
	Rust: "bg-orange-600",
	Java: "bg-red-500",
	Ruby: "bg-rose-600",
	PHP: "bg-indigo-500",
	CSS: "bg-pink-500",
	HTML: "bg-orange-500",
};

const titleize = (name: string) =>
	name
		.split(/[-_]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export default function PortfolioPage() {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [visibleRepos, setVisibleRepos] = useState(8);

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetch("/api/portfolio");
				if (!response.ok) throw new Error("Failed to fetch portfolio data");
				const data = await response.json();
				const filtered: Repo[] = (data.repos ?? []).filter(
					(repo: Repo) => !repo.fork && repo.name !== "byronwade.com"
				);
				// Most-starred first, then most recently pushed so active repos surface.
				filtered.sort((a, b) => {
					if (b.stargazers_count !== a.stargazers_count) {
						return b.stargazers_count - a.stargazers_count;
					}
					return new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime();
				});
				setRepos(filtered);
			} catch (err) {
				console.error("Error loading portfolio data:", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-10 sm:gap-12">
				<header className="reveal flex w-full flex-col gap-3">
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						Portfolio
					</h1>
					<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
						Open-source work and experiments. Pulled live from{" "}
						<a
							href="https://github.com/byronwade"
							target="_blank"
							rel="noopener noreferrer"
							className="link-underline font-medium"
						>
							GitHub
						</a>
						. For in-depth case studies, see{" "}
						<Link href="/projects" className="link-underline font-medium">
							projects
						</Link>
						.
					</p>
				</header>

				{loading ? (
					<div className="grid animate-pulse gap-4 sm:grid-cols-2">
						{["a", "b", "c", "d", "e", "f"].map((id) => (
							<div
								key={`skeleton-${id}`}
								className="h-40 rounded-2xl border border-border bg-muted/50"
							/>
						))}
					</div>
				) : error ? (
					<div className="rounded-2xl border border-border bg-card p-8 text-center">
						<Github className="mx-auto mb-3 size-8 text-muted-foreground" />
						<p className="text-muted-foreground">
							Couldn't load repositories right now. View them directly on{" "}
							<a
								href="https://github.com/byronwade"
								target="_blank"
								rel="noopener noreferrer"
								className="link-underline font-medium"
							>
								GitHub
							</a>
							.
						</p>
					</div>
				) : (
					<>
						<div className="grid gap-4 sm:grid-cols-2">
							{repos.slice(0, visibleRepos).map((repo) => (
								<a
									key={repo.id}
									href={repo.html_url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex min-h-40 flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-float focus-ring"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 items-center gap-2">
											<h2 className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
												{titleize(repo.name)}
											</h2>
											{repo.archived && (
												<span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
													Archived
												</span>
											)}
										</div>
										<ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
									</div>

									{repo.description && (
										<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
											{repo.description}
										</p>
									)}

									{repo.topics && repo.topics.length > 0 && (
										<div className="flex flex-wrap gap-1.5">
											{repo.topics.slice(0, 4).map((topic) => (
												<span
													key={topic}
													className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
												>
													{topic}
												</span>
											))}
										</div>
									)}

									<div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground">
										{repo.language && (
											<span className="inline-flex items-center gap-1.5">
												<span
													className={`size-2.5 rounded-full ${languageColors[repo.language] ?? "bg-muted-foreground"}`}
												/>
												{repo.language}
											</span>
										)}
										<span className="inline-flex items-center gap-1">
											<Star className="size-3.5" />
											{repo.stargazers_count}
										</span>
										<span className="inline-flex items-center gap-1">
											<GitFork className="size-3.5" />
											{repo.forks_count}
										</span>
										{repo.pushed_at && (
											<span className="ml-auto whitespace-nowrap text-muted-foreground/80">
												Updated {format(new Date(repo.pushed_at), "MMM yyyy")}
											</span>
										)}
									</div>
								</a>
							))}
						</div>

						{visibleRepos < repos.length && (
							<div className="text-center">
								<Button
									type="button"
									variant="outline"
									onClick={() => setVisibleRepos((prev) => prev + 8)}
								>
									Load more
								</Button>
								<p className="mt-3 text-sm text-muted-foreground">
									Showing {Math.min(visibleRepos, repos.length)} of {repos.length}
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</SiteShell>
	);
}
