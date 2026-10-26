import { notFound } from "next/navigation";
import { PostPager, ReadingProgress, RelatedPosts, SocialShare } from "@/components/blog";
import { TopicNav } from "@/components/blog/topic-nav";
import { BlogPostViewTracker, Markdown, PageToc, TagList } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { getAdjacentPosts, getAllBlogSlugs, getBlogPost, getBlogTopics } from "@/lib/blog";
import { ArrowLeft } from "@/lib/icons";
import { extractToc } from "@/lib/markdown";
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
 * Only the loader's published slugs are pages, so other URLs get a real 404
 * before any response is sent and cannot become cached pages on demand.
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
	const [post, adjacent, topics] = await Promise.all([
		getBlogPost(slug),
		getAdjacentPosts(slug),
		getBlogTopics(),
	]);

	if (!post) {
		notFound();
	}

	const url = `${siteUrl}/blog/${slug}`;
	const ogImage = generateOGImageUrl({
		title: post.title,
		description: post.excerpt || "",
		type: "article",
		date: post.date,
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

			{/* SiteShell owns the rhythm between these blocks (DESIGN.md §7.4).
			    The identity block matches the case study's: the facts line, then
			    the title and lede. Sharing sits at the foot, after reading. */}
			<header className="flex w-full flex-col gap-4">
				<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-copy-13 text-muted-foreground tabular-nums">
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
				<h1 className="text-balance font-heading font-medium text-foreground text-heading-32 tracking-tight">
					{post.title}
				</h1>
				{post.excerpt && (
					<p className="text-pretty text-body text-copy-16 leading-relaxed">{post.excerpt}</p>
				)}
				{post.tags && post.tags.length > 0 && <TagList className="pt-1" tags={post.tags} />}
			</header>

			{/* The prose on the measure, its outline docked in the right gutter on
			    wide screens, as on a case study, so long posts can be navigated
			    without moving the text's edge. */}
			<div className="relative w-full">
				<article className="w-full">
					<Markdown content={post.content} />
				</article>
				<PageToc items={extractToc(post.content)} />
			</div>

			{/* Where to read next on the same subject, right after the prose. */}
			<TopicNav
				heading="More on these topics"
				topics={topics.filter((topic) => topic.posts.some(({ slug: other }) => other === slug))}
			/>

			<PostPager newer={adjacent.newer} older={adjacent.older} />

			{/* Related Posts */}
			<RelatedPosts
				currentSlug={post.slug}
				exclude={[adjacent.newer, adjacent.older].flatMap((neighbour) =>
					neighbour ? [neighbour.slug] : []
				)}
				limit={3}
			/>

			{/* Left-aligned like everything else on the page. Centring these two was
			    the only place the site abandoned its left edge. */}
			<div className="flex w-full flex-col gap-3">
				<p className="text-copy-13 text-muted-foreground">Share this post</p>
				<SocialShare description={post.excerpt} title={post.title} url={url} />
				<Link className="link-action w-fit" href="/blog">
					<ArrowLeft aria-hidden="true" className="size-4" />
					Back to writing
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
			<SiteShell profile="evidence">
				<BlogPostContent slug={slug} />
			</SiteShell>
		</>
	);
}
