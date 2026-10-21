import { notFound } from "next/navigation";
import { ReadingProgress, RelatedPosts, SocialShare } from "@/components/blog";
import { BlogPostViewTracker, Markdown, TagList } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { safeFormatDate } from "@/lib/markdown-utils";
import {
	generateArticleStructuredData,
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Only the loader's slugs are pages, so other URLs get a real 404 before any
 * response is sent. The `notFound()` below runs inside Suspense, after the 200
 * status and the skeleton are already streamed, and then gets cached as a page.
 * Development regenerates this list on every request, so drafts still preview.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
	const slugs = await getAllBlogSlugs();
	return slugs.map((slug) => ({
		slug,
	}));
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<import("next").Metadata> {
	const { slug } = await params;
	const post = await getBlogPost(slug);

	if (!post) {
		return {};
	}

	const url = `${siteUrl}/blog/${slug}`;
	const ogImage = generateOGImageUrl({
		title: post.title,
		description: post.excerpt || "",
		type: "article",
		date: post.date,
		author: "Byron Wade",
	});

	return generateSEOMetadata({
		title: post.title,
		description:
			post.excerpt ||
			`Read ${post.title} by Byron Wade, with lessons from plumbing, field service, product, and software.`,
		keywords: ["Blog", "Byron Wade", ...(post.tags ?? [])],
		image: ogImage,
		type: "article",
		author: "Byron Wade",
		publishedTime: post.date,
		modifiedTime: post.updated ?? post.date,
		tags: post.tags ?? [],
		canonical: url,
	});
}

async function BlogPostContent({ slug }: { slug: string }) {
	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	const url = `${siteUrl}/blog/${slug}`;
	const ogImage = generateOGImageUrl({
		title: post.title,
		description: post.excerpt || "",
		type: "article",
		date: post.date,
		author: "Byron Wade",
	});

	const articleStructuredData = generateArticleStructuredData({
		title: post.title,
		description: post.excerpt || "",
		author: "Byron Wade",
		publishedTime: post.date,
		modifiedTime: post.updated ?? post.date,
		image: ogImage,
		url,
		tags: post.tags,
	});

	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Blog", url: `${siteUrl}/blog` },
		{ name: post.title, url },
	]);

	return (
		<>
			{/* Analytics Tracking */}
			<BlogPostViewTracker slug={post.slug} title={post.title} />

			{/* Structured Data */}
			<JsonLd data={articleStructuredData} />
			<JsonLd data={breadcrumbStructuredData} />

			{/* One owner for the vertical rhythm (§5.3). These four blocks were
			    siblings of a fragment with no gap between them, so the tag row sat
			    flush against the article's first paragraph. */}
			<div className="flex w-full flex-col gap-10">
				{/* The article's own identity block. Three levels of single-child <div>
			    wrapper were removed with it, and the share row moved to the foot.
			    Sharing is something a reader does after reading, and having it in
			    both places meant the same control competed with itself. */}
				<header className="reveal flex w-full flex-col gap-3">
					<h1 className="font-heading font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
						{post.title}
					</h1>
					{post.excerpt && (
						<p className="max-w-2xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
					)}
					<p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-muted-foreground text-xs tabular-nums">
						{post.date && <time dateTime={post.date}>{safeFormatDate(post.date)}</time>}
						{post.updated && post.updated !== post.date && (
							<>
								<span aria-hidden="true">·</span>
								<time dateTime={post.updated}>Updated {safeFormatDate(post.updated)}</time>
							</>
						)}
						<span aria-hidden="true">·</span>
						<span>{post.readingTime} min read</span>
					</p>
					{post.tags && post.tags.length > 0 && (
						<TagList itemClassName="px-2.5 py-1 text-xs" tags={post.tags} />
					)}
				</header>

				{/* Blog Post Content */}
				<article className="reveal reveal-delay-1 w-full">
					<Markdown content={post.content} />
				</article>

				{/* Related Posts */}
				<RelatedPosts currentSlug={post.slug} limit={3} />

				{/* Left-aligned like everything else on the page. Centring these two was
			    the only place the site abandoned its left edge. */}
				<div className="reveal reveal-delay-2 flex w-full flex-col gap-4 border-border border-t pt-8">
					<SocialShare description={post.excerpt} title={post.title} url={url} />
					<Link className="link-underline w-fit text-sm" href="/blog">
						← Back to writing
					</Link>
				</div>
			</div>
		</>
	);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<>
			<ReadingProgress />
			<SiteShell>
				<BlogPostContent slug={slug} />
			</SiteShell>
		</>
	);
}
