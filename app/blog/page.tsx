import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { TagList } from "@/components/common/tag-list";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { getBlogPosts } from "@/lib/blog";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export async function generateMetadata() {
	const ogImage = generateOGImageUrl({
		title: "Writing",
		description: "Notes on building products, design systems, and software for service businesses.",
		type: "blog",
	});

	return generateSEOMetadata({
		title: "Writing",
		description:
			"Notes on building products, design systems, and software for service businesses, from field operations to modern Next.js apps.",
		keywords: [
			"Blog",
			"Writing",
			"Field Service",
			"Design Systems",
			"Next.js",
			"Product Engineering",
			"Service Business Software",
			"Byron Wade",
		],
		image: ogImage,
		type: "website",
		canonical: `${siteUrl}/blog`,
	});
}

/**
 * Writing index: Showcase profile.
 *
 * The organizing move for /blog (DESIGN.md §7.1) is chronology with the lede
 * visible, so scanning is reading. Posts group by year and every row keeps its
 * excerpt. This is an open list on hairlines rather than a card: a card around
 * the whole list would be decoration, and §13 rejects bordered rows. The grammar
 * deliberately matches components/project/projects-index.tsx: one index pattern
 * for the site, two kinds of content.
 */
async function BlogList() {
	const posts = await getBlogPosts();

	if (posts.length === 0) {
		return (
			<p className="text-muted-foreground text-sm leading-relaxed">
				Nothing published yet. The first post is in progress.
			</p>
		);
	}

	// Posts arrive newest-first; grouping preserves that order inside each year.
	const byYear = new Map<string, typeof posts>();
	for (const post of posts) {
		const year = post.date ? String(new Date(post.date).getFullYear()) : "Undated";
		const bucket = byYear.get(year);
		if (bucket) {
			bucket.push(post);
		} else {
			byYear.set(year, [post]);
		}
	}

	return (
		<div className="flex flex-col gap-10">
			{[...byYear.entries()].map(([year, yearPosts]) => (
				<section className="flex flex-col gap-3" key={year}>
					{/* The year is the only thing that needs saying between groups. The
					    per-year post count that used to sit opposite it was a number no
					    reader had asked for, competing with the dates in every row. */}
					<h2 className="font-mono text-muted-foreground text-xs tabular-nums">{year}</h2>

					<IndexList as="ol">
						{yearPosts.map((post) => (
							<IndexRow key={post.slug}>
								<Link className={indexRowLinkClass} href={`/blog/${post.slug}`}>
									<div className="flex items-baseline gap-4">
										{post.date && (
											<time
												className="w-12 shrink-0 font-mono text-muted-foreground/70 text-xs tabular-nums"
												dateTime={post.date}
											>
												{format(new Date(post.date), "MMM d")}
											</time>
										)}
										<span
											className={`min-w-0 flex-1 font-medium text-foreground ${indexRowAccentClass}`}
										>
											{post.title}
										</span>
										<span className="hidden shrink-0 items-center gap-1 font-mono text-muted-foreground/70 text-xs tabular-nums sm:flex">
											<Clock aria-hidden="true" className="size-3" />
											{post.readingTime}m
										</span>
									</div>

									{post.excerpt && (
										<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed sm:pl-16">
											{post.excerpt}
										</p>
									)}

									{post.tags && post.tags.length > 0 && (
										<div className="sm:pl-16">
											<TagList className="pt-0.5" limit={4} tags={post.tags} />
										</div>
									)}
								</Link>
							</IndexRow>
						))}
					</IndexList>
				</section>
			))}
		</div>
	);
}

/**
 * Mirrors a real row rather than showing rounded slabs. The previous fallback
 * was three 64px pills, which meant the layout jumped on every load. §4.7 puts
 * that squarely in the design's remit, not the implementation's.
 */
function BlogFallback() {
	return (
		<div aria-busy="true" className="flex animate-pulse flex-col border-border border-t">
			<p className="sr-only" role="status">
				Loading posts…
			</p>
			{["a", "b", "c", "d", "e"].map((id) => (
				<div className="flex flex-col gap-2 border-border border-b py-5" key={`skeleton-${id}`}>
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

export default function BlogPage() {
	// Generate structured data
	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Blog", url: `${siteUrl}/blog` },
	]);

	return (
		<>
			{/* Structured Data */}
			<JsonLd data={websiteStructuredData} />
			<JsonLd data={breadcrumbStructuredData} />

			<SiteShell>
				<div className="flex flex-col gap-8 sm:gap-10">
					<PageHeader
						lede="Notes from building products and running a service business. Design systems, field ops, and the software that has to work out in the truck."
						title="Writing"
					/>

					<div className="reveal reveal-delay-1 w-full">
						<Suspense fallback={<BlogFallback />}>
							<BlogList />
						</Suspense>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
