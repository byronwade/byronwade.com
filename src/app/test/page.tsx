"use client";
import graphQLClient from "../../components/graphql-client";
import { useEffect, useState } from "react";
import { GET_POSTS } from "./GET_POSTS";
import ViewCounter from "./view-counter";
import Link from "next/link";

export default function Blogs() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		graphQLClient
			.request(GET_POSTS)
			.then((data) => {
				setPosts(data.posts.nodes);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	if (!posts) {
		return <div>Loading...</div>;
	}

	return (
		<section className="pb-40">
			<h1 className="font-bold text-3xl mb-5">Blog</h1>
			{posts.map((post) => (
				<Link
					key={post.slug}
					className="flex flex-col space-y-1 mb-4"
					href={`/test/${post.slug}`}
				>
					<div className="w-full flex flex-col">
						<p>{post.title}</p>
					</div>
				</Link>
			))}
		</section>
	);
}
