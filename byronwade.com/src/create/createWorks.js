const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_WORKS = `
  query GET_WORKS($first:Int $after:String){
    wordpress {
      works(first: $first after: $after where: {parent: null}) {
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
  const allWorks = []
  const fetchPages = async variables =>
    await graphql(GET_WORKS, variables).then(({ data }) => {
      const {
        wordpress: {
          works: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data
      nodes.map(page => {
        allWorks.push(page)
      })
      if (hasNextPage) {
        return fetchPages({ first: variables.first, after: endCursor })
      }
      return allWorks
    })

  await fetchPages({ first: 100, after: null }).then(allWorks => {
    const pageTemplate = path.resolve(`./src/templates/work.js`)

    allWorks.map(page => {
      console.log(`create work: ${page.uri}`)
      createPage({
        path: `/${page.uri}`,
        component: pageTemplate,
        context: page,
      })
    })
  })
}