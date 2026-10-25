import { notFound } from "next/navigation";
import { PostRow } from "@/components/blog/post-row";
import { TopicNav } from "@/components/blog/topic-nav";
import { IndexList } from "@/components/common";
import { JsonLd } from "@/components/common/json-ld";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { getBlogTopics } from "@/lib/blog";
import { ArrowLeft } from "@/lib/icons";
import {
	generateBreadcrumbStructuredData,
	generateOGImageUrl,
	generateMetadata as generateSEOMetadata,
} from "@/lib/seo";
import { siteUrl } from "@/lib/site";

interface TopicPageProps {
	params: Promise<{ topic: string }>;
}

/** Only topics the loader derives are pages; any other URL is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
	const topics = await getBlogTopics();
	return topics.map((topic) => ({ topic: topic.slug }));
}

async function findTopic(slug: string) {
	const topics = await getBlogTopics();
	return { topics, topic: topics.find((candidate) => candidate.slug === slug) };
}

export async function generateMetadata({
	params,
}: TopicPageProps): Promise<import("next").Metadata> {
	const { topic } = await findTopic((await params).topic);
	if (!topic) {
		return {};
	}
	const description = `Byron Wade's writing tagged ${topic.label}: ${topic.posts.length} posts from building products and running a service business.`;
	return generateSEOMetadata({
		title: `${topic.label} · Writing`,
		description,
		keywords: ["Blog", "Writing", topic.label, "Byron Wade"],
		image: generateOGImageUrl({ title: topic.label, description, type: "blog" }),
		type: "website",
		canonical: `${siteUrl}/blog/topic/${topic.slug}`,
	});
}

/**
 * One topic's posts: the writing index narrowed, not a new layout. The same
 * header, topic links and PostRow chronology as /blog, so moving between them
 * changes the list and nothing else.
 */
export default async function TopicPage({ params }: TopicPageProps) {
	const { topics, topic } = await findTopic((await params).topic);
	if (!topic) {
		notFound();
	}

	const url = `${siteUrl}/blog/topic/${topic.slug}`;
	const count = topic.posts.length;

	return (
		<>
			<JsonLd
				data={generateBreadcrumbStructuredData([
					{ name: "Home", url: siteUrl },
					{ name: "Blog", url: `${siteUrl}/blog` },
					{ name: topic.label, url },
				])}
			/>
			<SiteShell profile="showcase">
				<PageHeader
					lede={`${count} posts tagged ${topic.label}, newest first.`}
					title={topic.label}
				/>
				<TopicNav current={topic.slug} topics={topics} />
				<IndexList as="ol">
					{topic.posts.map((post) => (
						<PostRow key={post.slug} post={post} tagLimit={4} />
					))}
				</IndexList>
				{/* The shared Link, as on a post's foot. It also keeps this route's client
				    manifest owning that module, so the page never downloads /blog's chunk
				    (docs/PERFORMANCE.md, route chunk ownership). */}
				<Link className="link-action w-fit" href="/blog">
					<ArrowLeft aria-hidden="true" className="size-4" />
					Back to writing
				</Link>
			</SiteShell>
		</>
	);
}
