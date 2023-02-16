"use client";
import { useEffect, useState } from "react";
import { GET_POST_BY_SLUG } from "./GET_POST_BY_SLUG";
import graphQLClient from "../../../lib/graphql-client";
import ViewCounter from "../view-counter";
import {
	ArrowIcon,
	GitHubIcon,
	TwitterIcon,
	YoutubeIcon,
} from "src/components/icons";
import Balancer from "react-wrap-balancer";
import JSONLD from "./JSONLD";

export default function Blogs({ params }) {
	const [post, setPost] = useState({
		title: "",
		content: "",
		date: "",
		slug: "",
		// Add default values for any other post properties that you are using
	});

	const date = new Date(post.date);

	const options = {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	} as Intl.DateTimeFormatOptions;
	const formattedDate = date.toLocaleDateString("en-US", options);

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
		<>
			<JSONLD />
			<div>
				<h1 className="font-bold text-3xl max-w-[650px]">
					<Balancer>{post.title}</Balancer>
				</h1>
				<div className="grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]">
					<div className="bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 tracking-tighter">
						{formattedDate}
					</div>
					<div className="h-[0.2em] bg-neutral-50 dark:bg-neutral-800 mx-2" />
					<ViewCounter slug={post.slug} trackView />
				</div>
				<div className="prose prose-xl mb-10">
					<div dangerouslySetInnerHTML={{ __html: post.content }} />
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
		</>
	);
}
