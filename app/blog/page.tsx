import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { JsonLd } from "@/components/common/json-ld";
import { TagList } from "@/components/common/tag-list";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
	generateWebSiteStructuredData,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export async function generateMetadata() {
	const ogImage = generateOGImageUrl({
		title: "Writing",
		description: "Notes on building products, design systems, and software for service businesses.",
		type: "blog",
	});

	return generateSEOMetadata({
		title: "Writing",
		description:
			"Notes on building products, design systems, and software for service businesses — from field operations to modern Next.js apps.",
		keywords: [
			"Blog",
			"Writing",
			"Field Service",
			"Design Systems",
			"Next.js",
			"Product Engineering",
			"Service Business Software",
			"Byron Wade",
		],
		image: ogImage,
		type: "website",
		canonical: `${siteUrl}/blog`,
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
					{post.tags && post.tags.length > 0 && (
						<TagList tags={post.tags} limit={4} className="pt-0.5" />
					)}
				</Link>
			))}
		</div>
	);
}

export default function BlogPage() {
	// Generate structured data
	const websiteStructuredData = generateWebSiteStructuredData();
	const breadcrumbStructuredData = generateBreadcrumbStructuredData([
		{ name: "Home", url: siteUrl },
		{ name: "Blog", url: `${siteUrl}/blog` },
	]);

	return (
		<>
			{/* Structured Data */}
			<JsonLd data={websiteStructuredData} />
			<JsonLd data={breadcrumbStructuredData} />

			<SiteShell>
				<div className="flex flex-col gap-8 sm:gap-10">
					<header className="reveal flex w-full flex-col gap-3">
						<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							Writing
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
							Notes from building products and running a service business — design systems, field
							ops, and the software that has to work in the truck.
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
