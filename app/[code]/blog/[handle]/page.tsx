import { notFound } from "next/navigation";
import { getBlogPost } from "@/app/actions/shopify/getBlogPosts";

interface PageProps {
	params: Promise<{ handle: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
	const { handle } = await params;
	const post = await getBlogPost(handle);

	if (!post) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<article className="prose prose-lg mx-auto">
				<h1>{post.title}</h1>
				<time className="text-muted-foreground">{new Date(post.date).toLocaleDateString()}</time>
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
			</article>
		</div>
	);
}

export async function generateMetadata({ params }: PageProps) {
	const { handle } = await params;
	const post = await getBlogPost(handle);

	if (!post) {
		return {
			title: "Post Not Found",
			description: "The requested blog post could not be found",
		};
	}

	return {
		title: post.title,
		description: post.excerpt || `Read ${post.title} on Byron Wade's blog`,
	};
}
