import { BlogPostViewTracker } from "@/components/analytics-tracker";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import {
	generateArticleStructuredData,
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
} from "@/lib/seo";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
			<div className="animate-in w-full">
				<div className="flex flex-col gap-3 items-start w-full">
					<Link
						className="group flex items-center gap-2 w-full touch-target"
						aria-label="Go to blog"
						href="/blog"
					>
						<span className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200">
							← Back to blog
						</span>
					</Link>

					<div className="flex flex-col gap-2 w-full">
						<h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] tracking-tight">
							{post.title}
						</h1>
						{post.date && (
							<p className="text-xs text-[var(--muted-foreground)]">
								{format(new Date(post.date), "MMMM d, yyyy")}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Blog Post Content */}
			<article className="animate-in animate-delay-1 w-full">
				<div className="font-normal min-w-full relative shrink-0 text-[var(--foreground)] text-base flex flex-col gap-5">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeHighlight]}
						components={{
							p: ({ children, ...props }) => (
								<p className="leading-relaxed" {...props}>
									{children}
								</p>
							),
							a: ({
								children,
								href,
								...props
							}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
								const linkHref = href || "";
								const isExternal = linkHref.startsWith("http");
								return (
									<a
										href={linkHref}
										target={isExternal ? "_blank" : undefined}
										rel={isExternal ? "noopener noreferrer" : undefined}
										className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] hover:decoration-[var(--foreground)] transition-colors duration-200"
										{...props}
									>
										{children}
									</a>
								);
							},
							strong: ({ children, ...props }) => (
								<strong className="font-semibold text-[var(--foreground)]" {...props}>
									{children}
								</strong>
							),
							em: ({ children, ...props }) => (
								<em className="italic" {...props}>
									{children}
								</em>
							),
							code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
								const isInline = !className;
								if (isInline) {
									return (
										<code
											className="text-yellow-600 dark:text-yellow-500 bg-[var(--muted)] px-1.5 py-0.5 rounded text-sm font-mono"
											{...props}
										>
											{children}
										</code>
									);
								}
								return (
									<code className={className} {...props}>
										{children}
									</code>
								);
							},
							pre: ({ children, ...props }) => (
								<pre
									className="bg-[var(--muted)] border border-[var(--border)] rounded-lg my-4 p-4 overflow-x-auto text-sm"
									{...props}
								>
									{children}
								</pre>
							),
							ul: ({ children, ...props }) => (
								<ul className="list-disc pl-5 space-y-2" {...props}>
									{children}
								</ul>
							),
							ol: ({ children, ...props }) => (
								<ol className="list-decimal pl-5 space-y-2" {...props}>
									{children}
								</ol>
							),
							li: ({ children, ...props }) => (
								<li className="text-base leading-relaxed pl-1" {...props}>
									{children}
								</li>
							),
							h1: ({ children, ...props }) => (
								<h1
									className="text-2xl font-semibold mt-8 mb-4 text-[var(--foreground)]"
									{...props}
								>
									{children}
								</h1>
							),
							h2: ({ children, ...props }) => (
								<h2 className="text-xl font-semibold mt-8 mb-4 text-[var(--foreground)]" {...props}>
									{children}
								</h2>
							),
							h3: ({ children, ...props }) => (
								<h3 className="text-lg font-semibold mt-6 mb-3 text-[var(--foreground)]" {...props}>
									{children}
								</h3>
							),
							h4: ({ children, ...props }) => (
								<h4
									className="text-base font-semibold mt-6 mb-3 text-[var(--foreground)]"
									{...props}
								>
									{children}
								</h4>
							),
							blockquote: ({ children, ...props }) => (
								<blockquote
									className="border-l-2 border-yellow-600 dark:border-yellow-500 pl-4 py-1 text-[var(--muted-foreground)] italic my-4"
									{...props}
								>
									{children}
								</blockquote>
							),
							hr: ({ ...props }) => <hr className="border-[var(--border)] my-6" {...props} />,
						}}
					>
						{post.content}
					</ReactMarkdown>
				</div>
			</article>

			{/* Back to blog link at bottom */}
			<div className="animate-in animate-delay-2 w-full">
				<Link
					className="group flex items-center gap-2 w-full touch-target"
					aria-label="Go to blog"
					href="/blog"
				>
					<span className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200">
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
		<div className="relative min-h-screen w-full bg-[var(--background)]">
			{/* Subtle background gradient */}
			<div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10 pointer-events-none" />

			{/* Main content */}
			<div className="relative flex justify-center py-8 px-4 sm:py-10 md:py-12 safe-top safe-bottom">
				<div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center w-full max-w-2xl">
					<Suspense
						fallback={
							<div className="animate-pulse w-full">
								<div className="h-8 bg-[var(--muted)] rounded w-3/4 mb-4" />
								<div className="h-4 bg-[var(--muted)] rounded w-1/2 mb-8" />
								<div className="h-4 bg-[var(--muted)] rounded w-full mb-2" />
								<div className="h-4 bg-[var(--muted)] rounded w-full mb-2" />
								<div className="h-4 bg-[var(--muted)] rounded w-3/4" />
							</div>
						}
					>
						<BlogPostContent slug={slug} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
