// import { useState, useEffect } from "react";
// import { GraphQLClient } from "graphql-request";

// const client = new GraphQLClient("https://your-wordpress-site.com/graphql", {
// 	headers: {
// 		Authorization: `Bearer YOUR_WP_ACCESS_TOKEN`,
// 	},
// });

// export default function ViewCounter({ slug, trackView = true }) {
// 	const [viewCount, setViewCount] = useState(0);

// 	useEffect(() => {
// 		// Get the current view count for the post
// 		const query = `
//       query GetPostViewCount($slug: String!) {
//         postBy(slug: $slug) {
//           databaseId
//           meta(key: "post_views_count") {
//             value
//           }
//         }
//       }
//     `;

// 		const variables = {
// 			slug: slug,
// 		};

// 		client
// 			.request(query, variables)
// 			.then((data) => {
// 				const viewCount = data.postBy.meta.value || 0;
// 				setViewCount(viewCount);
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 			});

// 		if (trackView) {
// 			// Increment the view count and send it to the WordPress site when the component is unmounted
// 			return () => {
// 				const mutation = `
//           mutation UpdatePostViewCount($postId: ID!, $viewCount: Int!) {
//             updatePost(input: {
//               id: $postId
//               meta: {
//                 key: "post_views_count"
//                 value: $viewCount
//               }
//             }) {
//               post {
//                 databaseId
//               }
//             }
//           }
//         `;

// 				const variables = {
// 					postId: post.databaseId,
// 					viewCount: viewCount + 1,
// 				};

// 				client
// 					.request(mutation, variables)
// 					.then((data) => {
// 						console.log(
// 							"View count updated for post ID:",
// 							data.updatePost.post.databaseId
// 						);
// 					})
// 					.catch((error) => {
// 						console.error(error);
// 					});
// 			};
// 		}
// 	}, []);

// 	return <p>View count: {viewCount}</p>;
// }

"use client";

import { useEffect } from "react";
import useSWR from "swr";

type PostView = {
	slug: string;
	count: string;
};

async function fetcher<JSON = any>(
	input: RequestInfo,
	init?: RequestInit
): Promise<JSON> {
	const res = await fetch(input, init);
	return res.json();
}

export default function ViewCounter({
	slug,
	trackView,
}: {
	slug: string;
	trackView: boolean;
}) {
	const { data } = useSWR<PostView[]>("/api/views", fetcher);
	const viewsForSlug = data && data.find((view) => view.slug === slug);
	const views = new Number(viewsForSlug?.count || 0);

	useEffect(() => {
		const registerView = () => {
			fetch(`/api/views/${slug}`, {
				method: "POST",
			});
			console.log("It was sent");
		};
		if (trackView) {
			console.log(trackView);
			registerView();
		}
	}, [slug]);

	return (
		<p className="font-mono text-sm text-neutral-500 tracking-tighter">
			{data ? `${views.toLocaleString()} views` : "​"}
		</p>
	);
}
