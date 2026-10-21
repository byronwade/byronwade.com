import Link from "next/link";
import { PostRow } from "@/components/blog/post-row";
import { IndexList } from "@/components/common";
import { Section } from "@/components/layout/page";
import { getBlogPosts } from "@/lib/blog";

// Thorbis chronological rows; dates and excerpts remain server-rendered.
async function BlogList() {
	const posts = await getBlogPosts();
	const recentPosts = posts.slice(0, 3);

	if (recentPosts.length === 0) {
		return (
			<p className="text-copy-14 text-muted-foreground">
				Nothing published yet. The first post is in progress.
			</p>
		);
	}

	return (
		<IndexList>
			{recentPosts.map((post) => (
				<PostRow key={post.slug} post={post} tagLimit={3} />
			))}
		</IndexList>
	);
}

export function HomeBlog() {
	return (
		<Section
			description="Notes from building products and running a service business."
			link={
				<Link prefetch={false} className="link-action shrink-0" href="/blog">
					All writing
				</Link>
			}
			title="Writing"
		>
			<BlogList />
		</Section>
	);
}
