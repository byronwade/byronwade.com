import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReadingProgress, RelatedPosts, SocialShare } from "@/components/blog";
import { BlogPostViewTracker, Markdown } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import {
	generateArticleStructuredData,
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
} from "@/lib/seo";

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

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const url = `${baseUrl}/blog/${slug}`;
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
		],
		image: ogImage,
		type: "article",
		author: "Byron Wade",
		publishedTime: post.date,
		modifiedTime: post.date,
		tags: [],
		canonical: url,
	});
}

async function BlogPostContent({ slug }: { slug: string }) {
	const post = await getBlogPost(slug);
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

	if (!post) {
		notFound();
	}

	const url = `${baseUrl}/blog/${slug}`;
	const ogImage = generateOGImageUrl({
		title: post.title,
		description: post.excerpt || "",
		type: "article",
		date: post.date,
		author: "Byron Wade",
	});

	// Generate structured data
	const articleStructuredData = generateArticleStructuredData({
		title: post.title,
		description: post.excerpt || "",
		author: "Byron Wade",
		publishedTime: post.date,
		modifiedTime: post.date,
		image: ogImage,
		url,
	});

	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Blog", url: `${baseUrl}/blog` },
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
					<div className="flex w-full flex-col gap-2">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							{post.title}
						</h1>
						{post.date && (
							<time className="text-xs text-muted-foreground">
								{format(new Date(post.date), "MMMM d, yyyy")}
							</time>
						)}
						<SocialShare url={url} title={post.title} description={post.excerpt} className="mt-4" />
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
