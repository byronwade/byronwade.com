"use client";
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
		</>
	);
}
