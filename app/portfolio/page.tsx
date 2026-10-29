import { connection } from "next/server";
import { EmptyState } from "@/components/common/empty-state";
import { IndexList, indexRowAccentClass, indexRowLinkClass } from "@/components/common/index-list";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ExternalLink, GitFork, Github, RefreshCw, Star } from "@/lib/icons";
import { getGitHubRepositories } from "@/lib/portfolio-data";
import { generateOGImageUrl, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import type { GitHubRepo } from "@/types/github";

/**
 * Language dots, drawn from the taxonomy family rather than raw Tailwind hues.
 *
 * Language is a classification, so it reuses the same four `--type-*` hues the
 * project types use, assigned stably by name.
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
const pushedAtFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	year: "numeric",
});

/**
 * A repository named for its web address keeps that address's spelling:
 * "rebuzzle.byronwade.com", not "Rebuzzle.byronwade.com". Capitalizing a
 * domain makes it read as a misspelled title and no longer as the address.
 */
const WEB_ADDRESS = /\.[a-z]{2,}$/i;

const titleize = (name: string) =>
	WEB_ADDRESS.test(name)
		? name
		: name
				.split(WORD_SEPARATORS)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

const portfolioDescription =
	"Open-source work and experiments, pulled live from GitHub and sorted by stars.";

export const metadata = generateSEOMetadata({
	title: "Portfolio",
	description: portfolioDescription,
	keywords: ["Portfolio", "Open Source", "GitHub", "Byron Wade"],
	image: generateOGImageUrl({
		title: "Portfolio",
		description: portfolioDescription,
		type: "website",
	}),
	type: "website",
	canonical: `${siteUrl}/portfolio`,
});

/** The page's own sort: stars, then last push. The site repository is not a project. */
function selectRepos(repos: GitHubRepo[]): GitHubRepo[] {
	return repos
		.filter((repo) => !(repo.fork || repo.name === "byronwade.com"))
		.sort((a, b) => {
			if (b.stargazers_count !== a.stargazers_count) {
				return b.stargazers_count - a.stargazers_count;
			}
			return new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime();
		});
}

function RefreshLink({ label }: { label: string }) {
	return (
		<Button
			className="gap-2"
			render={
				<a href="/portfolio">
					<RefreshCw aria-hidden="true" className="size-3.5" />
					{label}
				</a>
			}
			size="lg"
			variant="secondary"
		/>
	);
}

function PortfolioUnavailable({ failed }: { failed: boolean }) {
	return (
		<EmptyState
			action={
				<div className="flex flex-wrap items-center gap-3">
					<RefreshLink label="Try again" />
					<Button
						render={
							<a href="https://github.com/byronwade" rel="noopener noreferrer" target="_blank">
								Open GitHub
								<ExternalLink aria-hidden="true" className="size-3.5" />
							</a>
						}
						size="lg"
						variant="secondary"
					/>
				</div>
			}
			description={
				failed
					? "GitHub is slow or unavailable right now. Nothing here is lost; retry, or open the profile directly."
					: "Public repositories will show up here once they’re available."
			}
			icon={Github}
			title={failed ? "Couldn’t load repositories" : "No repositories yet"}
		/>
	);
}

/**
 * One repository row: Showcase profile.
 *
 * The organizing move for /portfolio (DESIGN.md §7.1) is raw open-source
 * activity sorted by signal. Signal leads in the tabular column, stars and the
 * last push, the same column the writing and resume rows use for dates, so
 * the sort order is visible as structure. Language and forks follow the
 * description on every width instead of disappearing on phones.
 */
function RepoRow({ repo }: { repo: GitHubRepo }) {
	return (
		<li>
			<a
				className={indexRowLinkClass}
				href={repo.html_url}
				rel="noopener noreferrer"
				target="_blank"
			>
				<div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row">
					<p className="flex gap-3 text-copy-12 text-muted-foreground tabular-nums sm:w-28 sm:shrink-0 sm:flex-col sm:gap-0.5 sm:pt-1">
						<span className="inline-flex items-center gap-1">
							<Star aria-hidden="true" className="size-3" />
							{repo.stargazers_count}
							<span className="sr-only"> stars</span>
						</span>
						{repo.pushed_at && (
							<time dateTime={repo.pushed_at}>
								{pushedAtFormat.format(new Date(repo.pushed_at))}
							</time>
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
								className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-colors duration-(--motion-fast) ease-(--ease-out) group-hover/row:text-foreground group-focus-visible/row:text-foreground motion-reduce:transition-none"
							/>
						</span>
						{repo.description && (
							<p className="text-pretty text-body text-copy-14">{repo.description}</p>
						)}
						{(repo.language || repo.forks_count > 0) && (
							<p className="flex flex-wrap items-center gap-x-4 text-copy-12 text-muted-foreground tabular-nums">
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
		</li>
	);
}

export default async function PortfolioPage() {
	// Retry must render again after a provider failure. Only successful data is cached.
	await connection();
	let repos: GitHubRepo[] = [];
	let failed = false;
	try {
		repos = selectRepos(await getGitHubRepositories());
	} catch (error) {
		console.error("Error loading portfolio data:", error);
		failed = true;
	}

	return (
		<SiteShell profile="showcase">
			<PageHeader
				aside={<RefreshLink label="Refresh" />}
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
						<a className="link-underline font-medium" href="/projects">
							projects
						</a>
						.
					</>
				}
				title="Portfolio"
			/>

			{failed || repos.length === 0 ? (
				<PortfolioUnavailable failed={failed} />
			) : (
				<IndexList as="ol">
					{repos.map((repo) => (
						<RepoRow key={repo.id} repo={repo} />
					))}
				</IndexList>
			)}
		</SiteShell>
	);
}
