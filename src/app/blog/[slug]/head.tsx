"use client";
import { ArticleJsonLd } from "next-seo";
import { useEffect, useState } from "react";
import graphQLClient from "src/lib/graphql-client";
import { GET_POST_BY_SLUG } from "./GET_POST_BY_SLUG";

export default function Head({ params }) {
	const [post, setPost] = useState({
		title: "",
		excerpt: "",
		featuredImage: "",
		date: "",
	});
	useEffect(() => {
		graphQLClient
			.request(GET_POST_BY_SLUG, { slug: params.slug })
			.then((data) => {
				setPost(data.postBy);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [params.slug]);

	const excerpt = post.excerpt.replace(/<[^>]+>/g, "");
	const ogImage = post.featuredImage
		? post.featuredImage
		: `https://byronwade.com/api/og?title=${post.title}`;

	return (
		<>
			<title>{`${post.title} – Byron Wade`}</title>
			<meta content={excerpt} name="description" />
			<meta
				property="og:url"
				content={`https://byronwade.com/blog/${params.slug}`}
			/>
			<link
				rel="canonical"
				href={`https://byronwade.com/blog/${params.slug}`}
			/>
			<meta property="og:description" content={excerpt} />
			<meta property="og:title" content={post.title} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:image:url" content={ogImage}></meta>
			<meta name="twitter:title" content={post.title} />
			<meta name="twitter:description" content={excerpt} />
			<meta name="twitter:image" content={ogImage} />
			<meta property="article:published_time" content={post.date} />
			<ArticleJsonLd
				useAppDir={true}
				type="BlogPosting"
				url="https://example.com/blog"
				title="Blog headline"
				images={[
					"https://example.com/photos/1x1/photo.jpg",
					"https://example.com/photos/4x3/photo.jpg",
					"https://example.com/photos/16x9/photo.jpg",
				]}
				datePublished="2015-02-05T08:00:00+08:00"
				dateModified="2015-02-05T09:00:00+08:00"
				authorName="Jane Blogs"
				description="This is a mighty good description of this blog."
			/>
		</>
	);
}
