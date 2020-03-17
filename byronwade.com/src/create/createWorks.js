const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_WORKS = `
  query GET_WORKS($first:Int $after:String){
    wordpress {
      works(first: $first after: $after) {
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
  const worksPages = []
  let pageNumber = 0
  const fetchWorks = async variables =>
    await graphql(GET_WORKS, variables).then(({ data }) => {
      const {
        wordpress: {
          works: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data

      const nodeIds = nodes.map(node => node.postId)
      const worksTemplate = path.resolve(`./src/templates/works.js`)
      const worksPagePath = pageNumber === 0 ? `/work/` : !variables.after ? `/work/` : `/work/${pageNumber}`

      worksPages[pageNumber] = {
        path: worksPagePath,
        component: worksTemplate,
        context: {
          ids: nodeIds,
          pageNumber: pageNumber,
          hasNextPage: hasNextPage,
        },
        ids: nodeIds,
      }
      nodes.map(work => {
        allWorks.push(work)
      })
      if (hasNextPage) {
        pageNumber++
        return fetchWorks({ first: 12, after: endCursor })
      }
      return allWorks
    })

  await fetchWorks({ first: 12, after: null }).then(allWorks => {

    worksPages.map(worksPage => {
      console.log(`createWorksPage ${worksPage.context.pageNumber}`)
      createPage(worksPage)
    })
    
    allWorks.map(work => {
      console.log(`create work: ${work.uri}`)
      createPage({
        path: `${work.uri}`,
        component: path.resolve(`./src/templates/work.js`),
        context: work,
      })
    })
    
  })

}