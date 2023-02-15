import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://your-wordpress-site.com/graphql", {
	headers: {
		Authorization: `Bearer YOUR_WP_ACCESS_TOKEN`,
	},
});

export default function ViewCounter({ slug, trackView = true }) {
	const [viewCount, setViewCount] = useState(0);

	useEffect(() => {
		// Get the current view count for the post
		const query = `
      query GetPostViewCount($slug: String!) {
        postBy(slug: $slug) {
          databaseId
          meta(key: "post_views_count") {
            value
          }
        }
      }
    `;

		const variables = {
			slug: slug,
		};

		client
			.request(query, variables)
			.then((data) => {
				const viewCount = data.postBy.meta.value || 0;
				setViewCount(viewCount);
			})
			.catch((error) => {
				console.error(error);
			});

		if (trackView) {
			// Increment the view count and send it to the WordPress site when the component is unmounted
			return () => {
				const mutation = `
          mutation UpdatePostViewCount($postId: ID!, $viewCount: Int!) {
            updatePost(input: {
              id: $postId
              meta: {
                key: "post_views_count"
                value: $viewCount
              }
            }) {
              post {
                databaseId
              }
            }
          }
        `;

				const variables = {
					postId: post.databaseId,
					viewCount: viewCount + 1,
				};

				client
					.request(mutation, variables)
					.then((data) => {
						console.log(
							"View count updated for post ID:",
							data.updatePost.post.databaseId
						);
					})
					.catch((error) => {
						console.error(error);
					});
			};
		}
	}, []);

	return <p>View count: {viewCount}</p>;
}
