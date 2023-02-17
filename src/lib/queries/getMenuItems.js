import { graphqlQuery } from "../graphqlQuery";

export const GET_MENU_ITEMS = `
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

export async function getMenu() {
	const res = await graphqlQuery(GET_MENU_ITEMS);
	return res.menu.menuItems.nodes;
}
