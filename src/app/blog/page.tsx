import { getPosts } from "../../lib/queries/getPosts";
import Link from "next/link";
import { Suspense } from "react";

export default async function Blogs() {
	const [posts] = await Promise.all([getPosts()]);

	return (
		<section className="pb-40">
			<h1 className="font-bold text-4xl mb-5">Blog</h1>
			<Suspense fallback={<div>Loading...</div>}>
				{posts.map((post) => (
					<Link
						key={post.slug}
						className="flex flex-col space-y-1 mb-4"
						href={`/blog/${post.slug}`}
					>
						<div className="w-full flex flex-col">
							<p>{post.title}</p>
							<p className="font-mono text-sm text-neutral-500 tracking-tighter">
								{`${post.viewCount} views`}
							</p>
						</div>
					</Link>
				))}
			</Suspense>
		</section>
	);
}
