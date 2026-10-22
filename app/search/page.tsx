import type { Metadata } from "next";
import Link from "next/link";
import { IndexList, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildPageSearchIndex } from "@/lib/search-index";
import { groupSearchResults, normalizeSearchQuery, SEARCH_QUERY_MAX } from "@/lib/search-match";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = generateSEOMetadata({
	title: "Search",
	description:
		"Search pages, projects, and writing on Byron Wade's site, including the text of each article.",
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
	const groups = query ? groupSearchResults(await buildPageSearchIndex(), query) : [];
	const count = groups.reduce((total, group) => total + group.items.length, 0);

	return (
		<SiteShell profile="guided">
			<PageHeader
				lede="Pages, plus the titles, summaries, tags, and text of the projects and writing."
				title="Search"
			/>
			<search>
				<form
					action="/search"
					className="flex flex-col gap-3 sm:flex-row sm:items-end"
					method="get"
				>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<label className="font-medium text-copy-14 text-foreground" htmlFor="site-search">
							Search this site
						</label>
						<Input
							autoComplete="off"
							defaultValue={query}
							id="site-search"
							maxLength={SEARCH_QUERY_MAX}
							name="q"
							placeholder="Thorbis, dispatch, design systems…"
							type="search"
						/>
					</div>
					<Button type="submit">Search</Button>
				</form>
			</search>

			{query ? (
				<div className="flex flex-col gap-8">
					<p className="wrap-anywhere text-copy-14 text-muted-foreground">
						{count === 1 ? "1 result" : `${count} results`} for “{query}”.
					</p>
					{count === 0 ? (
						<NoMatches />
					) : (
						groups.map((group) => (
							<section aria-labelledby={`search-${group.kind}`} key={group.kind}>
								<h2 className="mb-1 text-copy-12 text-muted-foreground" id={`search-${group.kind}`}>
									{group.label}
								</h2>
								<IndexList>
									{group.items.map((entry) => (
										<li key={entry.href}>
											<Link className={indexRowLinkClass} href={entry.href} prefetch={false}>
												<span className="flex items-baseline justify-between gap-4">
													<span
														className={`font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}
													>
														{entry.label}
													</span>
													{entry.meta ? (
														<span className="shrink-0 text-copy-12 text-muted-foreground">
															{entry.meta}
														</span>
													) : null}
												</span>
											</Link>
										</li>
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
		</SiteShell>
	);
}

function NoMatches() {
	return (
		<p className="text-copy-14 text-muted-foreground">
			No matches. Try a shorter name, or{" "}
			<Link className="link-underline" href="/projects" prefetch={false}>
				browse projects
			</Link>
			.
		</p>
	);
}
