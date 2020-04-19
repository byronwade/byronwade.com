const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_CASES = `
  query GET_CASES($first:Int $after:String){
    wordpress {
      casestudys(first: $first after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          slug
          date
          title
          excerpt
          uri
        }
      }
    }
  }
  `
  const { createPage } = actions
  const allCases = []
  const casesPages = []
  let pageNumber = 0
  const fetchCases = async variables =>
    await graphql(GET_CASES, variables).then(({ data }) => {
      const {
        wordpress: {
          casestudys: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data

      const nodeIds = nodes.map(node => node.postId)
      const casesTemplate = path.resolve(`./src/components/templates/cases.js`)
      const casesPagePath = pageNumber === 0 ? `/case-study/` : !variables.after ? `/case-study/` : `/case-study/${pageNumber}`

      casesPages[pageNumber] = {
        path: casesPagePath,
        component: casesTemplate,
        context: {
          ids: nodeIds,
          pageNumber: pageNumber,
          hasNextPage: hasNextPage,
        },
        ids: nodeIds,
      }
      nodes.map(work => {
        allCases.push(work)
      })
      if (hasNextPage) {
        pageNumber++
        return fetchCases({ first: 12, after: endCursor })
      }
      return allCases
    })

  await fetchCases({ first: 12, after: null }).then(allCases => {

    casesPages.map(casesPage => {
      console.log(`createCasesPage ${casesPage.context.pageNumber}`)
      createPage(casesPage)
    })
    
    allCases.map(cases => {
      console.log(`create case: ${cases.uri}`)
      createPage({
        path: `${cases.uri}`,
        component: path.resolve(`./src/components/templates/case.js`),
        context: cases,
      })
    })
    
  })

}