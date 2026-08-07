"use client";

import { format } from "date-fns";
import { ExternalLink, GitFork, Github, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	EmptyState,
	IndexList,
	IndexRow,
	indexRowAccentClass,
	indexRowLinkClass,
} from "@/components/common";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import type { GitHubRepo } from "@/types/github";

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

const WORD_SEPARATORS = /[-_]/;

const titleize = (name: string) =>
	name
		.split(WORD_SEPARATORS)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

async function fetchPortfolioRepos(signal?: AbortSignal): Promise<{
	repos: GitHubRepo[];
	degraded: boolean;
}> {
	const response = await fetch("/api/portfolio", {
		signal,
		headers: { Accept: "application/json" },
	});
	if (!response.ok) {
		throw new Error("Failed to fetch portfolio data");
	}
	const data = await response.json();
	const filtered: GitHubRepo[] = (data.repos ?? []).filter(
		(repo: GitHubRepo) => !repo.fork && repo.name !== "byronwade.com"
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

const REQUEST_TIMEOUT_MS = 8000;

interface PortfolioReposState {
	degraded: boolean;
	error: boolean;
	loading: boolean;
	refreshing: boolean;
	reload: () => void;
	repos: GitHubRepo[];
}

/**
 * Loads the repository list, keeping the request lifecycle — abort on unmount,
 * timeout, refresh-vs-initial-load — out of the rendering component.
 */
function usePortfolioRepos(): PortfolioReposState {
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(false);
	const [degraded, setDegraded] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

		if (reloadKey > 0) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}
		setError(false);

		void (async () => {
			try {
				const result = await fetchPortfolioRepos(controller.signal);
				if (controller.signal.aborted) {
					return;
				}
				setRepos(result.repos);
				// An empty list is only an error when the upstream call degraded; a
				// genuinely empty profile is a valid, non-error state.
				setDegraded(result.degraded && result.repos.length === 0);
				setError(result.degraded && result.repos.length === 0);
			} catch (err) {
				if (controller.signal.aborted) {
					return;
				}
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

	const reload = useCallback(() => setReloadKey((key) => key + 1), []);

	return { repos, loading, refreshing, error, degraded, reload };
}

function PortfolioEmptyState({
	degraded,
	error,
	refreshing,
	reload,
}: {
	degraded: boolean;
	error: boolean;
	refreshing: boolean;
	reload: () => void;
}) {
	return (
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
							<a href="https://github.com/byronwade" target="_blank" rel="noopener noreferrer">
								Open GitHub
								<ExternalLink className="size-3.5" aria-hidden="true" />
							</a>
						}
					/>
				</div>
			}
		/>
	);
}

/** Mirrors RepoRow's shape so the swap to real data does not shift layout. */
function RepoSkeletonList() {
	return (
		<div aria-busy="true" className="flex flex-col">
			<p className="sr-only" role="status">
				Loading repositories…
			</p>
			{["a", "b", "c", "d", "e", "f"].map((id) => (
				<div
					className="flex animate-pulse flex-col gap-2 border-border border-b py-5 last:border-b-0"
					key={`skeleton-${id}`}
				>
					<div className="flex items-baseline gap-4">
						<div className="h-3 w-12 shrink-0 rounded bg-muted" />
						<div className="h-4 w-1/3 rounded bg-muted" />
					</div>
					<div className="h-3 w-2/3 rounded bg-muted/70 sm:ml-16" />
				</div>
			))}
		</div>
	);
}

/**
 * One repository row — Showcase profile.
 *
 * The organizing move for /portfolio (DESIGN.md §7.1) is raw open-source
 * activity sorted by signal. A card grid worked against that: cards give every
 * repository the same visual weight regardless of how much traction it has, and
 * §13 rejects the card-grid reflex outright. Star count now leads the row, so
 * the sort order is visible as structure rather than buried in a metadata strip.
 */
function RepoRow({ repo }: { repo: GitHubRepo }) {
	return (
		<IndexRow>
			<a
				className={indexRowLinkClass}
				href={repo.html_url}
				rel="noopener noreferrer"
				target="_blank"
			>
				<div className="flex items-baseline gap-4">
					<span
						className={`flex w-12 shrink-0 items-center gap-1 font-mono text-muted-foreground/70 text-xs tabular-nums ${indexRowAccentClass}`}
					>
						<Star aria-hidden="true" className="size-3" />
						{repo.stargazers_count}
					</span>

					<span className="flex min-w-0 flex-1 items-baseline gap-2.5">
						<span className={`truncate font-medium text-foreground ${indexRowAccentClass}`}>
							{titleize(repo.name)}
						</span>
						{repo.archived && (
							<span className="shrink-0 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
								Archived
							</span>
						)}
					</span>

					<span className="hidden shrink-0 items-center gap-3 font-mono text-muted-foreground/70 text-xs tabular-nums sm:flex">
						{repo.language && (
							<span className="inline-flex items-center gap-1.5">
								<span
									className={`size-2 rounded-full ${languageColors[repo.language] ?? "bg-muted-foreground"}`}
								/>
								{repo.language}
							</span>
						)}
						{repo.forks_count > 0 && (
							<span className="inline-flex items-center gap-1">
								<GitFork aria-hidden="true" className="size-3" />
								{repo.forks_count}
							</span>
						)}
						{repo.pushed_at && (
							<time dateTime={repo.pushed_at}>{format(new Date(repo.pushed_at), "MMM yyyy")}</time>
						)}
					</span>

					<ExternalLink
						aria-hidden="true"
						className="size-3.5 shrink-0 text-muted-foreground/50 transition-[transform,color] duration-150 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-brand"
					/>
				</div>

				{repo.description && (
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:pl-16">
						{repo.description}
					</p>
				)}
			</a>
		</IndexRow>
	);
}

export default function PortfolioPage() {
	const { repos, loading, refreshing, error, degraded, reload } = usePortfolioRepos();
	const [visibleRepos, setVisibleRepos] = useState(8);

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-10 sm:gap-12">
				<PageHeader
					aside={
						loading ? null : (
							<Button
								className="gap-2"
								disabled={refreshing}
								onClick={reload}
								size="sm"
								type="button"
								variant="outline"
							>
								<RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
								{refreshing ? "Refreshing…" : "Refresh"}
							</Button>
						)
					}
					lede={
						<>
							Open-source work and experiments. Pulled live from{" "}
							<a
								className="link-underline font-medium"
								href="https://github.com/byronwade"
								rel="noopener noreferrer"
								target="_blank"
							>
								GitHub
							</a>
							. For in-depth case studies, see{" "}
							<Link className="link-underline font-medium" href="/projects">
								projects
							</Link>
							.
						</>
					}
					title="Portfolio"
				/>

				{loading ? (
					<RepoSkeletonList />
				) : error || repos.length === 0 ? (
					<PortfolioEmptyState
						degraded={degraded}
						error={error}
						refreshing={refreshing}
						reload={reload}
					/>
				) : (
					<>
						{degraded && (
							<p
								className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-muted-foreground text-sm"
								role="status"
							>
								Showing a partial response — some GitHub data may be stale. Refresh to try again.
							</p>
						)}
						<IndexList as="ol">
							{repos.slice(0, visibleRepos).map((repo) => (
								<RepoRow key={repo.id} repo={repo} />
							))}
						</IndexList>

						{visibleRepos < repos.length && (
							<div className="text-center">
								<Button
									type="button"
									variant="outline"
									onClick={() => setVisibleRepos((prev) => prev + 8)}
								>
									Load more
								</Button>
								<p className="mt-3 text-muted-foreground text-sm">
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
