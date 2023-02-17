import { graphqlQuery } from "../graphqlQuery";

export const GET_POSTS = `
	query {
		posts {
			nodes {
				id
				title
				date
				excerpt
				isSticky
				slug
				viewCount(doNotRegister: true)
				featuredImage {
					node {
						altText
						mediaItemUrl
						sourceUrl(size: LARGE)
					}
				}
			}
		}
	}
`;

export async function getPosts() {
	const res = await graphqlQuery(GET_POSTS);
	return res.posts.nodes;
}
