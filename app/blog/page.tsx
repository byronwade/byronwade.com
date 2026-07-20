import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
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
		<div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
			{posts.map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-muted"
				>
					<div className="flex items-start justify-between gap-4">
						<span className="truncate font-medium text-foreground transition-colors group-hover:text-brand">
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
					<header className="reveal flex w-full flex-col gap-3">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							Writing
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
							Insights on web development, React, Next.js, performance, and building software for
							service businesses.
						</p>
					</header>

					<div className="reveal reveal-delay-1 w-full">
						<Suspense
							fallback={
								<div className="animate-pulse space-y-2">
									<div className="h-16 rounded-2xl bg-muted" />
									<div className="h-16 rounded-2xl bg-muted" />
									<div className="h-16 rounded-2xl bg-muted" />
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
