import { gql } from "graphql-request";

export const GET_POSTS = gql`
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
