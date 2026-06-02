import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BreadcrumbNav } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { getBlogPosts } from "@/lib/blog";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";

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
		<div className="flex flex-col gap-1.5 sm:gap-2">
			{posts.length === 0 ? (
				<p className="text-[var(--muted-foreground)] text-base sm:text-lg leading-relaxed">
					No blog posts yet. Check back soon!
				</p>
			) : (
				posts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="flex flex-col gap-3 sm:gap-2 w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1.5"
					>
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="inline-flex items-center gap-1 text-xs shrink-0 text-teal-600 dark:text-teal-400">
										<Clock className="size-3" />
										{post.readingTime} min
									</span>
									<p className="font-medium text-[var(--foreground)] text-base sm:text-base underline-animate mobile-text">
										{post.title}
									</p>
								</div>
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

			<SiteShell>
				<div className="flex flex-col gap-8 sm:gap-10">
					<div className="animate-in w-full">
						<BreadcrumbNav
							items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
							className="mb-4"
						/>
						<h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
							Blog
						</h1>
						<p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
							Insights on web development, React, Next.js, performance, and building software for
							service businesses.
						</p>
					</div>

					<div className="animate-in animate-delay-1 w-full">
						<Suspense
							fallback={
								<div className="animate-pulse space-y-4">
									<div className="h-16 rounded-lg bg-muted" />
									<div className="h-16 rounded-lg bg-muted" />
									<div className="h-16 rounded-lg bg-muted" />
								</div>
							}
						>
							<BlogList />
						</Suspense>
					</div>
				</div>
			</SiteShell>
		</>
	);
}
