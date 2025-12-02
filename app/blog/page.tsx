import { getBlogPosts } from "@/lib/blog";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { format } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const ogImage = generateOGImageUrl({
		title: "Blog",
		description:
			"Read insights, tutorials, and thoughts on web development, JavaScript, React, and modern web technologies.",
		type: "blog",
	});

	return generateSEOMetadata({
		title: "Blog",
		description:
			"Read insights, tutorials, and thoughts on web development, JavaScript, React, Next.js, and modern web technologies from Byron Wade, a full-stack developer.",
		keywords: [
			"Blog",
			"Web Development",
			"JavaScript",
			"React",
			"Next.js",
			"Programming",
			"Tutorial",
			"Tech Blog",
		],
		image: ogImage,
		type: "website",
		canonical: `${baseUrl}/blog`,
	});
}

async function BlogList() {
	const posts = await getBlogPosts();

	return (
		<div className="flex flex-col gap-4 sm:gap-4">
			{posts.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No blog posts yet. Check back soon!
				</p>
			) : (
				posts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="flex flex-col gap-3 sm:gap-2 w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-3 sm:py-2"
					>
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
							<div className="flex-1 min-w-0">
								<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text">
									{post.title}
								</p>
								{post.excerpt && (
									<p className="text-sm sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors mt-2 sm:mt-1 leading-relaxed">
										{post.excerpt}
									</p>
								)}
							</div>
							{post.date && (
								<p className="text-xs sm:text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors shrink-0 sm:ml-2">
									{format(new Date(post.date), "MMM d, yyyy")}
								</p>
							)}
						</div>
					</Link>
				))
			)}
		</div>
	);
}

export default function BlogPage() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

	// Generate structured data
	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Blog", url: `${baseUrl}/blog` },
	]);

	return (
		<>
			{/* Structured Data */}
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
			/>

			<div className="relative min-h-screen w-full bg-[var(--background)]">
				{/* Subtle background gradient */}
				<div className="fixed inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[hsl(var(--muted))] opacity-30 dark:opacity-10 pointer-events-none" />

				{/* Main content */}
				<div className="relative flex justify-center py-8 px-4 sm:py-12 md:py-16 lg:py-20 safe-top safe-bottom">
					<div className="flex flex-col gap-6 sm:gap-10 md:gap-12 lg:gap-16 items-center w-full max-w-2xl">
						{/* Header Section */}
						<div className="animate-in w-full">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<Link
									className="group flex items-center gap-2 w-full touch-target"
									aria-label="Go to home"
									href="/"
								>
									<span className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:text-yellow-600 dark:hover:text-yellow-500 transition-all duration-200">
										← Back to home
									</span>
								</Link>

								<h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight">
									Blog
								</h1>
								<p className="text-[var(--muted-foreground)] text-base leading-relaxed max-w-2xl">
									Insights, tutorials, and thoughts on web development, JavaScript, React, Next.js,
									and modern web technologies. Covering performance optimization, SEO best
									practices, and building scalable applications.
								</p>
							</div>
						</div>

						{/* Blog Posts List */}
						<div className="animate-in animate-delay-1 w-full">
							<Suspense
								fallback={
									<div className="animate-pulse">
										<div className="h-16 bg-[var(--muted)] rounded mb-4" />
										<div className="h-16 bg-[var(--muted)] rounded mb-4" />
										<div className="h-16 bg-[var(--muted)] rounded" />
									</div>
								}
							>
								<BlogList />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
