import { allBlogs } from "contentlayer/generated";

export default async function Head({ params }) {
	const post = allBlogs.find((post) => post.slug === params.slug) || {
		title: "Not Found",
		summary: "This page could not be found.",
		image: "https://byronwade.com/api/og?title=Not%20Found",
		publishedAt: new Date().toISOString(),
	};

	const ogImage = post.image
		? post.image
		: `https://byronwade.com/api/og?title=${post.title}`;

	return (
		<>
			<title>{`${post.title} – Byron Wade`}</title>
			<meta content={post.summary} name='description' />
			<meta
				property='og:url'
				content={`https://byronwade.com/blog/${params.slug}`}
			/>
			<link
				rel='canonical'
				href={`https://byronwade.com/blog/${params.slug}`}
			/>
			<meta property='og:description' content={post.summary} />
			<meta property='og:title' content={post.title} />
			<meta property='og:image' content={ogImage} />
			<meta property='og:image:url' content={ogImage}></meta>
			<meta name='twitter:title' content={post.title} />
			<meta name='twitter:description' content={post.summary} />
			<meta name='twitter:image' content={ogImage} />
			<meta property='article:published_time' content={post.publishedAt} />
		</>
	);
}
