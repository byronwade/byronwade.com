"use client";

import { format } from "date-fns";
import { ExternalLink, GitFork, Github, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

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

async function fetchPortfolioRepos(signal?: AbortSignal): Promise<{
	repos: Repo[];
	degraded: boolean;
}> {
	const response = await fetch("/api/portfolio", {
		signal,
		headers: { Accept: "application/json" },
	});
	if (!response.ok) throw new Error("Failed to fetch portfolio data");
	const data = await response.json();
	const filtered: Repo[] = (data.repos ?? []).filter(
		(repo: Repo) => !repo.fork && repo.name !== "byronwade.com"
	);
	filtered.sort((a, b) => {
		if (b.stargazers_count !== a.stargazers_count) {
			return b.stargazers_count - a.stargazers_count;
		}
		return new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime();
	});
	return {
		repos: filtered,
		degraded: Boolean(data.degraded || data.githubFailed),
	};
}

export default function PortfolioPage() {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(false);
	const [degraded, setDegraded] = useState(false);
	const [visibleRepos, setVisibleRepos] = useState(8);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 8000);
		const isRefresh = reloadKey > 0;

		if (isRefresh) setRefreshing(true);
		else setLoading(true);
		setError(false);

		void (async () => {
			try {
				const result = await fetchPortfolioRepos(controller.signal);
				if (controller.signal.aborted) return;
				setRepos(result.repos);
				setDegraded(result.degraded && result.repos.length === 0);
				setError(result.repos.length === 0 && result.degraded);
			} catch (err) {
				if (controller.signal.aborted) return;
				console.error("Error loading portfolio data:", err);
				setError(true);
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
					setRefreshing(false);
				}
			}
		})();

		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		};
	}, [reloadKey]);

	const reload = useCallback(() => {
		setReloadKey((key) => key + 1);
	}, []);

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-10 sm:gap-12">
				<header className="reveal flex w-full flex-col gap-3">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<div className="flex flex-col gap-3">
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
						</div>
						{!loading && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={refreshing}
								onClick={reload}
								className="gap-2"
							>
								<RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
								{refreshing ? "Refreshing…" : "Refresh"}
							</Button>
						)}
					</div>
				</header>

				{loading ? (
					<div className="grid gap-4 sm:grid-cols-2" aria-busy="true">
						<p className="sr-only" role="status">
							Loading repositories…
						</p>
						{["a", "b", "c", "d", "e", "f"].map((id) => (
							<div
								key={`skeleton-${id}`}
								className="flex min-h-40 animate-pulse flex-col gap-3 rounded-2xl border border-border bg-card p-5"
							>
								<div className="h-5 w-1/2 rounded bg-muted" />
								<div className="h-4 w-full rounded bg-muted/70" />
								<div className="h-4 w-3/4 rounded bg-muted/70" />
								<div className="mt-auto flex gap-3 pt-2">
									<div className="h-3 w-16 rounded bg-muted/60" />
									<div className="h-3 w-10 rounded bg-muted/60" />
								</div>
							</div>
						))}
					</div>
				) : error || repos.length === 0 ? (
					<EmptyState
						icon={Github}
						title={degraded || error ? "Couldn't load repositories" : "No repositories yet"}
						description={
							degraded || error
								? "GitHub is slow or unavailable right now. Retry here, or open the profile directly."
								: "Public repositories will show up here once they’re available."
						}
						action={
							<div className="flex flex-wrap items-center justify-center gap-2">
								<Button type="button" onClick={reload} disabled={refreshing} className="gap-2">
									<RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
									{refreshing ? "Retrying…" : "Try again"}
								</Button>
								<Button
									variant="outline"
									render={
										<a
											href="https://github.com/byronwade"
											target="_blank"
											rel="noopener noreferrer"
										>
											Open GitHub
											<ExternalLink className="size-3.5" aria-hidden="true" />
										</a>
									}
								/>
							</div>
						}
					/>
				) : (
					<>
						{degraded && (
							<p
								className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
								role="status"
							>
								Showing a partial response — some GitHub data may be stale. Refresh to try again.
							</p>
						)}
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
