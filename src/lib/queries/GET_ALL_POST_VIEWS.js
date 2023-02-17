import { gql } from "graphql-request";

export const GET_ALL_POST_VIEWS = gql`
	query {
		totalPostViews
	}
`;
