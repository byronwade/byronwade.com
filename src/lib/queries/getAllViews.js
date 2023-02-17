import { graphqlQuery } from "../graphqlQuery";

export const GET_ALL_POST_VIEWS = `
	query {
		totalPostViews
	}
`;

export async function getAllViews() {
	const res = await graphqlQuery(GET_ALL_POST_VIEWS);
	return res.totalPostViews;
}
