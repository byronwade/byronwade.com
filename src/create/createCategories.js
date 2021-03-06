const path = require(`path`);
module.exports = async ({ actions, graphql }) => {
	const GET_CATEGORIES = `
  query GET_CATEGORIES($first: Int, $after: String) {
    wordpress {
      categories(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          categoryId
          slug
        }
      }
    }
  }
  `;
	const { createPage } = actions;
	const allTags = [];
	const fetchTags = async (variables) =>
		await graphql(GET_CATEGORIES, variables).then(({ data }) => {
			const {
				wordpress: {
					categories: {
						nodes,
						pageInfo: { hasNextPage, endCursor },
					},
				},
			} = data;
			nodes.map((category) => {
				allTags.push(category);
			});
			if (hasNextPage) {
				return fetchTags({ first: 100, after: endCursor });
			}
			return allTags;
		});
	await fetchTags({ first: 100, after: null }).then((allTags) => {
		allTags.map((category) => {
			console.log(`create category: ${category.slug}`);
			createPage({
				path: `/blog/category/${category.slug}`,
				component: path.resolve(`./src/components/templates/category.js`),
				context: category,
			});
		});
	});
};
