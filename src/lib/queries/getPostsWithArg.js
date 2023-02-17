import { graphqlQuery } from "../graphqlQuery";

export const GET_POST_BY_SLUG = `
	query getPostBySlug($slug: String!) {
		postBy(slug: $slug) {
			content
			date
			id
			title
			excerpt
			slug
			viewCount
			featuredImage {
				node {
					altText
					mediaItemUrl
					sourceUrl(size: LARGE)
				}
			}
		}
	}
`;

export async function getPost(params) {
	const res = await graphqlQuery(GET_POST_BY_SLUG, { slug: params.slug });
	return res.postBy;
}
