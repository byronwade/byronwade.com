import { PostRow } from "@/components/blog/post-row";
import { IndexList } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { getBlogPosts } from "@/lib/blog";
import { safeFormatDate } from "@/lib/markdown-utils";
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
 * excerpt. Rows are separated by space, not rules or cards (Thorbis D-017),
 * and use the same PostRow as the home preview and related posts: one writing
 * index pattern for the site.
 */
async function BlogList() {
	const posts = await getBlogPosts();

	if (posts.length === 0) {
		return (
			<p className="text-body text-copy-16 leading-relaxed">
				Nothing is published yet. The first post is in progress; until then, the{" "}
				<Link className="link-underline" href="/projects" prefetch={false}>
					project write-ups
				</Link>{" "}
				cover the same ground.
			</p>
		);
	}

	// Posts arrive newest-first; grouping preserves that order inside each year.
	const byYear = new Map<string, typeof posts>();
	for (const post of posts) {
		const year = safeFormatDate(post.date, "yyyy") || "Undated";
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
				<section aria-labelledby={`year-${year}`} className="flex flex-col gap-2" key={year}>
					{/* The year is the only thing that needs saying between groups. */}
					<h2 className="text-copy-12 text-muted-foreground tabular-nums" id={`year-${year}`}>
						{year}
					</h2>
					<IndexList as="ol">
						{yearPosts.map((post) => (
							<PostRow dateFormat="MMM d" key={post.slug} post={post} tagLimit={4} />
						))}
					</IndexList>
				</section>
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

			<SiteShell profile="showcase">
				<div className="flex flex-col gap-8 sm:gap-10">
					<PageHeader
						lede="Notes from building products and running a service business. Design systems, field ops, and the software that has to work out in the truck."
						title="Writing"
					/>

					<div className="w-full">
						<BlogList />
					</div>
				</div>
			</SiteShell>
		</>
	);
}
