import { gql } from "graphql-request";

export const GET_POST_BY_SLUG = gql`
	query getPostBySlug($slug: String!) {
		postBy(slug: $slug) {
			content
			date
			id
			title
			excerpt
			slug
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
