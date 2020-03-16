const path = require(`path`)
const slash = require(`slash`)
const blocks = require(`./blocks/all`)

module.exports = async ({ actions, graphql }) => {
  const GET_WORKS = `
  query GET_WORKS($first:Int){
    wordpress {
      works( first: $first ) {
        nodes {
            blocks {
              isValid
              originalContent
              name
              ${blocks.coreP}
              ${blocks.coreHeading}
            }
            content
            id
            slug
            title
            excerpt
            uri
            date
          }
      }
    }
  }
  `
  const { createPage } = actions

  const fetchPosts = async variables =>
    await graphql(GET_WORKS, variables).then(({ data }) => {
      return data.wordpress.works.nodes
    })

  await fetchPosts({ first: 500 }).then(allPosts => {


    const worksPerPage = 15
    const numberOfPages = Math.ceil(allPosts.length / worksPerPage)
    const blogPostListTemplate = path.resolve('./src/templates/work.js')
  
    Array.from({length: numberOfPages}).forEach((page, index) => {
        createPage({
            component: slash(blogPostListTemplate),
            path: index === 0 ? '/work' : `/work/${index + 1}`,
            context: {
                works: allPosts.slice(index * worksPerPage, (index * worksPerPage) + worksPerPage),
                numberOfPages,
                currentPage: index + 1
            }
        })
    })

    allPosts.map(work => {
      console.log(`Create Work: ${work.slug}`)

      actions.createPage({
        path: `/work/${work.slug}`,
        component: path.resolve(`./src/templates/workPage.js`),
        context: {
          ...work,
          id: work.id,
          slug: work.uri,
          title: work.title,
        },
      })
    })
  })
}
