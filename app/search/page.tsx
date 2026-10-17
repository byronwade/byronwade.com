import type { Metadata } from "next";
import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildSearchIndex } from "@/lib/search-index";
import { groupSearchResults, normalizeSearchQuery, SEARCH_QUERY_MAX } from "@/lib/search-match";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = generateSEOMetadata({
	title: "Search",
	description: "Search the projects, writing, and pages on Byron Wade's site.",
	canonical: `${siteUrl}/search`,
	noindex: true,
	type: "website",
});

function firstQuery(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string | string[] }>;
}) {
	const params = await searchParams;
	const query = normalizeSearchQuery(firstQuery(params.q));
	const groups = query ? groupSearchResults(await buildSearchIndex(), query) : [];
	const count = groups.reduce((total, group) => total + group.items.length, 0);

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-10">
				<PageHeader lede="Projects, writing, and the other pages on this site." title="Search" />
				<search>
					<form
						action="/search"
						className="flex flex-col gap-3 sm:flex-row sm:items-end"
						method="get"
					>
						<div className="flex min-w-0 flex-1 flex-col gap-2">
							<label className="text-copy-13 text-muted-foreground" htmlFor="site-search">
								Search this site
							</label>
							<Input
								autoComplete="off"
								className="h-11 sm:h-11"
								defaultValue={query}
								id="site-search"
								maxLength={SEARCH_QUERY_MAX}
								name="q"
								placeholder="Projects, writing, pages"
								type="search"
							/>
						</div>
						<Button size="lg" type="submit">
							Search
						</Button>
					</form>
				</search>

				{query ? (
					<div className="flex flex-col gap-8">
						<p className="text-copy-14 text-muted-foreground">
							{count === 1 ? "1 result" : `${count} results`} for “{query}”.
						</p>
						{count === 0 ? (
							<NoMatches />
						) : (
							groups.map((group) => (
								<section aria-labelledby={`search-${group.kind}`} key={group.kind}>
									<h2
										className="mb-2 text-copy-13 text-muted-foreground"
										id={`search-${group.kind}`}
									>
										{group.label}
									</h2>
									<IndexList>
										{group.items.map((entry) => (
											<IndexRow key={entry.href}>
												<Link className={indexRowLinkClass} href={entry.href} prefetch={false}>
													<span className="flex items-baseline justify-between gap-4">
														<span className={`font-medium text-foreground ${indexRowAccentClass}`}>
															{entry.label}
														</span>
														{entry.meta ? (
															<span className="shrink-0 text-muted-foreground text-xs">
																{entry.meta}
															</span>
														) : null}
													</span>
												</Link>
											</IndexRow>
										))}
									</IndexList>
								</section>
							))
						)}
					</div>
				) : (
					<p className="text-copy-14 text-muted-foreground">
						Type a name, then search. You can also{" "}
						<Link className="link-underline" href="/projects" prefetch={false}>
							browse projects
						</Link>{" "}
						or{" "}
						<Link className="link-underline" href="/blog" prefetch={false}>
							read the writing
						</Link>
						.
					</p>
				)}
			</div>
		</SiteShell>
	);
}

function NoMatches() {
	return (
		<p className="text-copy-14 text-muted-foreground">
			Nothing on the site uses those words. Try a shorter name, or{" "}
			<Link className="link-underline" href="/projects" prefetch={false}>
				browse projects
			</Link>
			.
		</p>
	);
}
