const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_CASES = `
  query GET_CASES($first:Int $after:String){
    wordpress {
      cases(first: $first after: $after where: {parent: null}) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          title
          id
          slug
          uri
        }
      }
    }
  }
  `
  const { createPage } = actions
  const allCases = []
  const fetchPages = async variables =>
    await graphql(GET_CASES, variables).then(({ data }) => {
      const {
        wordpress: {
          cases: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data
      nodes.map(page => {
        allCases.push(page)
      })
      if (hasNextPage) {
        return fetchPages({ first: variables.first, after: endCursor })
      }
      return allCases
    })

  await fetchPages({ first: 100, after: null }).then(allCases => {
    const pageTemplate = path.resolve(`./src/templates/case.js`)

    allCases.map(page => {
      console.log(`create case: ${page.uri}`)
      createPage({
        path: `/${page.uri}`,
        component: pageTemplate,
        context: page,
      })
    })
  })
}