import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
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

	if (posts.length === 0) {
		return (
			<p className="text-sm leading-relaxed text-muted-foreground">
				No blog posts yet. Check back soon.
			</p>
		);
	}

	return (
		<div className="surface-panel divide-y divide-border overflow-hidden">
			{posts.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group flex flex-col gap-1.5 px-5 py-5 transition-colors hover:bg-muted"
				>
					<div className="flex items-start justify-between gap-4">
						<span className="truncate font-bold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
							{post.title}
						</span>
						<div className="flex shrink-0 items-center gap-2.5 text-xs text-muted-foreground">
							<Badge variant="muted">
								<Clock />
								{post.readingTime} min
							</Badge>
							{post.date && (
								<time className="hidden sm:inline">
									{format(new Date(post.date), "MMM d, yyyy")}
								</time>
							)}
						</div>
					</div>
					{post.excerpt && (
						<p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
							{post.excerpt}
						</p>
					)}
				</Link>
			))}
		</div>
	);
}

export default function BlogPage() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: baseUrl },
		{ name: "Blog", url: `${baseUrl}/blog` },
	]);

	return (
		<>
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

			<PageHero
				variant="index"
				eyebrow="Notes"
				title="Writing"
				description="Insights on web development, React, Next.js, performance, and building software for service businesses."
			/>

			<SiteShell flush className="pb-[var(--space-section-y)]">
				<div className="reveal w-full">
					<Suspense
						fallback={
							<div className="animate-pulse space-y-2">
								<div className="h-16 rounded-lg bg-muted" />
								<div className="h-16 rounded-lg bg-muted" />
								<div className="h-16 rounded-lg bg-muted" />
							</div>
						}
					>
						<BlogList />
					</Suspense>
				</div>
			</SiteShell>
		</>
	);
}
