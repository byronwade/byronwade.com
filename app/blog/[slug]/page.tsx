import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReadingProgress, RelatedPosts, SocialShare } from "@/components/blog";
import { BlogPostViewTracker, Markdown, TagList } from "@/components/common";
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
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
			/>

			{/* Header Section */}
			<div className="reveal w-full">
				<div className="flex w-full flex-col items-start gap-3">
					<div className="flex w-full flex-col gap-3">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							{post.title}
						</h1>
						{post.excerpt && (
							<p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
								{post.excerpt}
							</p>
						)}
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
							{post.date && (
								<time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
							)}
							<span aria-hidden="true">·</span>
							<span>{post.readingTime} min read</span>
						</div>
						{post.tags && post.tags.length > 0 && (
							<TagList tags={post.tags} itemClassName="px-2.5 py-1 text-xs" />
						)}
						<SocialShare url={url} title={post.title} description={post.excerpt} className="mt-1" />
					</div>
				</div>
			</div>

			{/* Blog Post Content */}
			<article className="reveal reveal-delay-1 w-full">
				<Markdown content={post.content} />
			</article>

			{/* Related Posts */}
			<RelatedPosts currentSlug={post.slug} limit={3} />

			{/* Social Share and Back to blog at bottom */}
			<div className="reveal reveal-delay-2 w-full flex flex-col gap-4 mt-8">
				<SocialShare
					url={url}
					title={post.title}
					description={post.excerpt}
					className="justify-center"
				/>
				<Link
					className="group flex w-full items-center justify-center gap-2"
					aria-label="Go to blog"
					href="/blog"
				>
					<span className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand">
						← Back to blog
					</span>
				</Link>
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
				<Suspense
					fallback={
						<div className="w-full animate-pulse space-y-4">
							<div className="mb-4 h-8 w-3/4 rounded bg-muted" />
							<div className="mb-8 h-4 w-1/2 rounded bg-muted" />
							<div className="h-4 w-full rounded bg-muted" />
							<div className="h-4 w-full rounded bg-muted" />
							<div className="h-4 w-3/4 rounded bg-muted" />
						</div>
					}
				>
					<BlogPostContent slug={slug} />
				</Suspense>
			</SiteShell>
		</>
	);
}
