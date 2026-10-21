"use client";

import { format } from "date-fns";
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
import { StatusPill } from "@/components/ui/status-pill";
import { ExternalLink, GitFork, Github, RefreshCw, Star } from "@/lib/icons";
import type { GitHubRepo } from "@/types/github";

/**
 * Language dots, drawn from the taxonomy family rather than raw Tailwind hues.
 *
 * This was ten hardcoded palette colours (`bg-blue-500`, `bg-rose-600`, and so
 * on), which is exactly the page-local palette §5.1 forbids: none of them were
 * tokens, none had a dark-mode counterpart, and they were the most saturated
 * thing on the page. Language is a classification, so it reuses the same four
 * `--type-*` hues the project types use, assigned stably by name.
 */
const LANGUAGE_TONES = [
	"bg-type-product",
	"bg-type-client",
	"bg-type-concept",
	"bg-type-hobby",
] as const;

function languageTone(language: string): string {
	let hash = 0;
	for (const char of language) {
		hash = (hash + char.charCodeAt(0)) % LANGUAGE_TONES.length;
	}
	return LANGUAGE_TONES[hash] ?? "bg-muted-foreground";
}

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
		degraded: Boolean(data.githubFailed),
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
 * Loads the repository list, keeping the request lifecycle, abort on unmount,
 * timeout, refresh-vs-initial-load, out of the rendering component.
 */
function usePortfolioRepos(): PortfolioReposState {
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(false);
	const [degraded, setDegraded] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		// A timeout must recover the mounted page; cleanup must stay silent.
		let active = true;
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
				if (!active) {
					return;
				}
				setRepos(result.repos);
				// An empty list is only an error when the upstream call degraded; a
				// genuinely empty profile is a valid, non-error state.
				setDegraded(result.degraded && result.repos.length === 0);
				setError(result.degraded && result.repos.length === 0);
			} catch (err) {
				if (!active) {
					return;
				}
				console.error("Error loading portfolio data:", err);
				setError(true);
			} finally {
				clearTimeout(timeoutId);
				if (active) {
					setLoading(false);
					setRefreshing(false);
				}
			}
		})();

		return () => {
			active = false;
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
			title={degraded || error ? "Couldn’t load repositories" : "No repositories yet"}
			description={
				degraded || error
					? "GitHub is slow or unavailable right now. Nothing here is lost; retry, or open the profile directly."
					: "Public repositories will show up here once they’re available."
			}
			action={
				<div className="flex flex-wrap items-center gap-3">
					<Button type="button" onClick={reload} disabled={refreshing} className="gap-2">
						<RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
						{refreshing ? "Retrying…" : "Try again"}
					</Button>
					<Button
						role="link"
						variant="secondary"
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
		<div aria-busy="true" className="flex animate-pulse flex-col gap-1">
			<p className="sr-only" role="status">
				Loading repositories…
			</p>
			{["a", "b", "c", "d", "e", "f"].map((id) => (
				<div className="flex flex-col gap-x-6 gap-y-2 py-4 sm:flex-row" key={`skeleton-${id}`}>
					<div className="h-3 w-16 shrink-0 rounded-sm bg-muted sm:mt-1 sm:w-28" />
					<div className="flex flex-1 flex-col gap-2">
						<div className="h-4 w-1/3 rounded-sm bg-muted" />
						<div className="h-3 w-2/3 rounded-sm bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}

/**
 * One repository row: Showcase profile.
 *
 * The organizing move for /portfolio (DESIGN.md §7.1) is raw open-source
 * activity sorted by signal. Signal leads in the mono column, stars and the
 * last push, the same column the writing and resume rows use for dates, so
 * the sort order is visible as structure. Language and forks follow the
 * description on every width instead of disappearing on phones.
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
				<div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row">
					<p className="flex gap-3 font-mono text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:flex-col sm:gap-0.5 sm:pt-1">
						<span className="inline-flex items-center gap-1">
							<Star aria-hidden="true" className="size-3" />
							{repo.stargazers_count}
							<span className="sr-only"> stars</span>
						</span>
						{repo.pushed_at && (
							<time dateTime={repo.pushed_at}>{format(new Date(repo.pushed_at), "MMM yyyy")}</time>
						)}
					</p>
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						<span className="flex items-center gap-2">
							<span
								className={`wrap-anywhere font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}
							>
								{titleize(repo.name)}
							</span>
							{repo.archived && <StatusPill className="shrink-0">Archived</StatusPill>}
							<ExternalLink
								aria-hidden="true"
								className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/row:text-brand"
							/>
						</span>
						{repo.description && (
							<p className="text-body text-copy-14 leading-relaxed">{repo.description}</p>
						)}
						{(repo.language || repo.forks_count > 0) && (
							<p className="flex flex-wrap items-center gap-x-4 font-mono text-copy-12 text-muted-foreground tabular-nums">
								{repo.language && (
									<span className="inline-flex items-center gap-1.5">
										<span
											aria-hidden="true"
											className={`size-2 rounded-full ${languageTone(repo.language)}`}
										/>
										{repo.language}
									</span>
								)}
								{repo.forks_count > 0 && (
									<span className="inline-flex items-center gap-1">
										<GitFork aria-hidden="true" className="size-3" />
										{repo.forks_count}
										<span className="sr-only"> forks</span>
									</span>
								)}
							</p>
						)}
					</div>
				</div>
				<span className="sr-only"> (opens in a new tab)</span>
			</a>
		</IndexRow>
	);
}
export default function PortfolioPage() {
	const { repos, loading, refreshing, error, degraded, reload } = usePortfolioRepos();
	const [visibleRepos, setVisibleRepos] = useState(8);

	return (
		<SiteShell profile="showcase">
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
								variant="secondary"
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
							<p className="rounded-lg bg-muted px-4 py-3 text-body text-copy-14" role="status">
								This is a partial response, so some GitHub data may be stale. Refresh to try again.
							</p>
						)}
						<IndexList as="ol">
							{repos.slice(0, visibleRepos).map((repo) => (
								<RepoRow key={repo.id} repo={repo} />
							))}
						</IndexList>

						{visibleRepos < repos.length && (
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
								<Button
									onClick={() => setVisibleRepos((prev) => prev + 8)}
									type="button"
									variant="secondary"
								>
									Show more
								</Button>
								<p className="text-copy-13 text-muted-foreground tabular-nums">
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
