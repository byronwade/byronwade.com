import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReadingProgress, RelatedPosts, SocialShare } from "@/components/blog";
import { BlogPostViewTracker, Markdown, TagList } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
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
			`Read ${post.title} by Byron Wade. Full-stack developer insights, web development tips, and performance optimization strategies.`,
		keywords: [
			"Blog",
			"Web Development",
			"JavaScript",
			"React",
			"Next.js",
			"Programming",
			"Tutorial",
			...(post.tags ?? []),
		],
		image: ogImage,
		type: "article",
		author: "Byron Wade",
		publishedTime: post.date,
		modifiedTime: post.date,
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
		modifiedTime: post.date,
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
						{post.date && (
							<time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
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

/** Mirrors the article's real rhythm so the swap does not shift the page. */
function PostFallback() {
	return (
		<div aria-busy="true" className="flex w-full animate-pulse flex-col gap-4">
			<p className="sr-only" role="status">
				Loading post…
			</p>
			<div className="h-9 w-3/4 rounded bg-muted" />
			<div className="h-4 w-1/2 rounded bg-muted/70" />
			<div className="mt-4 h-4 w-full rounded bg-muted/70" />
			<div className="h-4 w-full rounded bg-muted/70" />
			<div className="h-4 w-2/3 rounded bg-muted/70" />
		</div>
	);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<>
			<ReadingProgress />
			<SiteShell>
				<Suspense fallback={<PostFallback />}>
					<BlogPostContent slug={slug} />
				</Suspense>
			</SiteShell>
		</>
	);
}
