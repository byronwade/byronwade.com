"use client";
import { useEffect, useState } from "react";
import { GET_POST_BY_SLUG } from "./GET_POST_BY_SLUG";
import graphQLClient from "../../../components/graphql-client";
import ViewCounter from "../view-counter";
import {
	ArrowIcon,
	GitHubIcon,
	TwitterIcon,
	YoutubeIcon,
} from "src/components/icons";

export default function Blogs({ params }) {
	const [post, setPost] = useState({
		title: "",
		content: "",
		// Add default values for any other post properties that you are using
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

	if (!post) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="prose prose-xl mb-10">
				<h1 className="mt-0">{post.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
				<ViewCounter slug={params.slug} trackView />
			</div>

			<div className="flex flex-col gap-2 md:flex-row md:gap-2 mb-40">
				<a
					rel="noopener noreferrer"
					target="_blank"
					href="https://twitter.com/leeerob"
					className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
				>
					<div className="flex items-center">
						<TwitterIcon />
						<div className="ml-3">Twitter</div>
					</div>
					<ArrowIcon />
				</a>
				<a
					rel="noopener noreferrer"
					target="_blank"
					href="https://github.com/leerob"
					className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
				>
					<div className="flex items-center">
						<GitHubIcon />
						<div className="ml-3">GitHub</div>
					</div>
					<ArrowIcon />
				</a>
				<a
					rel="noopener noreferrer"
					target="_blank"
					href="https://www.youtube.com/@leerob"
					className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
				>
					<div className="flex items-center">
						<YoutubeIcon />
						<div className="ml-3">YouTube</div>
					</div>
					<ArrowIcon />
				</a>
			</div>
		</div>
	);
}
