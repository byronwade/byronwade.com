import { gql } from "graphql-request";

export const GET_MENU_ITEMS = gql`
	query {
		menu(id: "Primary", idType: NAME) {
			menuItems {
				nodes {
					url
					order
					label
					uri
					path
				}
			}
		}
	}
`;
