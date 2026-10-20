import { connection } from "next/server";
import { EmptyState } from "@/components/common/empty-state";
import {
	IndexList,
	IndexRow,
	indexRowAccentClass,
	indexRowLinkClass,
} from "@/components/common/index-list";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
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

const titleize = (name: string) =>
	name
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
			role="link"
			render={
				<a href="/portfolio">
					<RefreshCw aria-hidden="true" className="size-3.5" />
					{label}
				</a>
			}
			size={label === "Refresh" ? "sm" : "default"}
			variant="outline"
		/>
	);
}

function PortfolioUnavailable({ failed }: { failed: boolean }) {
	return (
		<EmptyState
			action={
				<div className="flex flex-wrap items-center justify-center gap-2">
					<RefreshLink label="Try again" />
					<Button
						role="link"
						render={
							<a href="https://github.com/byronwade" rel="noopener noreferrer" target="_blank">
								Open GitHub
								<ExternalLink aria-hidden="true" className="size-3.5" />
							</a>
						}
						variant="outline"
					/>
				</div>
			}
			description={
				failed
					? "GitHub is slow or unavailable right now. Retry here, or open the profile directly."
					: "Public repositories will show up here once they’re available."
			}
			icon={Github}
			title={failed ? "Couldn't load repositories" : "No repositories yet"}
		/>
	);
}

/**
 * One repository row. Star count leads so the sort order is visible as structure.
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
						className={`flex w-12 shrink-0 items-center gap-1 font-mono text-muted-foreground text-xs tabular-nums ${indexRowAccentClass}`}
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

					<span className="hidden shrink-0 items-center gap-3 font-mono text-muted-foreground text-xs tabular-nums sm:flex">
						{repo.language && (
							<span className="inline-flex items-center gap-1.5">
								<span className={`size-2 rounded-full ${languageTone(repo.language)}`} />
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
							<time dateTime={repo.pushed_at}>
								{pushedAtFormat.format(new Date(repo.pushed_at))}
							</time>
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
		<SiteShell width="wide">
			<div className="flex flex-col gap-10 sm:gap-12">
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
			</div>
		</SiteShell>
	);
}
